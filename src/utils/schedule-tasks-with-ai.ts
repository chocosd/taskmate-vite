import {
    CalendarEvent,
    ScheduledTask,
    SchedulingResult,
    TimeSlot,
} from '@models/calendar.model';
import { Task } from '@models/task.model';
import { TaskDateUtils } from '@utils/helpers/date.helper';
import OpenAI from 'openai';
import { replaceTemplateVariables } from './template-replacer';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    fetch: (url, options = {}) =>
        fetch(url, {
            ...options,
        }),
    ...(import.meta.env.DEV && { dangerouslyAllowBrowser: true }),
});

export async function scheduleTasksWithAI(
    tasks: Task[],
    calendarEvents: CalendarEvent[],
    options?: {
        workStartHour?: number;
        workEndHour?: number;
        maxTaskDuration?: number;
        minTaskDuration?: number;
        includeWeekends?: boolean;
        bufferTime?: number;
        aiTemperature?: number;
        aiModel?: string;
    }
): Promise<SchedulingResult> {
    // Filter out completed tasks, parent tasks, and overdue tasks
    const schedulableTasks = TaskDateUtils.getSchedulableTasks(tasks);

    if (schedulableTasks.length === 0) {
        return {
            feasible: true,
            message:
                'No schedulable tasks found (all tasks are either completed, have subtasks, or are overdue)',
            scheduledTasks: [],
            totalTimeRequired: 0,
            availableTime: 0,
        };
    }

    // Calculate available time slots for the next 7 days
    const timeSlots = calculateAvailableTimeSlots(
        calendarEvents,
        options
    );
    const totalAvailableTime = timeSlots.reduce(
        (total, slot) =>
            total +
            (slot.end.getTime() - slot.start.getTime()) / (1000 * 60),
        0
    );

    // Prepare tasks with estimated durations and priorities
    const tasksWithEstimates = await estimateTaskDurations(
        schedulableTasks,
        options
    );
    const totalTaskTime = tasksWithEstimates.reduce(
        (total, task) => total + task.estimatedDuration,
        0
    );

    // Check if scheduling is feasible
    if (totalTaskTime > totalAvailableTime) {
        return {
            feasible: false,
            message: `Need ${Math.round(totalTaskTime / 60)} hours but only ${Math.round(totalAvailableTime / 60)} hours available`,
            scheduledTasks: [],
            totalTimeRequired: totalTaskTime,
            availableTime: totalAvailableTime,
        };
    }

    // Use AI to optimize task scheduling
    const scheduledTasks = await optimizeTaskScheduling(
        tasksWithEstimates,
        timeSlots,
        options
    );

    return {
        feasible: true,
        message: `Successfully scheduled ${scheduledTasks.length} tasks`,
        scheduledTasks,
        totalTimeRequired: totalTaskTime,
        availableTime: totalAvailableTime,
    };
}

async function estimateTaskDurations(
    tasks: Task[],
    options?: {
        maxTaskDuration?: number;
        minTaskDuration?: number;
        aiTemperature?: number;
        aiModel?: string;
    }
): Promise<
    Array<
        Task & {
            estimatedDuration: number;
            description?: string;
            location?: string;
            tags?: string[];
        }
    >
> {
    const maxDuration = options?.maxTaskDuration || 240; // 4 hours default
    const minDuration = options?.minTaskDuration || 15; // 15 minutes default
    const temperature = options?.aiTemperature || 0.3;
    const model = options?.aiModel || 'gpt-3.5-turbo';

    const promptTemplate =
        import.meta.env.VITE_AI_TASK_DURATION_PROMPT ||
        `
You are a productivity expert. For each task below, estimate how many minutes it would take to complete and provide additional context.
Consider the complexity, scope, and realistic time requirements of each task. Be realistic - don't underestimate complex tasks.

Guidelines:
- Minimum duration: {minDuration} minutes
- Maximum duration: {maxDuration} minutes
- Consider task complexity, research needed, writing time, meetings, etc.
- Break down complex tasks into realistic time estimates
- IMPORTANT: Preserve the original priority and due_date from each task

Return ONLY a JSON array with the task titles, priority, due_date, estimated minutes, description, location, and tags.
IMPORTANT: Include the original priority and due_date exactly as provided in the input.

Format: [{"title": "task title", "priority": "original_priority", "due_date": "original_due_date", "minutes": number, "description": "brief description", "location": "where to do it", "tags": ["tag1", "tag2"]}]

Tasks:
{taskList}
`;

    const prompt = replaceTemplateVariables(promptTemplate, {
        minDuration: String(minDuration),
        maxDuration: String(maxDuration),
        taskList: JSON.stringify(
            tasks.map((task) => ({
                title: task.title,
                due_date: task.due_date,
                priority: task.priority,
            })),
            null,
            2
        ),
    });

    try {
        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a productivity expert specializing in realistic time estimation and task planning.',
                },
                { role: 'user', content: prompt },
            ],
            temperature: temperature,
        });

        const content = response.choices[0].message.content ?? '[]';
        const estimates = JSON.parse(content) as Array<{
            title: string;
            priority?: string;
            due_date?: string;
            minutes: number;
            description?: string;
            location?: string;
            tags?: string[];
        }>;

        return tasks.map((task) => {
            const estimate = estimates.find(
                (e) => e.title === task.title
            );
            const duration =
                estimate?.minutes ||
                getDefaultDuration(task, maxDuration);

            // Ensure duration is within bounds
            const clampedDuration = Math.max(
                minDuration,
                Math.min(maxDuration, duration)
            );

            return {
                ...task,
                estimatedDuration: clampedDuration,
                description:
                    estimate?.description ||
                    `Complete ${task.title.toLowerCase()}`,
                location: estimate?.location || 'Office',
                tags: estimate?.tags || ['work'],
            };
        });
    } catch (error) {
        console.error('Failed to estimate task durations:', error);
        // Fallback to default durations
        return tasks.map((task) => ({
            ...task,
            estimatedDuration: Math.min(
                getDefaultDuration(task, maxDuration),
                maxDuration
            ),
            description: `Complete ${task.title.toLowerCase()}`,
            location: 'Office',
            tags: ['work'],
        }));
    }
}

function getDefaultDuration(task: Task, maxDuration: number): number {
    // More realistic default durations based on priority and task complexity
    const baseDuration =
        task.priority === 'high'
            ? 180
            : task.priority === 'medium'
              ? 120
              : 90; // 3h, 2h, 1.5h

    // Adjust based on task title complexity (simple heuristic)
    const titleLength = task.title.length;
    const wordCount = task.title.split(' ').length;
    const complexityMultiplier = Math.min(
        2,
        Math.max(0.5, titleLength / 50 + wordCount / 5)
    );

    const estimatedDuration = Math.round(
        baseDuration * complexityMultiplier
    );
    return Math.min(estimatedDuration, maxDuration);
}

async function optimizeTaskScheduling(
    tasks: Array<
        Task & {
            estimatedDuration: number;
            description?: string;
            location?: string;
            tags?: string[];
        }
    >,
    timeSlots: TimeSlot[],
    options?: {
        bufferTime?: number;
    }
): Promise<ScheduledTask[]> {
    const bufferTime = options?.bufferTime || 15; // 15 minutes default buffer

    // Sort tasks by priority and due date
    const sortedTasks = [...tasks].sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority || 'medium'];
        const bPriority = priorityOrder[b.priority || 'medium'];

        if (aPriority !== bPriority) {
            return bPriority - aPriority; // Higher priority first
        }

        // Then by due date
        if (a.due_date && b.due_date) {
            return (
                new Date(a.due_date).getTime() -
                new Date(b.due_date).getTime()
            );
        }

        return 0;
    });

    const scheduledTasks: ScheduledTask[] = [];
    const availableSlots = [...timeSlots];

    for (const task of sortedTasks) {
        const slotIndex = availableSlots.findIndex((slot) => {
            const slotDuration =
                (slot.end.getTime() - slot.start.getTime()) /
                (1000 * 60);
            return (
                slotDuration >= task.estimatedDuration + bufferTime
            );
        });

        if (slotIndex === -1) continue; // No suitable slot found

        const slot = availableSlots[slotIndex];
        const taskStart = new Date(slot.start);
        const taskEnd = new Date(
            taskStart.getTime() + task.estimatedDuration * 60 * 1000
        );

        scheduledTasks.push({
            taskId: task.id,
            title: task.title,
            start: taskStart,
            end: taskEnd,
            priority: (task.priority || 'medium') as
                | 'low'
                | 'medium'
                | 'high',
            estimatedDuration: task.estimatedDuration,
            description: task.description,
            location: task.location,
            tags: task.tags,
        });

        console.log('Scheduled task priority debug:', {
            title: task.title,
            originalPriority: task.priority,
            finalPriority: (task.priority || 'medium') as
                | 'low'
                | 'medium'
                | 'high',
        });

        // Update the available slot with buffer time
        const nextStart = new Date(
            taskEnd.getTime() + bufferTime * 60 * 1000
        );
        if (nextStart.getTime() < slot.end.getTime()) {
            // Split the slot if there's remaining time
            availableSlots[slotIndex] = {
                start: nextStart,
                end: slot.end,
                available: true,
            };
        } else {
            // Remove the slot if fully used
            availableSlots.splice(slotIndex, 1);
        }
    }

    return scheduledTasks;
}

function calculateAvailableTimeSlots(
    calendarEvents: CalendarEvent[],
    options?: {
        workStartHour?: number;
        workEndHour?: number;
        includeWeekends?: boolean;
    }
): TimeSlot[] {
    const workStartHour = options?.workStartHour || 9;
    const workEndHour = options?.workEndHour || 17;
    const includeWeekends = options?.includeWeekends || false;

    const slots: TimeSlot[] = [];
    const now = new Date();
    const oneWeekFromNow = new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    // Generate work hours for each day
    for (
        let date = new Date(now);
        date <= oneWeekFromNow;
        date.setDate(date.getDate() + 1)
    ) {
        const dayStart = new Date(date);
        dayStart.setHours(workStartHour, 0, 0, 0);

        const dayEnd = new Date(date);
        dayEnd.setHours(workEndHour, 0, 0, 0);

        // Skip weekends if not included
        if (
            !includeWeekends &&
            (date.getDay() === 0 || date.getDay() === 6)
        )
            continue;

        slots.push({
            start: dayStart,
            end: dayEnd,
            available: true,
        });
    }

    // Remove time slots that conflict with existing calendar events
    const eventsInTimeframe = calendarEvents.filter(
        (event) => event.start >= now && event.start <= oneWeekFromNow
    );

    for (const event of eventsInTimeframe) {
        for (let i = slots.length - 1; i >= 0; i--) {
            const slot = slots[i];

            // Check for overlap
            if (event.start < slot.end && event.end > slot.start) {
                slots.splice(i, 1); // Remove conflicting slot

                // Add remaining parts if any
                if (slot.start < event.start) {
                    slots.push({
                        start: slot.start,
                        end: event.start,
                        available: true,
                    });
                }

                if (event.end < slot.end) {
                    slots.push({
                        start: event.end,
                        end: slot.end,
                        available: true,
                    });
                }
            }
        }
    }

    // Filter out slots that are too small (less than 30 minutes)
    return slots
        .filter((slot) => {
            const duration =
                (slot.end.getTime() - slot.start.getTime()) /
                (1000 * 60);
            return duration >= 30;
        })
        .sort((a, b) => a.start.getTime() - b.start.getTime());
}

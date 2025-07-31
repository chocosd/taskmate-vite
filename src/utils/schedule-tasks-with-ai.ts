import {
    CalendarEvent,
    ScheduledTask,
    SchedulingResult,
    TimeSlot,
} from '@models/calendar.model';
import { Task } from '@models/task.model';
import OpenAI from 'openai';

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
    calendarEvents: CalendarEvent[]
): Promise<SchedulingResult> {
    // Filter out completed tasks and only get top-level tasks
    const incompleteTasks = tasks.filter(
        (task) => !task.completed && !task.parent_id
    );

    if (incompleteTasks.length === 0) {
        return {
            feasible: true,
            message: 'No tasks to schedule',
            scheduledTasks: [],
            totalTimeRequired: 0,
            availableTime: 0,
        };
    }

    // Calculate available time slots for the next 7 days
    const timeSlots = calculateAvailableTimeSlots(calendarEvents);
    const totalAvailableTime = timeSlots.reduce(
        (total, slot) =>
            total +
            (slot.end.getTime() - slot.start.getTime()) / (1000 * 60),
        0
    );

    // Prepare tasks with estimated durations and priorities
    const tasksWithEstimates =
        await estimateTaskDurations(incompleteTasks);
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
        timeSlots
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
    tasks: Task[]
): Promise<Array<Task & { estimatedDuration: number }>> {
    const prompt = `
You are a productivity expert. For each task below, estimate how many minutes it would take to complete. 
Consider the complexity and scope of each task. Return ONLY a JSON array with the task titles and estimated minutes.

Format: [{"title": "task title", "minutes": number}]

Tasks:
${tasks.map((task) => `- ${task.title}`).join('\n')}
`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a productivity expert specializing in time estimation.',
                },
                { role: 'user', content: prompt },
            ],
            temperature: 0.3,
        });

        const content = response.choices[0].message.content ?? '[]';
        const estimates = JSON.parse(content) as Array<{
            title: string;
            minutes: number;
        }>;

        return tasks.map((task) => {
            const estimate = estimates.find(
                (e) => e.title === task.title
            );
            return {
                ...task,
                estimatedDuration:
                    estimate?.minutes || getDefaultDuration(task),
            };
        });
    } catch (error) {
        console.error('Failed to estimate task durations:', error);
        // Fallback to default durations
        return tasks.map((task) => ({
            ...task,
            estimatedDuration: getDefaultDuration(task),
        }));
    }
}

function getDefaultDuration(task: Task): number {
    // Default duration based on priority
    switch (task.priority) {
        case 'high':
            return 120; // 2 hours
        case 'medium':
            return 90; // 1.5 hours
        case 'low':
            return 60; // 1 hour
        default:
            return 90;
    }
}

async function optimizeTaskScheduling(
    tasks: Array<Task & { estimatedDuration: number }>,
    timeSlots: TimeSlot[]
): Promise<ScheduledTask[]> {
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
            return slotDuration >= task.estimatedDuration;
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
        });

        // Update the available slot
        if (taskEnd.getTime() < slot.end.getTime()) {
            // Split the slot if there's remaining time
            availableSlots[slotIndex] = {
                start: taskEnd,
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
    calendarEvents: CalendarEvent[]
): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const now = new Date();
    const oneWeekFromNow = new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    // Generate work hours for each day (9 AM to 6 PM)
    for (
        let date = new Date(now);
        date <= oneWeekFromNow;
        date.setDate(date.getDate() + 1)
    ) {
        const dayStart = new Date(date);
        dayStart.setHours(9, 0, 0, 0);

        const dayEnd = new Date(date);
        dayEnd.setHours(18, 0, 0, 0);

        // Skip weekends for work scheduling
        if (date.getDay() === 0 || date.getDay() === 6) continue;

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

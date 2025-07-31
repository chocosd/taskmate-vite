import { CalendarEvent, ScheduledTask } from '@models/calendar.model';
import { DateTime, DurationUnit } from 'luxon';

// Task-specific date utilities
export const TaskDateUtils = {
    /**
     * Safely parse a task due_date to ISO string for form usage
     * @param dateString - The date string from the task (can be null/undefined)
     * @returns ISO string or empty string if invalid/null
     */
    parseTaskDateToISO: (
        dateString: string | null | undefined
    ): string => {
        if (
            !dateString ||
            dateString === 'null' ||
            dateString === 'undefined'
        ) {
            return '';
        }

        try {
            const parsed = DateTime.fromISO(dateString);

            if (parsed.isValid) {
                return parsed.toISO() || '';
            } else {
                // Try fallback parsing for different date formats
                const fallbackParsed = new Date(dateString);
                if (!isNaN(fallbackParsed.getTime())) {
                    return (
                        DateTime.fromJSDate(fallbackParsed).toISO() ||
                        ''
                    );
                }
            }
        } catch (error) {
            console.error(
                'TaskDateUtils.parseTaskDateToISO error:',
                error
            );
        }

        return '';
    },

    /**
     * Convert a Date object to ISO string for API submission
     * @param date - The Date object to convert
     * @returns ISO string or null if invalid
     */
    dateToISO: (date: Date | null | undefined): string | null => {
        if (!date) return null;

        try {
            const dateTime = DateTime.fromJSDate(date);
            return dateTime.isValid ? dateTime.toISO() : null;
        } catch (error) {
            console.error('TaskDateUtils.dateToISO error:', error);
            return null;
        }
    },

    /**
     * Check if a task is overdue based on its due_date
     * @param task - The task to check
     * @returns true if the task is overdue, false otherwise
     */
    isTaskOverdue: (task: { due_date?: string | null }): boolean => {
        if (!task.due_date) return false;

        try {
            const dueDate = DateTime.fromISO(task.due_date);
            if (!dueDate.isValid) return false;

            const now = DateTime.now();
            return dueDate < now;
        } catch (error) {
            console.error(
                'TaskDateUtils.isTaskOverdue error:',
                error
            );
            return false;
        }
    },

    /**
     * Filter tasks to get only schedulable ones (not completed, no parent, not overdue)
     * @param tasks - Array of tasks to filter
     * @returns Array of schedulable tasks
     */
    getSchedulableTasks: <
        T extends {
            completed?: boolean;
            parent_id?: string;
            due_date?: string | null;
        },
    >(
        tasks: T[]
    ): T[] => {
        return tasks.filter(
            (task) =>
                !task.completed &&
                !task.parent_id &&
                !TaskDateUtils.isTaskOverdue(task)
        );
    },
};

export default function DateHelper(date: string | Date | DateTime) {
    const dateTime = formatDatesToDateTime(date);

    return {
        add: (value: number, unit: DurationUnit = 'days') =>
            dateTime.plus({ [unit]: value }).toISO(),
        subtract: (value: number, unit: DurationUnit = 'days') =>
            dateTime.minus({ [unit]: value }).toISO(),
        format: (formatString: string = 'yyyy-MM-dd') =>
            dateTime.toFormat(formatString),
        toISO: () => dateTime.toISO(),
        raw: () => dateTime,
        formatRelativeDueDate: () => {
            const now = DateTime.now();

            if (dateTime < now) {
                return `Overdue: ${dateTime.toRelative({ base: now })}`;
            }

            return `Due: ${dateTime.toRelative({ base: now })}`;
        },
    };
}

// Calendar-specific utilities
export const CalendarDateUtils = {
    getWeekDates: (date: Date): Date[] => {
        const start = DateTime.fromJSDate(date).startOf('week');
        return Array.from({ length: 7 }, (_, i) =>
            start.plus({ days: i }).toJSDate()
        );
    },

    getWorkHours: (startHour: number = 9, endHour: number = 18) => {
        const hours = [];
        for (let i = startHour; i < endHour; i++) {
            hours.push(i);
        }
        return hours;
    },

    formatTimeRange: (start: Date, end: Date): string => {
        const startTime =
            DateTime.fromJSDate(start).toFormat('h:mm a');
        const endTime = DateTime.fromJSDate(end).toFormat('h:mm a');
        return `${startTime} - ${endTime}`;
    },

    formatDuration: (start: Date, end: Date): string => {
        const durationMinutes =
            (end.getTime() - start.getTime()) / (1000 * 60);
        if (durationMinutes < 60) {
            return `${Math.round(durationMinutes)} minutes`;
        }
        const hours = Math.floor(durationMinutes / 60);
        const minutes = Math.round(durationMinutes % 60);
        return minutes > 0
            ? `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`
            : `${hours} hour${hours > 1 ? 's' : ''}`;
    },

    calculateItemHeight: (
        start: Date,
        end: Date,
        hourHeight: number = 50
    ): number => {
        const durationMinutes =
            (end.getTime() - start.getTime()) / (1000 * 60);
        const hourFraction = durationMinutes / 60;
        return Math.max(hourHeight * hourFraction, 20); // Minimum 20px height
    },

    calculateItemPosition: (
        start: Date,
        hour: number,
        hourHeight: number = 50
    ): number => {
        const startHour = start.getHours();
        const startMinute = start.getMinutes();

        if (startHour === hour) {
            // Item starts in this hour, position it based on minutes
            const minuteFraction = startMinute / 60;
            return minuteFraction * hourHeight;
        }

        // Item started in a previous hour, position at top
        return 0;
    },

    getItemsForDateAndTime: (
        date: Date,
        hour: number,
        events: CalendarEvent[],
        tasks: ScheduledTask[]
    ) => {
        const dateStr =
            DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');

        // Find events that overlap with this hour
        const dayEvents = events.filter((event) => {
            const eventDateStr = DateTime.fromJSDate(
                event.start
            ).toFormat('yyyy-MM-dd');
            if (eventDateStr !== dateStr) return false;

            const eventStartHour = event.start.getHours();
            const eventEndHour = event.end.getHours();
            const eventEndMinute = event.end.getMinutes();

            // Check if this hour overlaps with the event
            return (
                eventStartHour <= hour &&
                (eventEndHour > hour ||
                    (eventEndHour === hour && eventEndMinute > 0))
            );
        });

        // Find tasks that overlap with this hour
        const dayTasks = tasks.filter((task) => {
            const taskDateStr = DateTime.fromJSDate(
                task.start
            ).toFormat('yyyy-MM-dd');
            if (taskDateStr !== dateStr) return false;

            const taskStartHour = task.start.getHours();
            const taskEndHour = task.end.getHours();
            const taskEndMinute = task.end.getMinutes();

            // Check if this hour overlaps with the task
            return (
                taskStartHour <= hour &&
                (taskEndHour > hour ||
                    (taskEndHour === hour && taskEndMinute > 0))
            );
        });

        return { events: dayEvents, tasks: dayTasks };
    },

    groupOverlappingItems: (
        items: (CalendarEvent | ScheduledTask)[]
    ): (CalendarEvent | ScheduledTask)[][] => {
        if (items.length === 0) return [];

        // Sort items by start time
        const sortedItems = [...items].sort(
            (a, b) => a.start.getTime() - b.start.getTime()
        );
        const groups: (CalendarEvent | ScheduledTask)[][] = [];

        for (const item of sortedItems) {
            let placed = false;

            // Try to find a group where this item doesn't overlap with any existing items
            for (const group of groups) {
                const overlaps = group.some((existingItem) => {
                    const itemStart = item.start.getTime();
                    const itemEnd = item.end.getTime();
                    const existingStart =
                        existingItem.start.getTime();
                    const existingEnd = existingItem.end.getTime();

                    // Check if items overlap
                    return (
                        itemStart < existingEnd &&
                        itemEnd > existingStart
                    );
                });

                if (!overlaps) {
                    group.push(item);
                    placed = true;
                    break;
                }
            }

            // If no suitable group found, create a new one
            if (!placed) {
                groups.push([item]);
            }
        }

        return groups;
    },
};

function formatDatesToDateTime(
    date?: string | Date | DateTime
): DateTime<boolean> {
    if (!date) {
        return DateTime.now();
    }
    if (DateTime.isDateTime(date)) {
        return date;
    }
    if (date instanceof Date) {
        return DateTime.fromJSDate(date);
    }
    if (typeof date === 'string') {
        return DateTime.fromISO(date);
    }

    throw new Error('Invalid date format');
}

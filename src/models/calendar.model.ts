export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    description?: string;
    location?: string;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
}

export interface ScheduledTask {
    taskId: string;
    title: string;
    start: Date;
    end: Date;
    priority: 'low' | 'medium' | 'high';
    estimatedDuration: number; // in minutes
    description?: string;
    location?: string;
    tags?: string[];
}

export interface SchedulingResult {
    feasible: boolean;
    message: string;
    scheduledTasks: ScheduledTask[];
    totalTimeRequired: number; // in minutes
    availableTime: number; // in minutes
}

export interface TimeSlot {
    start: Date;
    end: Date;
    available: boolean;
}

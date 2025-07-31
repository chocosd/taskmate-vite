export interface CalendarOptions {
    workStartHour: number;
    workEndHour: number;
    maxTaskDuration: number; // in minutes
    minTaskDuration: number; // in minutes
    includeWeekends: boolean;
    bufferTime: number; // in minutes
    aiTemperature: number;
    aiModel: string;
}

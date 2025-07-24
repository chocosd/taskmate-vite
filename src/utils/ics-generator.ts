import { ScheduledTask } from '@models/calendar.model';
import { DateTime } from 'luxon';

export function generateICSFromTasks(tasks: ScheduledTask[]): string {
    const formatDate = (date: Date) => {
        return DateTime.fromJSDate(date).toFormat('yyyyMMddTHHmmss');
    };

    const escapeText = (text: string) => {
        return text
            .replace(/[\\;,]/g, '\\$&')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//TaskMate//AI Scheduled Tasks//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
    ];

    tasks.forEach((task) => {
        const startDate = formatDate(task.start);
        const endDate = formatDate(task.end);
        const summary = escapeText(task.title);
        const description = escapeText(
            `AI Scheduled Task - ${task.priority} priority - Estimated duration: ${task.estimatedDuration} minutes`
        );

        icsContent.push(
            'BEGIN:VEVENT',
            `UID:${task.taskId}@taskmate.ai`,
            `DTSTART:${startDate}`,
            `DTEND:${endDate}`,
            `SUMMARY:${summary}`,
            `DESCRIPTION:${description}`,
            `PRIORITY:${task.priority === 'high' ? '1' : task.priority === 'medium' ? '5' : '9'}`,
            'STATUS:CONFIRMED',
            'SEQUENCE:0',
            'END:VEVENT'
        );
    });

    icsContent.push('END:VCALENDAR');

    return icsContent.join('\r\n');
}

export function downloadICS(
    tasks: ScheduledTask[],
    filename: string = 'scheduled-tasks.ics'
) {
    const icsContent = generateICSFromTasks(tasks);
    const blob = new Blob([icsContent], {
        type: 'text/calendar;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

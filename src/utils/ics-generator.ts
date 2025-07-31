import { ScheduledTask } from '@models/calendar.model';
import { DateTime } from 'luxon';

function validateICSContent(content: string): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!content.includes('BEGIN:VCALENDAR')) {
        errors.push('Missing BEGIN:VCALENDAR');
    }
    if (!content.includes('END:VCALENDAR')) {
        errors.push('Missing END:VCALENDAR');
    }
    if (!content.includes('VERSION:2.0')) {
        errors.push('Missing VERSION:2.0');
    }
    if (content.includes('\n') && !content.includes('\r\n')) {
        errors.push('Incorrect line endings - should use \\r\\n');
    }

    const events =
        content.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];

    events.forEach((event, index) => {
        if (!event.includes('UID:')) {
            errors.push(`Event ${index + 1} missing UID`);
        }
        if (!event.includes('DTSTART:')) {
            errors.push(`Event ${index + 1} missing DTSTART`);
        }
        if (!event.includes('DTEND:')) {
            errors.push(`Event ${index + 1} missing DTEND`);
        }
        if (!event.includes('SUMMARY:')) {
            errors.push(`Event ${index + 1} missing SUMMARY`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function generateTestICS(): string {
    const now = DateTime.now().toUTC();
    const startDate = now
        .plus({ hours: 1 })
        .toFormat("yyyyMMdd'T'HHmmss'Z'");
    const endDate = now
        .plus({ hours: 2 })
        .toFormat("yyyyMMdd'T'HHmmss'Z'");
    const timestamp = now.toFormat("yyyyMMdd'T'HHmmss'Z'");

    const testICS = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//TaskMate//Test//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:test-${Date.now()}@taskmate.ai`,
        `DTSTAMP:${timestamp}`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        'SUMMARY:Test Event',
        'DESCRIPTION:This is a test event to verify ICS format',
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');

    return testICS;
}

export function generateICSFromTasks(tasks: ScheduledTask[]): string {
    const formatDateUTC = (date: Date) =>
        DateTime.fromJSDate(date)
            .toUTC()
            .toFormat("yyyyMMdd'T'HHmmss'Z'");

    const escapeText = (text: string) => {
        if (!text) return '';
        return text
            .replace(/[\\;,]/g, '\\$&')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'");
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//TaskMate//AI Scheduled Tasks//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:AI Scheduled Tasks',
        'X-WR-CALDESC:Tasks scheduled by AI',
    ];

    tasks.forEach((task, index) => {
        const startDate = formatDateUTC(task.start);
        const endDate = formatDateUTC(task.end);
        const summary = escapeText(task.title);
        const description = escapeText(
            `AI Scheduled Task - ${task.priority} priority - Estimated duration: ${task.estimatedDuration} minutes${task.description ? ` - ${task.description}` : ''}`
        );
        const location = escapeText(task.location || '');
        const uid = `taskmate-${task.taskId}-${Date.now()}-${index}@taskmate.ai`;
        const now = formatDateUTC(new Date());

        const eventLines = [
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${now}`,
            `CREATED:${now}`,
            `LAST-MODIFIED:${now}`,
            `DTSTART:${startDate}`,
            `DTEND:${endDate}`,
            `SUMMARY:${summary}`,
            `DESCRIPTION:${description}`,
            'STATUS:CONFIRMED',
            'SEQUENCE:0',
            'TRANSP:OPAQUE',
            'CLASS:PUBLIC',
        ];

        if (location) {
            eventLines.push(`LOCATION:${location}`);
        }

        const priority =
            task.priority === 'high'
                ? '1'
                : task.priority === 'medium'
                  ? '5'
                  : '9';
        eventLines.push(`PRIORITY:${priority}`);

        if (task.tags && task.tags.length > 0) {
            const categories = escapeText(task.tags.join(','));
            eventLines.push(`CATEGORIES:${categories}`);
        }

        eventLines.push('END:VEVENT');
        icsContent.push(...eventLines);
    });

    icsContent.push('END:VCALENDAR');

    const result = icsContent.join('\r\n');
    const validation = validateICSContent(result);

    if (!validation.isValid) {
        console.error('ICS validation errors:', validation.errors);
    }

    return result;
}

export function downloadICS(
    tasks: ScheduledTask[],
    filename: string = 'scheduled-tasks.ics'
) {
    if (!tasks.length) return;

    const icsContent = generateICSFromTasks(tasks);

    const blob = new Blob([icsContent], {
        type: 'text/calendar;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100);
}

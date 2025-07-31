import { CalendarEvent } from '@models/calendar.model';

export async function parseICSFile(
    file: File
): Promise<CalendarEvent[]> {
    const text = await file.text();
    const events: CalendarEvent[] = [];

    // Split into lines and clean up
    const lines = text.split(/\r?\n/).map((line) => line.trim());

    let currentEvent: Partial<CalendarEvent> | null = null;
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        console.log('line', line);

        if (line === 'BEGIN:VEVENT') {
            currentEvent = {};
        } else if (line === 'END:VEVENT' && currentEvent) {
            if (
                currentEvent.title &&
                currentEvent.start &&
                currentEvent.end
            ) {
                events.push({
                    id: currentEvent.id || generateEventId(),
                    title: currentEvent.title,
                    start: currentEvent.start,
                    end: currentEvent.end,
                    allDay: currentEvent.allDay || false,
                    description: currentEvent.description,
                    location: currentEvent.location,
                });
            }
            currentEvent = null;
        } else if (currentEvent && line.includes(':')) {
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':');

            // Handle line continuations (lines starting with space or tab)
            let fullValue = value;
            while (
                i + 1 < lines.length &&
                (lines[i + 1].startsWith(' ') ||
                    lines[i + 1].startsWith('\t'))
            ) {
                i++;
                fullValue += lines[i].substring(1); // Remove the leading space/tab
            }

            parseEventProperty(currentEvent, key, fullValue);
        }
        i++;
    }

    return events;
}

function parseEventProperty(
    event: Partial<CalendarEvent>,
    key: string,
    value: string
) {
    switch (key) {
        case 'UID':
            event.id = value;
            break;
        case 'SUMMARY':
            event.title = decodeICSValue(value);
            break;
        case 'DESCRIPTION':
            event.description = decodeICSValue(value);
            break;
        case 'LOCATION':
            event.location = decodeICSValue(value);
            break;
        case 'DTSTART':
            event.start = parseICSDate(value);
            event.allDay = !value.includes('T'); // All-day events don't have time component
            break;
        case 'DTEND':
            event.end = parseICSDate(value);
            break;
        default:
            // Handle DTSTART and DTEND with parameters (e.g., DTSTART;VALUE=DATE:20240101)
            if (key.startsWith('DTSTART')) {
                event.start = parseICSDate(value);
                event.allDay = !value.includes('T');
            } else if (key.startsWith('DTEND')) {
                event.end = parseICSDate(value);
            }
            break;
    }
}

function parseICSDate(dateString: string): Date {
    // Handle different date formats
    if (dateString.includes('T')) {
        // DateTime format: 20240101T120000Z or 20240101T120000
        const cleanDate = dateString.replace(/[TZ]/g, '');
        const year = parseInt(cleanDate.substring(0, 4));
        const month = parseInt(cleanDate.substring(4, 6)) - 1; // JS months are 0-based
        const day = parseInt(cleanDate.substring(6, 8));
        const hour = parseInt(cleanDate.substring(8, 10)) || 0;
        const minute = parseInt(cleanDate.substring(10, 12)) || 0;
        const second = parseInt(cleanDate.substring(12, 14)) || 0;

        return new Date(year, month, day, hour, minute, second);
    } else {
        // Date only format: 20240101
        const year = parseInt(dateString.substring(0, 4));
        const month = parseInt(dateString.substring(4, 6)) - 1;
        const day = parseInt(dateString.substring(6, 8));

        return new Date(year, month, day);
    }
}

function decodeICSValue(value: string): string {
    return value
        .replace(/\\n/g, '\n')
        .replace(/\\,/g, ',')
        .replace(/\\;/g, ';')
        .replace(/\\\\/g, '\\');
}

function generateEventId(): string {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

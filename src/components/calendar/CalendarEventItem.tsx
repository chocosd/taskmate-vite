import { CalendarEvent } from '@models/calendar.model';
import { DateTime } from 'luxon';

interface CalendarEventItemProps {
    event: CalendarEvent;
    compact?: boolean;
}

export default function CalendarEventItem({
    event,
    compact = false,
}: CalendarEventItemProps) {
    const formatTimeRange = (start: Date, end: Date) => {
        const startTime =
            DateTime.fromJSDate(start).toFormat('h:mm a');
        const endTime = DateTime.fromJSDate(end).toFormat('h:mm a');
        return `${startTime} - ${endTime}`;
    };

    if (compact) {
        return (
            <div
                className="bg-blue-600 border border-blue-500 rounded p-1 mb-1 text-xs text-white"
                title={`${event.title}\n${formatTimeRange(event.start, event.end)}`}
            >
                <div className="font-medium truncate">
                    {event.title}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-600 border border-blue-500 rounded p-3 text-white">
            <div className="font-medium">{event.title}</div>
            <div className="text-sm opacity-80">
                {formatTimeRange(event.start, event.end)}
            </div>
            {event.location && (
                <div className="text-sm opacity-80">
                    📍 {event.location}
                </div>
            )}
        </div>
    );
}

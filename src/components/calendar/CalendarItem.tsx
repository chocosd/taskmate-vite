import { CalendarEvent, ScheduledTask } from '@models/calendar.model';
import { CalendarDateUtils } from '@utils/helpers/date.helper';
import CalendarTooltip from './CalendarTooltip';

interface CalendarItemProps {
    item: CalendarEvent | ScheduledTask;
    height: number;
    topPosition: number;
    zIndex: number;
    width?: number;
    leftPosition?: number;
}

export default function CalendarItem({
    item,
    height,
    topPosition,
    zIndex,
    width = 100,
    leftPosition = 0,
}: CalendarItemProps) {
    const isEvent = 'location' in item;
    const timeRange = CalendarDateUtils.formatTimeRange(
        item.start,
        item.end
    );
    const duration = CalendarDateUtils.formatDuration(
        item.start,
        item.end
    );

    const getItemStyles = () => {
        if (isEvent) {
            return 'bg-blue-600 border border-blue-500 hover:bg-blue-500';
        }

        const task = item as ScheduledTask;
        const priorityColors = {
            high: 'bg-red-600 border-red-500 hover:bg-red-500',
            medium: 'bg-yellow-600 border-yellow-500 hover:bg-yellow-500',
            low: 'bg-green-600 border-green-500 hover:bg-green-500',
        };

        return (
            priorityColors[task.priority] ||
            'bg-gray-600 border-gray-500 hover:bg-gray-500'
        );
    };

    return (
        <div
            className="absolute group"
            style={{
                top: `${topPosition}px`,
                left: `${leftPosition}%`,
                width: `${width}%`,
                height: `${height}px`,
                zIndex,
                padding: '2px 4px',
            }}
        >
            <div
                className={`border rounded p-2 text-xs text-white h-full overflow-hidden cursor-pointer transition-colors ${getItemStyles()}`}
            >
                <div className="font-medium truncate">
                    {item.title}
                </div>
            </div>

            <CalendarTooltip
                title={item.title}
                timeRange={timeRange}
                duration={duration}
                priority={
                    isEvent
                        ? undefined
                        : (item as ScheduledTask).priority
                }
                location={
                    isEvent
                        ? (item as CalendarEvent).location
                        : undefined
                }
            />
        </div>
    );
}

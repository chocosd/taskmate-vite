import { ScheduledTask } from '@models/calendar.model';
import { DateTime } from 'luxon';

interface CalendarTaskItemProps {
    task: ScheduledTask;
    compact?: boolean;
}

export default function CalendarTaskItem({
    task,
    compact = false,
}: CalendarTaskItemProps) {
    const formatTimeRange = (start: Date, end: Date) => {
        const startTime =
            DateTime.fromJSDate(start).toFormat('h:mm a');
        const endTime = DateTime.fromJSDate(end).toFormat('h:mm a');
        return `${startTime} - ${endTime}`;
    };

    const getPriorityColor = (
        priority: 'low' | 'medium' | 'high'
    ) => {
        switch (priority) {
            case 'high':
                return 'bg-red-600 border-red-500';
            case 'medium':
                return 'bg-yellow-600 border-yellow-500';
            case 'low':
                return 'bg-green-600 border-green-500';
            default:
                return 'bg-gray-600 border-gray-500';
        }
    };

    if (compact) {
        return (
            <div
                className={`border rounded p-1 mb-1 text-xs text-white ${getPriorityColor(task.priority)}`}
                title={`${task.title}\n${formatTimeRange(task.start, task.end)}\n${task.estimatedDuration} minutes`}
            >
                <div className="font-medium truncate">
                    {task.title}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`border rounded p-3 text-white ${getPriorityColor(task.priority)}`}
        >
            <div className="font-medium">{task.title}</div>
            <div className="text-sm opacity-80">
                {formatTimeRange(task.start, task.end)}
            </div>
            <div className="text-sm opacity-80">
                ⏱️ {task.estimatedDuration} minutes
            </div>
        </div>
    );
}

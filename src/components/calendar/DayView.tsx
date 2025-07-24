import { CalendarEvent, ScheduledTask } from '@models/calendar.model';
import { AlertCircle, Calendar, Clock } from 'lucide-react';
import { DateTime } from 'luxon';

interface DayViewProps {
    selectedDate: Date;
    events: CalendarEvent[];
    scheduledTasks: ScheduledTask[];
}

export default function DayView({
    selectedDate,
    events,
    scheduledTasks,
}: DayViewProps) {
    const getEventsForDate = (date: Date) => {
        const dateStr =
            DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
        return events
            .filter(
                (event) =>
                    DateTime.fromJSDate(event.start).toFormat(
                        'yyyy-MM-dd'
                    ) === dateStr
            )
            .sort((a, b) => a.start.getTime() - b.start.getTime());
    };

    const getTasksForDate = (date: Date) => {
        const dateStr =
            DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
        return scheduledTasks
            .filter(
                (task) =>
                    DateTime.fromJSDate(task.start).toFormat(
                        'yyyy-MM-dd'
                    ) === dateStr
            )
            .sort((a, b) => a.start.getTime() - b.start.getTime());
    };

    const formatTimeRange = (start: Date, end: Date) => {
        const startTime =
            DateTime.fromJSDate(start).toFormat('h:mm a');
        const endTime = DateTime.fromJSDate(end).toFormat('h:mm a');
        return `${startTime} - ${endTime}`;
    };

    const formatDuration = (start: Date, end: Date) => {
        const durationMinutes =
            (end.getTime() - start.getTime()) / (1000 * 60);
        if (durationMinutes < 60) {
            return `${Math.round(durationMinutes)}min`;
        }
        const hours = Math.floor(durationMinutes / 60);
        const minutes = Math.round(durationMinutes % 60);
        return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
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

    const dayEvents = getEventsForDate(selectedDate);
    const dayTasks = getTasksForDate(selectedDate);

    return (
        <div className="space-y-4">
            {/* Calendar Events */}
            {dayEvents.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Calendar Events
                    </h3>
                    <div className="space-y-2">
                        {dayEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-blue-600 border border-blue-500 rounded p-3 text-white"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="font-medium">
                                        {event.title}
                                    </div>
                                    <div className="text-xs bg-blue-700 px-2 py-1 rounded">
                                        {formatDuration(
                                            event.start,
                                            event.end
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm opacity-80">
                                    {formatTimeRange(
                                        event.start,
                                        event.end
                                    )}
                                </div>
                                {event.location && (
                                    <div className="text-sm opacity-80">
                                        📍 {event.location}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Scheduled Tasks */}
            {dayTasks.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Scheduled Tasks
                    </h3>
                    <div className="space-y-2">
                        {dayTasks.map((task) => (
                            <div
                                key={task.taskId}
                                className={`border rounded p-3 text-white ${getPriorityColor(task.priority)}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="font-medium">
                                        {task.title}
                                    </div>
                                    <div className="text-xs bg-black/20 px-2 py-1 rounded">
                                        {task.estimatedDuration} min
                                    </div>
                                </div>
                                <div className="text-sm opacity-80">
                                    {formatTimeRange(
                                        task.start,
                                        task.end
                                    )}
                                </div>
                                <div className="text-xs opacity-70 mt-1 capitalize">
                                    {task.priority} priority
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {dayEvents.length === 0 && dayTasks.length === 0 && (
                <div className="text-center text-zinc-400 py-8">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No events or tasks scheduled for this day</p>
                </div>
            )}
        </div>
    );
}

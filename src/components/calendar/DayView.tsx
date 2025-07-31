import { CalendarEvent, ScheduledTask } from '@models/calendar.model';
import { AlertCircle, Calendar, Clock } from 'lucide-react';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

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
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Reset visibility when date changes
        setIsVisible(false);
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, [selectedDate]);

    const getEventsForDate = (date: Date) => {
        return events
            .filter((event) => {
                const eventStart = DateTime.fromJSDate(event.start);
                const eventStartDate = eventStart.startOf('day');
                const dateStartOfDay =
                    DateTime.fromJSDate(date).startOf('day');

                return eventStartDate.equals(dateStartOfDay);
            })
            .sort((a, b) => a.start.getTime() - b.start.getTime());
    };

    const getTasksForDate = (date: Date) => {
        return scheduledTasks
            .filter((task) => {
                const taskStart = DateTime.fromJSDate(task.start);
                const taskStartDate = taskStart.startOf('day');
                const dateStartOfDay =
                    DateTime.fromJSDate(date).startOf('day');

                // Task starts on this date
                return taskStartDate.equals(dateStartOfDay);
            })
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
        <div
            className={`space-y-4 transition-all duration-500 ease-out ${
                isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
            }`}
        >
            {dayEvents.length > 0 && (
                <div className="animate-in slide-in-from-bottom-2 duration-500">
                    <h3 className="text-lg font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Calendar Events
                    </h3>
                    <div className="space-y-2">
                        {dayEvents.map((event, index) => (
                            <div
                                key={event.id}
                                className="bg-blue-600 border border-blue-500 rounded p-3 text-white transition-all duration-300 ease-out animate-in slide-in-from-bottom-2"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animationFillMode: 'both',
                                }}
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
                <div className="animate-in slide-in-from-bottom-2 duration-500 delay-200">
                    <h3 className="text-lg font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Scheduled Tasks
                    </h3>
                    <div className="space-y-2">
                        {dayTasks.map((task, index) => (
                            <div
                                key={task.taskId}
                                className={`border rounded p-3 text-white transition-all duration-300 ease-out animate-in slide-in-from-bottom-2 ${getPriorityColor(task.priority)}`}
                                style={{
                                    animationDelay: `${(index + dayEvents.length) * 100}ms`,
                                    animationFillMode: 'both',
                                }}
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

            {!dayEvents.length && !dayTasks.length && (
                <div className="text-center text-zinc-400 py-8 animate-in fade-in duration-500 delay-300">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No events or tasks scheduled for this day</p>
                </div>
            )}
        </div>
    );
}

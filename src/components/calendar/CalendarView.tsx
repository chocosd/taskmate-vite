import { CalendarEvent, ScheduledTask } from '@models/calendar.model';
import { useEffect, useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarLegend from './CalendarLegend';
import DayView from './DayView';
import WeekView from './WeekView';

interface CalendarViewProps {
    events: CalendarEvent[];
    scheduledTasks: ScheduledTask[];
    onUpdateEvent?: (updatedEvent: CalendarEvent) => void;
    onUpdateTask?: (updatedTask: ScheduledTask) => void;
    onDeleteEvent?: (eventId: string) => void;
    onDeleteTask?: (taskId: string) => void;
}

export default function CalendarView({
    events,
    scheduledTasks,
    onUpdateEvent,
    onUpdateTask,
    onDeleteEvent,
    onDeleteTask,
}: CalendarViewProps) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setViewMode('day');
    };

    const handleViewModeChange = (mode: 'week' | 'day') => {
        setIsTransitioning(true);
        setTimeout(() => {
            setViewMode(mode);
            setIsTransitioning(false);
        }, 150);
    };

    useEffect(() => setIsTransitioning(false), [viewMode]);

    return (
        <div className="bg-zinc-800 rounded-lg p-4">
            <CalendarHeader
                selectedDate={selectedDate}
                viewMode={viewMode}
                scheduledTasks={scheduledTasks}
                onDateChange={setSelectedDate}
                onViewModeChange={handleViewModeChange}
            />

            <div
                className={`transition-all duration-300 ease-out ${
                    isTransitioning
                        ? 'opacity-50 scale-95'
                        : 'opacity-100 scale-100'
                }`}
            >
                {viewMode === 'day' ? (
                    <DayView
                        selectedDate={selectedDate}
                        events={events}
                        scheduledTasks={scheduledTasks}
                    />
                ) : (
                    <WeekView
                        selectedDate={selectedDate}
                        events={events}
                        scheduledTasks={scheduledTasks}
                        onDayClick={handleDayClick}
                        onUpdateEvent={onUpdateEvent}
                        onUpdateTask={onUpdateTask}
                        onDeleteEvent={onDeleteEvent}
                        onDeleteTask={onDeleteTask}
                    />
                )}
            </div>

            <CalendarLegend />
        </div>
    );
}

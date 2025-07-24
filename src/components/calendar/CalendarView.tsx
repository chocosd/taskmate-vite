import { CalendarEvent, ScheduledTask } from '@models/calendar.model';
import { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarLegend from './CalendarLegend';
import DayView from './DayView';
import WeekView from './WeekView';

interface CalendarViewProps {
    events: CalendarEvent[];
    scheduledTasks: ScheduledTask[];
}

export default function CalendarView({
    events,
    scheduledTasks,
}: CalendarViewProps) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setViewMode('day');
    };

    return (
        <div className="bg-zinc-800 rounded-lg p-4">
            <CalendarHeader
                selectedDate={selectedDate}
                viewMode={viewMode}
                onDateChange={setSelectedDate}
                onViewModeChange={setViewMode}
            />

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
                />
            )}

            <CalendarLegend />
        </div>
    );
}

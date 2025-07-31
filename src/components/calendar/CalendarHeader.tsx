import { useCalendarOptions } from '@context/calendar-options/useCalendarOptions';
import { ScheduledTask } from '@models/calendar.model';
import { Calendar, Settings } from 'lucide-react';
import { DateTime } from 'luxon';

interface CalendarHeaderProps {
    selectedDate: Date;
    viewMode: 'week' | 'day';
    scheduledTasks: ScheduledTask[];
    onDateChange: (date: Date) => void;
    onViewModeChange: (mode: 'week' | 'day') => void;
}

export default function CalendarHeader({
    selectedDate,
    viewMode,
    scheduledTasks,
    onDateChange,
    onViewModeChange,
}: CalendarHeaderProps) {
    const { openOptions } = useCalendarOptions();

    const navigatePrevious = () => {
        const days = viewMode === 'week' ? 7 : 1;
        onDateChange(
            new Date(
                selectedDate.getTime() - days * 24 * 60 * 60 * 1000
            )
        );
    };

    const navigateNext = () => {
        const days = viewMode === 'week' ? 7 : 1;
        onDateChange(
            new Date(
                selectedDate.getTime() + days * 24 * 60 * 60 * 1000
            )
        );
    };

    const getHeaderTitle = () => {
        if (viewMode === 'day') {
            return DateTime.fromJSDate(selectedDate).toFormat(
                'EEEE, MMMM d, yyyy'
            );
        }

        // For week view, show the month and date range
        const weekStart =
            DateTime.fromJSDate(selectedDate).startOf('week');
        const weekEnd =
            DateTime.fromJSDate(selectedDate).endOf('week');

        // If the week spans two months, show both months
        if (weekStart.month !== weekEnd.month) {
            return `${weekStart.toFormat('MMM d')} - ${weekEnd.toFormat('MMM d, yyyy')}`;
        }

        // If it's the same month, show the month name and date range
        return `${weekStart.toFormat('MMMM d')} - ${weekEnd.toFormat('d, yyyy')}`;
    };

    // Calculate tasks for the selected day
    const getTasksForDay = (date: Date) => {
        const dateStr =
            DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
        return scheduledTasks.filter((task) => {
            const taskDateStr = DateTime.fromJSDate(
                task.start
            ).toFormat('yyyy-MM-dd');
            return taskDateStr === dateStr;
        });
    };

    // Calculate tasks for the current week
    const getTasksForWeek = (date: Date) => {
        const weekStart = DateTime.fromJSDate(date).startOf('week');
        const weekEnd = DateTime.fromJSDate(date).endOf('week');

        return scheduledTasks.filter((task) => {
            const taskDate = DateTime.fromJSDate(task.start);
            return taskDate >= weekStart && taskDate <= weekEnd;
        });
    };

    const dayTasks = getTasksForDay(selectedDate);
    const weekTasks = getTasksForWeek(selectedDate);

    return (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {getHeaderTitle()}
            </h2>
            <div className="flex items-center gap-3">
                {/* Daily task count indicator */}
                {viewMode === 'day' && dayTasks.length > 0 && (
                    <div className="px-2 py-1 text-xs bg-purple-600 text-white rounded-full">
                        {dayTasks.length} task
                        {dayTasks.length !== 1 ? 's' : ''} today
                    </div>
                )}

                {/* Weekly task count indicator */}
                {viewMode === 'week' && weekTasks.length > 0 && (
                    <div className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                        {weekTasks.length} task
                        {weekTasks.length !== 1 ? 's' : ''} this week
                    </div>
                )}

                <div className="flex gap-1">
                    <button
                        onClick={() =>
                            onViewModeChange(
                                viewMode === 'week' ? 'day' : 'week'
                            )
                        }
                        className="px-2 py-1 text-sm bg-zinc-700 text-white rounded hover:bg-zinc-600"
                    >
                        {viewMode === 'week' ? 'Day' : 'Week'}
                    </button>
                    <button
                        onClick={openOptions}
                        className="px-2 py-1 text-sm bg-zinc-700 text-white rounded hover:bg-zinc-600"
                        title="Calendar Settings"
                    >
                        <Settings className="w-3 h-3" />
                    </button>
                    <button
                        onClick={navigatePrevious}
                        className="px-2 py-1 text-sm bg-zinc-700 text-white rounded hover:bg-zinc-600"
                    >
                        ←
                    </button>
                    <button
                        onClick={navigateNext}
                        className="px-2 py-1 text-sm bg-zinc-700 text-white rounded hover:bg-zinc-600"
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
}

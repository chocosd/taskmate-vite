import { Calendar } from 'lucide-react';
import { DateTime } from 'luxon';

interface CalendarHeaderProps {
    selectedDate: Date;
    viewMode: 'week' | 'day';
    onDateChange: (date: Date) => void;
    onViewModeChange: (mode: 'week' | 'day') => void;
}

export default function CalendarHeader({
    selectedDate,
    viewMode,
    onDateChange,
    onViewModeChange,
}: CalendarHeaderProps) {
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
        return 'Week View';
    };

    return (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {getHeaderTitle()}
            </h2>
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
    );
}

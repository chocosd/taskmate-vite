interface CalendarTooltipProps {
    title: string;
    timeRange: string;
    duration: string;
    priority?: 'low' | 'medium' | 'high';
    location?: string;
}

export default function CalendarTooltip({
    title,
    timeRange,
    duration,
    priority,
    location,
}: CalendarTooltipProps) {
    return (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            <div className="font-semibold mb-1">{title}</div>
            <div className="text-zinc-300">{timeRange}</div>
            <div className="text-zinc-400">{duration}</div>
            {priority && (
                <div className="text-zinc-400 capitalize">
                    {priority} priority
                </div>
            )}
            {location && (
                <div className="text-zinc-400">📍 {location}</div>
            )}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-800"></div>
        </div>
    );
}

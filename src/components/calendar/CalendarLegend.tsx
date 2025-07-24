export default function CalendarLegend() {
    return (
        <div className="mt-6 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 border border-blue-500 rounded"></div>
                <span className="text-zinc-300">Calendar Events</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 border border-red-500 rounded"></div>
                <span className="text-zinc-300">
                    High Priority Tasks
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-600 border border-yellow-500 rounded"></div>
                <span className="text-zinc-300">
                    Medium Priority Tasks
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 border border-green-500 rounded"></div>
                <span className="text-zinc-300">
                    Low Priority Tasks
                </span>
            </div>
        </div>
    );
}

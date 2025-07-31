import Button from '@components/ui/Button';
import { CalendarEvent } from '@models/calendar.model';
import { Task } from '@models/task.model';
import { Bot, Calendar, ListTodo } from 'lucide-react';

interface CalendarSchedulingSectionProps {
    isProcessing: boolean;
    hasUploadedCalendar: boolean;
    tasks: Task[];
    calendarEvents: CalendarEvent[];
    onScheduleTasks: () => void;
}

export default function CalendarSchedulingSection({
    isProcessing,
    hasUploadedCalendar,
    tasks,
    calendarEvents,
    onScheduleTasks,
}: CalendarSchedulingSectionProps) {
    const canSchedule =
        !isProcessing && hasUploadedCalendar && tasks.length > 0;

    return (
        <div className="bg-zinc-800 rounded-lg p-4 flex-1">
            <h2 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                AI Scheduling
            </h2>

            <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                    <div className="flex items-center gap-1 bg-zinc-700 rounded-full px-2 py-1 text-xs">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        <span className="text-zinc-300">
                            {calendarEvents.length} events
                        </span>
                    </div>
                    <div className="flex items-center gap-1 bg-zinc-700 rounded-full px-2 py-1 text-xs">
                        <ListTodo className="w-3 h-3 text-purple-400" />
                        <span className="text-zinc-300">
                            {
                                tasks.filter(
                                    (t) =>
                                        !t.completed && !t.parent_id
                                ).length
                            }{' '}
                            tasks
                        </span>
                    </div>
                </div>

                <Button
                    action={canSchedule ? onScheduleTasks : undefined}
                    classes={
                        canSchedule
                            ? 'w-full text-white px-4 py-2 rounded-md swipe-gradient shadow-md hover:brightness-110'
                            : 'w-full px-4 py-2 rounded-md bg-zinc-600 text-zinc-400 cursor-not-allowed'
                    }
                    options={{ overrideClasses: true }}
                >
                    <Bot className="w-4 h-4" />
                    {isProcessing
                        ? 'Scheduling...'
                        : 'Schedule Tasks with AI'}
                </Button>
            </div>
        </div>
    );
}

import Button from '@components/ui/Button';
import { useCalendarOptions } from '@context/calendar-options/useCalendarOptions';
import { CalendarEvent } from '@models/calendar.model';
import { Task } from '@models/task.model';
import { TaskDateUtils } from '@utils/helpers/date.helper';
import { Bot, Calendar, ListTodo, Settings } from 'lucide-react';

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
    const { openOptions } = useCalendarOptions();
    const canSchedule =
        !isProcessing && hasUploadedCalendar && tasks.length > 0;

    const schedulableTasks = TaskDateUtils.getSchedulableTasks(tasks);

    return (
        <div className="bg-zinc-800 rounded-lg p-3 flex-1">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium text-white flex items-center gap-2">
                    <Bot className="w-3 h-3" />
                    AI Scheduling
                </h2>
                <Button
                    action={openOptions}
                    variant="secondary"
                    size="small"
                >
                    <Settings className="w-3 h-3" />
                </Button>
            </div>

            <div className="space-y-2">
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
                                schedulableTasks.filter(
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
                    disabled={!canSchedule}
                    classes={
                        canSchedule
                            ? 'w-full swipe-gradient shadow-md hover:brightness-110 inline-flex items-center justify-center gap-1 gap-1'
                            : 'w-full inline-flex items-center gap-1'
                    }
                    options={{ overrideClasses: canSchedule }}
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

import CalendarSchedulingSection from '@components/calendar/CalendarSchedulingSection';
import CalendarUploadSection from '@components/calendar/CalendarUploadSection';
import CalendarView from '@components/calendar/CalendarView';
import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { useToast } from '@context/toast/useToast';
import { ToastType } from '@enums/toast-type.enum';
import { CalendarEvent, ScheduledTask } from '@models/calendar.model';
import { downloadICS } from '@utils/ics-generator';
import { parseICSFile } from '@utils/ics-parser';
import { scheduleTasksWithAI } from '@utils/schedule-tasks-with-ai';
import { Download } from 'lucide-react';
import { useState } from 'react';

export default function Calendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [scheduledTasks, setScheduledTasks] = useState<
        ScheduledTask[]
    >([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasUploadedCalendar, setHasUploadedCalendar] =
        useState(false);
    const { tasks } = useSupabaseTasks();
    const { showToast } = useToast();

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        try {
            const parsedEvents = await parseICSFile(file);
            setEvents(parsedEvents);
            setHasUploadedCalendar(true);
            showToast(
                ToastType.Success,
                'Calendar uploaded successfully!'
            );
        } catch (error) {
            console.error('Error parsing ICS file:', error);
            showToast(ToastType.Error, 'Failed to parse ICS file');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleScheduleTasks = async () => {
        if (tasks.length === 0) {
            showToast(
                ToastType.Error,
                'No tasks available to schedule'
            );
            return;
        }

        setIsProcessing(true);
        try {
            const result = await scheduleTasksWithAI(tasks, events);
            setScheduledTasks(result.scheduledTasks);

            if (result.feasible) {
                showToast(
                    ToastType.Success,
                    `Successfully scheduled ${result.scheduledTasks.length} tasks`
                );
            } else {
                showToast(ToastType.Error, result.message);
            }
        } catch (error) {
            console.error('Error scheduling tasks:', error);
            showToast(ToastType.Error, 'Failed to schedule tasks');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownloadICS = () => {
        if (scheduledTasks.length === 0) {
            showToast(
                ToastType.Error,
                'No scheduled tasks to download'
            );
            return;
        }

        const filename = `taskmate-scheduled-tasks-${new Date().toISOString().split('T')[0]}.ics`;
        downloadICS(scheduledTasks, filename);
        showToast(
            ToastType.Success,
            'ICS file downloaded successfully!'
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-zinc-100">
                    Calendar
                </h1>
                {scheduledTasks.length > 0 && (
                    <button
                        onClick={handleDownloadICS}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download ICS
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CalendarUploadSection
                    isProcessing={isProcessing}
                    hasUploadedCalendar={hasUploadedCalendar}
                    calendarEvents={events}
                    onFileUpload={handleFileUpload}
                />
                <CalendarSchedulingSection
                    isProcessing={isProcessing}
                    hasUploadedCalendar={hasUploadedCalendar}
                    tasks={tasks}
                    calendarEvents={events}
                    onScheduleTasks={handleScheduleTasks}
                />
            </div>

            <CalendarView
                events={events}
                scheduledTasks={scheduledTasks}
            />
        </div>
    );
}

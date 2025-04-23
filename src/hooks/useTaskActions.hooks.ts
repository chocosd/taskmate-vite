import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { useToast } from '@context/toast/useToast';
import { ToastType } from '@enums/toast-type.enum';
import { generateTasksFromPrompt } from '@utils/generate-tasks-from-prompt';
import { DateTime } from 'luxon';

export function useTaskActions(
    input: string,
    setInput: (val: string) => void
) {
    const { addTask, addTasksBatch, tasks } = useSupabaseTasks();
    const { showToast } = useToast();

    const handleAddTask = async () => {
        if (!input.trim()) return;

        try {
            await addTask({
                title: input.trim(),
                order: tasks.length + 1,
                generated: false,
            });
            setInput('');
        } catch (err) {
            showToast(ToastType.Error, `Failed to add task: ${err}`);
        }
    };

    const handleGenerateTasks = async () => {
        if (!input.trim()) return;

        try {
            const aiTasks = await generateTasksFromPrompt(
                input.trim()
            );
            const now = DateTime.now().toISO();
            const baseOrder = tasks.length;

            await addTasksBatch(
                aiTasks.map((title, i) => ({
                    title,
                    order: baseOrder + i,
                    generated: true,
                    completed: false,
                    created_at: now,
                }))
            );

            setInput('');
        } catch (err) {
            showToast(
                ToastType.Error,
                `AI generation failed: ${err}`
            );
        }
    };

    return { handleAddTask, handleGenerateTasks };
}

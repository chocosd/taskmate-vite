import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { Task } from '@models/task.model';
import { reorderTasksList } from '@utils/drag-task';
import { useRef, useState } from 'react';

export function useTaskDragAndReorder(tasks: Task[]) {
    const { reorderTasks } = useSupabaseTasks();
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const dragItem = useRef<Task | null>(null);

    const onDragStart = (task: Task) => {
        dragItem.current = task;
        setDraggingId(task.id);
    };

    const onDragOver = (e: React.DragEvent, overTask: Task) => {
        e.preventDefault();
        const from = dragItem.current;

        if (!from || from.id === overTask.id) {
            return;
        }

        const reordered = reorderTasksList(tasks, from.id, overTask.id);
        reorderTasks(reordered);
    };

    const onDrop = () => {
        dragItem.current = null;
        setDraggingId(null);
    };

    return {
        draggingId,
        onDragStart,
        onDragOver,
        onDrop,
    };
}

import { Task } from '@models/task';
import { TaskActionTypes } from '@state/task/enums/task-state.enum';
import { reorderTasksList } from '@utils/drag-task';
import { useRef, useState } from 'react';
import { useTasks } from './useTasks.hooks';

export function useTaskDragAndReorder(tasks: Task[]) {
    const { dispatch } = useTasks();
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const dragItem = useRef<Task | null>(null);

    const onDragStart = (task: Task) => {
        dragItem.current = task;
        setDraggingId(task.id);
    };

    const onDragOver = (e: React.DragEvent, overTask: Task) => {
        e.preventDefault();
        const from = dragItem.current;
        if (!from || from.id === overTask.id) return;

        const reordered = reorderTasksList(tasks, from.id, overTask.id);
        dispatch({ type: TaskActionTypes.ReorderTasks, payload: reordered });
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

import { useTasks } from '@hooks/useTasks.hooks';
import { Task } from '@models/task';
import { TaskActionTypes } from '@state/task/enums/task-state.enum';
import { GripVertical, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type TaskItemProps = {
    task: Task;
    onDragStart?: () => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: () => void;
    isDragging?: boolean;
};

export default function TaskItem({
    task,
    onDragOver,
    onDragStart,
    onDrop,
    isDragging = false,
}: TaskItemProps) {
    const { dispatch } = useTasks();
    const [dragClass, setDragClass] = useState('');

    useEffect(() => {
        setDragClass(() => {
            let itemClasses: string = '';

            itemClasses += task.completed
                ? 'border-teal-300 dark:border-teal-700'
                : 'border-rose-300 dark:border-rose-700';

            if (isDragging) {
                itemClasses += 'opacity-50 border-zinc-300 dark:border-zinc-700';
            }

            return itemClasses;
        });
    }, [isDragging, task]);

    const completedTaskClass = () => {
        return task.completed ? 'opacity-60 line-through' : '';
    };

    const handleTaskToggleOnChange = () =>
        dispatch({ type: TaskActionTypes.ToggleTask, payload: { id: task.id } });

    const handleTaskDeleteOnChange = () =>
        dispatch({ type: TaskActionTypes.DeleteTask, payload: { id: task.id } });

    return (
        <li
            key={task.id}
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`p-3 border rounded flex items-center justify-between flex-1 w-full transition-colors ${
                dragClass
            }`}
        >
            <div className={`flex items-center gap-3 w-full ${completedTaskClass()}`}>
                <GripVertical className="cursor-grab text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200" />
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleTaskToggleOnChange}
                />
                <span className="flex-1 text-sm">{task.title}</span>
                {task.generated && <span className="text-xs text-blue-500 italic">(AI)</span>}
                <button
                    onClick={handleTaskDeleteOnChange}
                    className="text-zinc-500 hover:text-red-500"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </li>
    );
}

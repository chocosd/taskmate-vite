import { useTasks } from '@hooks/useTasks.hooks';
import { Task } from '@models/task';
import { TaskActionTypes } from '@state/task/enums/task-state.enum';
import { Trash2 } from 'lucide-react';

type TaskItemProps = {
    task: Task;
};

export default function TaskItem({ task }: TaskItemProps) {
    const { dispatch } = useTasks();

    const completedTaskClass = ({ completed }: Task) => {
        return completed
            ? 'opacity-60 line-through border-zinc-300 dark:border-zinc-700'
            : 'border-zinc-200 dark:border-zinc-700';
    };

    const handleTaskToggleOnChange = (task: Task) =>
        dispatch({ type: TaskActionTypes.ToggleTask, payload: { id: task.id } });
    const handleTaskDeleteOnChange = (task: Task) =>
        dispatch({ type: TaskActionTypes.DeleteTask, payload: { id: task.id } });

    return (
        <li
            className={`flex items-center justify-between p-3 rounded border ${completedTaskClass(
                task
            )}`}
        >
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskToggleOnChange(task)}
                    className="form-checkbox h-4 w-4"
                />
                <span className="text-sm">{task.title}</span>
                {task.generated && <span className="text-xs text-blue-500 italic">(AI)</span>}
            </div>
            <button
                onClick={() => handleTaskDeleteOnChange(task)}
                className="text-zinc-500 hover:text-red-500"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </li>
    );
}

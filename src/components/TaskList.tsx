import { useTasks } from '@hooks/useTasks.hooks';
import TaskItem from './TaskItem';

export default function TaskList() {
    const { state } = useTasks();

    if (!state.tasks?.length) {
        return <p className="text-zinc-500 italic text-center">No tasks yet.</p>;
    }

    return (
        <ul className="space-y-2">
            {state.tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </ul>
    );
}

import { useTaskDragAndReorder } from '@hooks/useTaskDragAndReorder.hooks';
import { Task } from '@models/task';
import TaskItem from './TaskItem';

export default function TaskList({tasks}: { tasks: Task[]}) {

    const { draggingId, onDragStart, onDragOver, onDrop } = useTaskDragAndReorder(tasks);

    const availableTasks = tasks.length;

    return (
        <ul className="space-y-2">
            {availableTasks ? tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onDragStart={() => onDragStart(task)}
                    onDragOver={(e) => onDragOver(e, task)}
                    onDrop={onDrop}
                    isDragging={draggingId === task.id}
                />
            )) : 'nothing to see here'}
        </ul>
    );
}

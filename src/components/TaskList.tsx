import { useTaskDragAndReorder } from '@hooks/useTaskDragAndReorder.hooks';
import { Task } from '@models/task';
import { getSubtaskStatuses } from '@utils/get-subtask-statuses';
import TaskItem from './TaskItem';

type TaskListProps = {
    tasks: Task[];
    allTasks: Task[];
};

export default function TaskList({ tasks, allTasks }: TaskListProps) {
    const { draggingId, onDragStart, onDragOver, onDrop } = useTaskDragAndReorder(tasks);

    const availableTasks = tasks.length;

    const enhancedTasks = tasks.map((task) => ({
        ...task,
        subtasks: getSubtaskStatuses(task.id, allTasks),
    }));

    return (
        <ul className="space-y-2">
            {availableTasks
                ? enhancedTasks.map((task) => (
                      <TaskItem
                          key={task.id}
                          task={task}
                          onDragStart={() => onDragStart(task)}
                          onDragOver={(e) => onDragOver(e, task)}
                          onDrop={onDrop}
                          isDragging={draggingId === task.id}
                      />
                  ))
                : 'nothing to see here'}
        </ul>
    );
}

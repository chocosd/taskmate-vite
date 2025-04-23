import { Task } from '@models/task.model';
import { TaskStatus } from '@state/task/enums/task-status.enum';

export function getSubtaskStatuses(
    taskId: string,
    allTasks: Task[]
): TaskStatus[] {
    return allTasks
        .filter((task) => task.parent_id === taskId)
        .map((task) => {
            if (task.completed) {
                return TaskStatus.Completed;
            }

            if (task.generated) {
                return TaskStatus.Generated;
            }

            return TaskStatus.Manual;
        });
}

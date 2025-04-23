import { Task } from '@models/task.model';

export function getTasksWithUpdatedOrder(
    original: Task[],
    reordered: Task[]
): Task[] {
    return reordered.filter(
        (task, index) => task.order !== original[index].order
    );
}

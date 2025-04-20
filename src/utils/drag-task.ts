import { Task } from '@models/task.model';

export function reorderTasksList(tasks: Task[], fromId: string, toId: string): Task[] {
    const fromIndex = tasks.findIndex((t) => t.id === fromId);
    const toIndex = tasks.findIndex((t) => t.id === toId);
    if (fromIndex === -1 || toIndex === -1) return tasks;

    const updated = [...tasks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    return updated.map((task, index) => ({
        ...task,
        order: index,
    }));
}

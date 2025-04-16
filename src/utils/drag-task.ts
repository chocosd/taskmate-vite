import { Task } from '@models/task';

export function reorderTasksList(current: Task[], fromId: string, toId: string): Task[] {
    if (fromId === toId) return current;

    const fromIndex = current.findIndex(({ id }) => id === fromId);
    const toIndex = current.findIndex(({ id }) => id === toId);

    if (fromIndex === -1 || toIndex === -1) {
        return current;
    }

    const updated = [...current];
    const [moved] = updated.splice(fromIndex, 1);

    updated.splice(toIndex, 0, moved);

    return updated;
}

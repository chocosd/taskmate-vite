import { TaskStatus } from '@state/task/enums/task-status.enum';

export type Task = {
    id: string;
    title: string;
    completed: boolean;
    createdAt: number;
    generated?: boolean;
    assignedTo?: string;
    parentId?: string;
    order: number;
    subtasks?: TaskStatus[];
};

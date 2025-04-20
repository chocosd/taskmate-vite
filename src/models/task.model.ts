import { TaskStatus } from '@state/task/enums/task-status.enum';

export type Task = {
    id: string;
    title: string;
    completed: boolean;
    created_at: string;
    generated?: boolean;
    assignedTo?: string;
    parent_id?: string;
    order: number;
    subtasks?: TaskStatus[];
    user_id: string | undefined;
};

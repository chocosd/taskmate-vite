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
    created_by_user_id: string | undefined;
    assigned_to_user_id?: string | undefined;
    priority?: TaskPriority;
    due_date?: string | null;
    requires_proof?: boolean;
    proof_submitted?: boolean;
    proof_text?: string;
};

export enum TaskPriority {
    Low = 'low',
    Medium = 'medium',
    High = 'high',
}

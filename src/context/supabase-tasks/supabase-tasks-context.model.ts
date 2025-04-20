import { Task } from '@models/task.model';

export type AddTaskPayload = Pick<Task, 'title' | 'order' | 'parent_id' | 'generated'>;

export type SupabaseTasksContextType = {
    tasks: Task[];
    addTask: (task: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;
    addTasksBatch: (tasks: Task[]) => Promise<void>;
    reorderTasks: (reordered: Task[]) => Promise<void>;
    loading: boolean;
};

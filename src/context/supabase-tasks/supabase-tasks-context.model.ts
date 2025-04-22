import { Task } from '@models/task.model';

export type AddTaskPayload = Pick<
    Task,
    'title' | 'order' | 'parent_id' | 'generated'
>;

export type SupabaseTasksContextType = {
    tasks: Task[];
    addTask: (task: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;
    addTasksBatch: (tasks: Task[]) => Promise<void>;
    reorderTasks: (reordered: Task[]) => Promise<void>;
    renameTask: (id: string, title: string) => Promise<void>;
    deleteSubTasks: (id: string) => Promise<void>;
    deleteTaskWithSubtasks: (id: string) => Promise<void>;
    updateSubtaskTitles: (
        parentId: string,
        newTitles: string[]
    ) => Promise<void>;
    loading: boolean;
};

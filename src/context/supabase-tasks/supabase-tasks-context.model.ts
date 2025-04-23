import { FormOption } from '@components/forms/fields/SelectInput';
import { Task, TaskPriority } from '@models/task.model';
import { StateSetter } from '@utils/types/state-setter.type';

export type AddTaskPayload = Pick<
    Task,
    'title' | 'order' | 'parent_id' | 'generated'
>;

export type TasksWithoutIds = Omit<
    Task,
    'id' | 'created_by_user_id' | 'priority' | 'due_date'
>;

export type ConnectionsUser = {
    connection_email: string;
    connection_id: string;
    created_at: string;
    id: string;
    status: 'accepted' | 'pending';
    user_id: string;
};

export type OptionsData = {
    assignee: FormOption;
    due_date: string;
    priority: TaskPriority;
};

export type SupabaseTasksContextType = {
    tasks: Task[];
    addTask: (task: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;
    addTasksBatch: (tasks: TasksWithoutIds[]) => Promise<void>;
    reorderTasks: (reordered: Task[]) => Promise<void>;
    renameTask: (id: string, title: string) => Promise<void>;
    deleteSubTasks: (id: string) => Promise<void>;
    deleteTaskWithSubtasks: (id: string) => Promise<void>;
    updateSubtaskTitles: (
        parentId: string,
        newTitles: string[]
    ) => Promise<void>;
    loading: boolean;
    connections: ConnectionsUser[];
    createdTasks: Task[];
    isOptionsOpen: boolean;
    openOptions: () => void;
    closeOptions: () => void;
    optionsData: OptionsData;
    setOptionsData: StateSetter<OptionsData>;
};

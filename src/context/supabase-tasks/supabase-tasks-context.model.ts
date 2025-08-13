import { FormOption } from '@components/forms/fields/SelectInput';
import { TaskListView } from '@enums/task-list-view.enum';
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

export enum Status {
    Accepted = 'accepted',
    Pending = 'pending',
}

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
    requires_proof: boolean;
};

export type SupabaseTasksContextType = {
    tasks: Task[];
    addTask: (task: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;
    addTasksBatch: (tasks: TasksWithoutIds[]) => Promise<void>;
    reorderTasks: (reordered: Task[]) => Promise<void>;
    renameTask: (id: string, title: string) => Promise<void>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    updateTaskProof: (id: string, proofText: string) => Promise<void>;
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
    fetchCreatedTasks: () => Promise<void>;
    optionsData: OptionsData;
    setOptionsData: StateSetter<OptionsData>;
    currentTab: TaskListView;
    setCurrentTab: StateSetter<TaskListView>;
    setTasks: StateSetter<Task[]>;
    setCreatedTasks: StateSetter<Task[]>;
    setConnections: StateSetter<ConnectionsUser[]>;
    setLoading: StateSetter<boolean>;
    fetchAssignedTasks: () => Promise<void>;
    fetchConnections: () => Promise<void>;
};

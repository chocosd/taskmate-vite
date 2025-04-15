export type Task = {
    id: string;
    title: string;
    completed: boolean;
    createdAt: number;
    generated?: boolean;
    assignedTo?: string;
    parentId?: string;
};

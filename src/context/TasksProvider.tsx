import { type TaskAction, type TaskState } from '@state/task/models/task-state.model';
import { initialTaskState, taskReducer } from '@state/task/task.state';
import { createContext, useReducer } from 'react';

const TaskContext = createContext<{
    state: TaskState;
    dispatch: React.Dispatch<TaskAction>;
} | null>(null);

export default function TaskProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(taskReducer, initialTaskState);
    return <TaskContext.Provider value={{ state, dispatch }}>{children}</TaskContext.Provider>;
}

export { TaskContext };

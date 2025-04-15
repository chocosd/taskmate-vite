import { TaskContext } from '@context/TasksProvider';
import { useContext } from 'react';

export function useTasks() {
    const context = useContext(TaskContext);

    if (!context) {
        throw new Error('useTasks must be used within TaskProvider');
    }

    return context;
}

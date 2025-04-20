import { useContext } from 'react';
import { SupabaseTasksContext } from './supabase-tasks.context';

export const useSupabaseTasks = () => {
    const context = useContext(SupabaseTasksContext);
    if (!context) {
        throw new Error('useSupabaseTasks must be used within a SupabaseTasksProvider');
    }
    return context;
};

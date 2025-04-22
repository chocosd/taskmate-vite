import { createContext } from 'react';
import { SupabaseTasksContextType } from './supabase-tasks-context.model';

export const SupabaseTasksContext =
    createContext<SupabaseTasksContextType | null>(null);

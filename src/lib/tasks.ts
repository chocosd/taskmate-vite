import { Task } from '@models/task.model';
import { supabase } from './supabaseClient';

export async function fetchTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('order', { ascending: true });

    if (error) {
        throw error;
    }

    return data || [];
}

export async function addTask(task: Partial<Task>) {
    const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .single();
    if (error) {
        throw error;
    }

    return data;
}

export async function updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .single();
    if (error) {
        throw error;
    }

    return data;
}

export async function deleteTask(id: string) {
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
    if (error) {
        throw error;
    }
}

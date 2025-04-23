import { useAuth } from '@context/auth/useAuth';
import { supabase } from '@lib/supabaseClient';
import { Task, TaskPriority } from '@models/task.model';
import { getTasksWithUpdatedOrder } from '@utils/get-updated-order';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import {
    ConnectionsUser,
    OptionsData,
    TasksWithoutIds,
} from './supabase-tasks-context.model';
import { SupabaseTasksContext } from './supabase-tasks.context';

export function SupabaseTasksProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [connections, setConnections] = useState<ConnectionsUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [optionsData, setOptionsData] = useState<OptionsData>({ assignee: { label: '', value: ''}, due_date: '', priority: TaskPriority.Low});

    const openOptions = () => setIsOptionsOpen(true);
    const closeOptions = () => setIsOptionsOpen(false);

    const hasFetched = useRef(false);

    useEffect(() => {
        if (!user || hasFetched.current) {
            return;
        }

        hasFetched.current = true;

        setLoading(true);

        // Fetch assigned tasks
        supabase
            .from('tasks')
            .select('*')
            .eq('assigned_to_user_id', user.id)
            .then(({ data, error }) => {
                if (data) setTasks(data);

                if (error) {
                    console.error(
                        '[SupabaseTasks] Fetch error:',
                        error
                    );
                }
            });

        // Fetch created tasks
        supabase
            .from('tasks')
            .select('*')
            .eq('created_by_user_id', user.id)
            .then(({ data, error }) => {
                if (data) setCreatedTasks(data);

                if (error) {
                    console.error(
                        '[SupabaseTasks] Fetch error:',
                        error
                    );
                }
            });

        setLoading(false);

        supabase
            .from('connections')
            .select('*')
            .eq('user_id', user.id)
            .then(({ data, error }) => {
                if (error) {
                    console.error(error);
                }

                if (data) {
                    setConnections(data);
                }
            });
    }, [user]);

    const addTask = async (task: Partial<Task>) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title: task.title!,
            order: task.order ?? 0,
            ...(task.parent_id && { parent_id: task.parent_id }),
            created_by_user_id: user!.id,
            generated: task.generated ?? false,
            completed: false,
            created_at: DateTime.now().toISO(),
            ...(optionsData.assignee && {
                assigned_to_user_id: String(optionsData.assignee.value) 
            }),
            ...(optionsData.due_date && {due_date: optionsData.due_date }),
            priority: optionsData.priority ?? TaskPriority.Low
        };

        const { data, error } = await supabase
            .from('tasks')
            .insert(newTask)
            .select();

        if (!error && data?.[0]) {
            if (data?.[0].assigned_to_user_id === user!.id) {
                setTasks((prev) => [...prev, data[0]]);
                return;
            }
        }
    };

    const addTasksBatch = async (tasks: TasksWithoutIds[]) => {
        const filledTasks: Task[] = tasks.map((task) => ({
            ...task,
            id: crypto.randomUUID(),
            created_by_user_id: user?.id,
            ...(optionsData.assignee.value && {
                assigned_to_user_id: String(optionsData.assignee.value) 
            }),
            ...(optionsData.due_date && {due_date: optionsData.due_date }),
            priority: optionsData.priority ?? TaskPriority.Low
        }));

        const { data, error } = await supabase
            .from('tasks')
            .insert(filledTasks)
            .select();

        if (!error && data?.length) {
            const updatedTasks = (data as Task[]).filter((task) => task.assigned_to_user_id === user!.id);
            
            if (updatedTasks.length) {
                setTasks((prev) => [...prev, ...updatedTasks]);
                return;
            }
        }

        if (error) {
            throw error;
        }
    };

    const deleteSubTasks = async (id: string) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('parent_id', id);

        if (!error) {
            setTasks((prev) =>
                prev.filter((task) => task.parent_id !== id)
            );
        }
    };

    const deleteTaskWithSubtasks = async (id: string) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .or(`id.eq.${id},parent_id.eq.${id}`);

        if (!error) {
            setTasks((prev) =>
                prev.filter(
                    (task) => task.id !== id && task.parent_id !== id
                )
            );
        } else {
            console.error(
                '[deleteTaskWithSubtasks] Failed:',
                error.message
            );
        }
    };

    const deleteTask = async (id: string) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (!error) {
            setTasks((prev) => prev.filter((task) => task.id !== id));
        }
    };

    const toggleTask = async (id: string) => {
        const target = tasks.find((t) => t.id === id);
        if (!target) {
            return;
        }

        const { data, error } = await supabase
            .from('tasks')
            .update({ completed: !target.completed })
            .eq('id', id)
            .select();

        if (!error && data?.[0]) {
            setTasks((prev) =>
                prev.map((t) => (t.id === id ? data[0] : t))
            );
        }
    };

    const updateSubtaskTitles = async (
        parentId: string,
        newTitles: string[]
    ) => {
        const currentSubtasks = tasks
            .filter((task) => task.parent_id === parentId)
            .sort((a, b) => a.order - b.order);

        const updatedTasks = currentSubtasks.map(
            (subtask, index) => ({
                ...subtask,
                id: subtask.id,
                title: newTitles[index] ?? subtask.title,
            })
        );

        const { data, error } = await supabase
            .from('tasks')
            .upsert(updatedTasks, { onConflict: 'id' })
            .select();

        if (!error && data?.length) {
            setTasks((prev) =>
                prev.map((t) => {
                    const updated = data.find((u) => u.id === t.id);
                    return updated ? updated : t;
                })
            );
        }

        if (error) {
            throw error;
        }
    };

    const renameTask = async (id: string, title: string) => {
        const target = tasks.find((t) => t.id === id);

        if (!target) {
            return;
        }

        const { data, error } = await supabase
            .from('tasks')
            .update({ title })
            .eq('id', id)
            .select();

        if (!error && data?.[0]) {
            setTasks((prev) =>
                prev.map((t) => (t.id === id ? data[0] : t))
            );
        }
    };

    const reorderTasks = async (reordered: Task[]) => {
        const updatedTasks = getTasksWithUpdatedOrder(
            tasks,
            reordered
        );

        if (!updatedTasks.length) {
            return;
        }

        const updates = updatedTasks.map((task) => ({
            id: task.id,
            order: reordered.find((t) => t.id === task.id)?.order,
        }));

        const { data, error } = await supabase
            .from('tasks')
            .upsert(updates, { onConflict: 'id' })
            .select();

        if (!error && data) {
            const updated = [...tasks];
            updates.forEach((update) => {
                const index = updated.findIndex(
                    (t) => t.id === update.id
                );
                if (index !== -1) {
                    updated[index].order = update.order!;
                }
            });

            const sorted = [...updated].sort(
                (a, b) => a.order - b.order
            );
            setTasks(sorted);
        }

        if (error) {
            console.error(
                '[SupabaseTasks] Failed to reorder tasks:',
                error
            );
        }
    };

    return (
        <SupabaseTasksContext.Provider
            value={{
                tasks,
                loading,
                addTask,
                addTasksBatch,
                deleteTask,
                reorderTasks,
                toggleTask,
                renameTask,
                deleteSubTasks,
                deleteTaskWithSubtasks,
                updateSubtaskTitles,
                createdTasks,
                connections,
                isOptionsOpen,
                openOptions,
                closeOptions,
                optionsData,
                setOptionsData
            }}
        >
            {children}
        </SupabaseTasksContext.Provider>
    );
}

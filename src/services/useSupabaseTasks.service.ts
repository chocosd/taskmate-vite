import {
    ConnectionsUser,
    OptionsData,
    SupabaseTasksContextType,
    TasksWithoutIds,
} from '@context/supabase-tasks/supabase-tasks-context.model';
import { TaskListView } from '@enums/task-list-view.enum';
import { supabase } from '@lib/supabaseClient';
import { Task, TaskPriority } from '@models/task.model';
import { User } from '@supabase/supabase-js';
import { getTasksWithUpdatedOrder } from '@utils/get-updated-order';
import { DateTime } from 'luxon';
import { useState } from 'react';

const defaultOptions = {
    assignee: { label: '', value: '' },
    due_date: '',
    priority: TaskPriority.Low,
};

export function useSupabaseTasksService(
    user: User
): SupabaseTasksContextType {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
    const [currentTab, setCurrentTab] = useState<TaskListView>(
        TaskListView.All
    );
    const [connections, setConnections] = useState<ConnectionsUser[]>(
        []
    );
    const [optionsData, setOptionsData] =
        useState<OptionsData>(defaultOptions);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const openOptions = () => setIsOptionsOpen(true);
    const closeOptions = () => setIsOptionsOpen(false);
    const [loading, setLoading] = useState<boolean>(true);

    function syncTaskStates(
        taskId: string,
        updater: React.SetStateAction<Task[]>
    ) {
        const isCreatedByMe = createdTasks.some(
            (task) => task.id === taskId
        );

        if (isCreatedByMe) {
            setTasks(updater);
            setCreatedTasks(updater);
        } else {
            setTasks(updater);
        }
    }

    function syncTaskStatesBatch(
        tasksToSync: Task[],
        parentId?: string
    ) {
        let isCreatedByMe;
        const isCreatedForMe = tasksToSync.every(
            (task) => task.assigned_to_user_id === user.id
        );

        if (parentId) {
            isCreatedByMe = createdTasks.some(
                (task) => task.id === parentId
            );
        } else {
            isCreatedByMe = tasksToSync.every(
                (task) => task.created_by_user_id === user.id
            );
        }

        if (isCreatedByMe && isCreatedForMe) {
            setTasks((prev) => [...prev, ...tasksToSync]);
            setCreatedTasks((prev) => [...prev, ...tasksToSync]);
            return;
        }

        if (isCreatedByMe) {
            setCreatedTasks((prev) => [...prev, ...tasksToSync]);
            return;
        }

        setTasks((prev) => [...prev, ...tasksToSync]);
    }

    async function fetchCreatedTasks() {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('created_by_user_id', user!.id);
        if (data) setCreatedTasks(data);
        if (error) {
            console.error('[SupabaseTasks] Fetch error:', error);
        }
    }

    async function fetchAssignedTasks() {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('assigned_to_user_id', user.id);

        if (data) setTasks(data);

        if (error) {
            console.error('[SupabaseTasks] Fetch error:', error);
        }
    }

    async function fetchConnections() {
        const { data, error } = await supabase
            .from('connections')
            .select('*')
            .eq('user_id', user.id);

        if (error) {
            console.error(error);
        }

        if (data) {
            setConnections(data);
        }
    }

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
            ...(optionsData.assignee.value && {
                assigned_to_user_id: String(
                    optionsData.assignee.value
                ),
            }),
            ...(optionsData.due_date && {
                due_date: optionsData.due_date,
            }),
            priority: optionsData.priority ?? TaskPriority.Low,
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
                assigned_to_user_id: String(
                    optionsData.assignee.value
                ),
            }),
            ...(optionsData.due_date && {
                due_date: optionsData.due_date,
            }),
            priority: optionsData.priority ?? TaskPriority.Low,
        }));

        const { data, error } = await supabase
            .from('tasks')
            .insert(filledTasks)
            .select();

        if (!error && data?.length) {
            // const updatedTasks = (data as Task[]).filter(
            //     (task) => task.assigned_to_user_id === user!.id
            // );

            if (data.length) {
                const parentId = data.at(0)?.parent_id;

                syncTaskStatesBatch(data, parentId);
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
            syncTaskStates(id, (prev) =>
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
            syncTaskStates(id, (prev) =>
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
            syncTaskStates(id, (prev) =>
                prev.filter((task) => task.id !== id)
            );
        }
    };

    const toggleTask = async (id: string) => {
        const findById = (task: Task) => task.id === id;

        const target =
            tasks.find(findById) ?? createdTasks.find(findById);

        if (!target) {
            return;
        }

        const { data, error } = await supabase
            .from('tasks')
            .update({ completed: !target.completed })
            .eq('id', id)
            .select();

        if (!error && data?.[0]) {
            syncTaskStates(id, (tasks) =>
                tasks.map((task) => (task.id === id ? data[0] : task))
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
            syncTaskStates(parentId, (prev) =>
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
        const findById = (task: Task) => task.id === id;

        const target =
            tasks.find(findById) ?? createdTasks.find(findById);

        if (!target) {
            return;
        }

        const { data, error } = await supabase
            .from('tasks')
            .update({ title })
            .eq('id', id)
            .select();

        if (!error && data?.[0]) {
            syncTaskStates(id, (tasks) =>
                tasks.map((task) => (task.id === id ? data[0] : task))
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

    return {
        tasks,
        setTasks,
        createdTasks,
        setCreatedTasks,
        currentTab,
        setCurrentTab,
        fetchAssignedTasks,
        fetchCreatedTasks,
        fetchConnections,
        addTask,
        deleteTask,
        addTasksBatch,
        reorderTasks,
        renameTask,
        updateSubtaskTitles,
        toggleTask,
        deleteTaskWithSubtasks,
        deleteSubTasks,
        connections,
        setConnections,
        optionsData,
        setOptionsData,
        openOptions,
        closeOptions,
        isOptionsOpen,
        loading,
        setLoading,
    };
}

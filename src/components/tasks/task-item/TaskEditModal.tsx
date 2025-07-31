import { FormFieldType } from '@components/forms/form-field-types.enum';
import { FormField } from '@components/forms/form-types.model';
import FormModal from '@components/ui/FormModal';
import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { useToast } from '@context/toast/useToast';
import { ToastType } from '@enums/toast-type.enum';
import { Task, TaskPriority } from '@models/task.model';
import { TaskDateUtils } from '@utils/helpers/date.helper';
import { useEffect, useState } from 'react';

interface TaskEditModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
}

interface BaseTaskEditData {
    title: string;
    due_date: string; // Changed to string to match FormBuilder expectations
    priority: TaskPriority;
}

export type TaskEditData = {
    [K in keyof BaseTaskEditData]: BaseTaskEditData[K];
};

export default function TaskEditModal({
    task,
    isOpen,
    onClose,
}: TaskEditModalProps) {
    const { updateTask } = useSupabaseTasks();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const parsedDateISO = TaskDateUtils.parseTaskDateToISO(
        task.due_date
    );

    const [formData, setFormData] = useState<TaskEditData>({
        title: task.title,
        due_date: parsedDateISO,
        priority: task.priority || TaskPriority.Low,
    });

    // Update form data when task changes
    useEffect(() => {
        const newParsedDateISO = TaskDateUtils.parseTaskDateToISO(
            task.due_date
        );

        setFormData({
            title: task.title,
            due_date: newParsedDateISO,
            priority: task.priority || TaskPriority.Low,
        });
    }, [task]);

    const fields: FormField<TaskEditData>[] = [
        {
            name: 'title',
            type: FormFieldType.TEXT,
            label: 'Title',
            config: {
                placeholder: 'Enter task title',
                hint: 'The main title of your task',
            },
        },
        {
            name: 'due_date',
            type: FormFieldType.DATETIME,
            label: 'Due Date',
            config: {
                placeholder: 'YYYY-MM-DD HH:MM',
                hint: 'When this task should be completed (optional)',
            },
        },
        {
            name: 'priority',
            type: FormFieldType.RADIO,
            label: 'Priority',
            options: [
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
            ],
            config: {
                hint: 'Set the priority level for this task',
            },
        },
    ] as FormField<TaskEditData>[];

    const handleSubmit = async (data: TaskEditData) => {
        setIsSubmitting(true);
        try {
            const dueDateISO = data.due_date || null;

            await updateTask(task.id, {
                title: data.title,
                due_date: dueDateISO,
                priority: data.priority,
            });

            showToast(ToastType.Success, 'Task updated successfully');
            onClose();
        } catch (error) {
            console.error('Failed to update task:', error);
            showToast(ToastType.Error, 'Failed to update task');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal<TaskEditData>
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Task"
            submitLabel={isSubmitting ? 'Updating...' : 'Update Task'}
            fields={fields}
            model={formData}
            updateModel={setFormData}
            onSubmit={handleSubmit}
        />
    );
}

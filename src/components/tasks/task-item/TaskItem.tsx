import Button from '@components/ui/Button';
import { TasksWithoutIds } from '@context/supabase-tasks/supabase-tasks-context.model';
import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { useToast } from '@context/toast/useToast';
import { ToastType } from '@enums/toast-type.enum';
import { Task } from '@models/task.model';
import { taskStyles } from '@styles/taskClassNames';
import GeneratingIndicator from '@ui/GeneratingIndicator';
import Modal, { ButtonActions } from '@ui/Modal';
import ProgressBar from '@ui/ProgressBar';
import { generateTasksFromPrompt } from '@utils/generate-tasks-from-prompt';
import { Trash2 } from 'lucide-react';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskActionsBar from './TaskActionsBar';
import TaskItemHeader from './TaskItemHeader';

type TaskItemProps = {
    task: Task;
    onDragStart?: () => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: () => void;
    isDragging?: boolean;
};

export default function TaskItem({
    task,
    onDragOver,
    onDragStart,
    onDrop,
    isDragging = false,
}: TaskItemProps) {
    const {
        addTasksBatch,
        renameTask,
        updateSubtaskTitles,
        deleteSubTasks,
        deleteTaskWithSubtasks,
        toggleTask,
        addTask,
        deleteTask,
    } = useSupabaseTasks();
    const { showToast } = useToast();

    const [isSubtaskInputOpen, setSubtaskInputOpen] = useState(false);
    const [dragClass, setDragClass] = useState('');
    const [isGeneratingSubtasks, setIsGeneratingSubtasks] =
        useState(false);
    const [
        isGeneratingSubtasksInModal,
        setIsGeneratingSubtasksInModal,
    ] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [pendingRenameTask, setPendingRenameTask] =
        useState<Task | null>(null);
    const [pendingNewTitle, setPendingNewTitle] = useState('');
    const [showEditTitle, setShowEditTitle] = useState(false);
    const [inputTitle, setInputTitle] = useState(task.title);

    const navigate = useNavigate();

    useEffect(() => {
        setDragClass(() => {
            let itemClasses: string = '';

            if (isDragging) {
                itemClasses +=
                    'opacity-50 border-zinc-300 dark:border-zinc-700';
            }

            return itemClasses;
        });
    }, [isDragging, task]);

    const taskClass = (): string => {
        if (task.completed) {
            return taskStyles.completed;
        }

        if (task.generated) {
            return taskStyles.ai;
        }

        return taskStyles.default;
    };

    const completedTaskClass = () => {
        return task.completed ? 'line-through' : '';
    };

    const handleManualSubtask = () => {
        setSubtaskInputOpen(true);
    };

    const handleTaskToggleOnChange = () => toggleTask(task.id);

    const handleTaskDeleteOnChange = () => {
        if (task.subtasks?.length) {
            setShowConfirmModal(true);
        } else {
            deleteTask(task.id);
        }
    };

    const toggleRenameEdit = (
        e?: React.MouseEvent<HTMLButtonElement>
    ) => {
        e?.preventDefault();

        setShowEditTitle((prev) => !prev);
    };

    const handleRenameAttempt = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key !== 'Enter') {
            return;
        }

        const newTitle = (e.target as unknown as { value: string })
            .value;

        if (task.subtasks && !!task.subtasks.length) {
            setPendingRenameTask(task);
            setPendingNewTitle(newTitle);
            setIsRenameModalOpen(true);
            return;
        }

        renameTask(task.id, newTitle);
        toggleRenameEdit();
    };

    const confirmDelete = () => deleteTaskWithSubtasks(task.id);

    const handleAiSubtask = async (newTitle?: boolean) => {
        setIsGeneratingSubtasks(true);

        let title = task.title;

        if (newTitle) {
            title = pendingNewTitle;
        }

        try {
            const prompt = `${import.meta.env.VITE_AI_SYSTEM_SUB_PROMPT} "${title}"`;

            const results = await generateTasksFromPrompt(prompt);

            const tasks: TasksWithoutIds[] = results.map(
                (title, index) => ({
                    title,
                    generated: true,
                    parent_id: task.id,
                    order: index,
                    completed: false,
                    created_at: DateTime.now().toISO(),
                })
            );

            addTasksBatch(tasks);
        } catch (err) {
            showToast(
                ToastType.Error,
                `Subtask AI generation failed: ${err}`
            );
        } finally {
            setIsGeneratingSubtasks(false);
        }
    };

    const updateAiSubtaskTitles = async () => {
        setIsGeneratingSubtasksInModal(true);
        confirmRenameTask();

        try {
            const prompt = `${import.meta.env.VITE_AI_SYSTEM_SUB_RE_PROMPT.replace('{}', task.subtasks!.length + 1)} "${pendingNewTitle}"`;

            const results = await generateTasksFromPrompt(prompt);

            await updateSubtaskTitles(task.id, results);
        } catch (err) {
            showToast(
                ToastType.Error,
                `Subtask AI generation failed: ${err}`
            );
        } finally {
            setIsGeneratingSubtasksInModal(false);
        }
    };

    const handleSubtaskInput = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === 'Enter') {
            addTask({
                title: e.currentTarget.value,
                parent_id: task.id,
                order: 0,
            });
            setSubtaskInputOpen(false);
        }
    };

    const confirmRenameTask = () => {
        const id = pendingRenameTask?.id;

        if (!id) {
            return;
        }

        renameTask(id, pendingNewTitle);
        toggleRenameEdit();
    };

    const renameModalActions: ButtonActions[] = [
        {
            name: 'Remove subtasks and re-generate',
            action: async () => {
                await deleteSubTasks(task.id);
                await handleAiSubtask(true);
                confirmRenameTask();
                setIsRenameModalOpen(false);
            },
        },
        {
            name: 'Update subtask titles',
            action: async () => {
                await updateAiSubtaskTitles();
                setIsRenameModalOpen(false);
            },
        },
    ];

    return (
        <>
            <li
                key={task.id}
                draggable
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                className={`${taskClass()} relative group ${dragClass}`}
            >
                <div className={`flex w-full items-start justify-start gap-3 ${completedTaskClass()}`}>
                    <div className="w-full flex flex-col gap-2">
                    <TaskItemHeader
                        task={task}
                        showEditTitle={showEditTitle}
                        inputTitle={inputTitle}
                        onTitleChange={setInputTitle}
                        onRenameKeyDown={handleRenameAttempt}
                        onCheckboxToggle={handleTaskToggleOnChange}
                    />
                        {isGeneratingSubtasks ? (
                            <div className="flex w-full items-start gap-2 mt-2">
                                <GeneratingIndicator message="Generating subtasks from task..." />
                            </div>
                        ) : (
                            !!task.subtasks?.length && (
                                <div className="flex w-full items-start gap-2 mt-2">
                                    <ProgressBar
                                        subtasks={task.subtasks}
                                        onView={() =>
                                            navigate(
                                                `/dashboard/${task.id}`
                                            )
                                        }
                                    />
                                </div>
                            )
                        )}
                    </div>
                </div>
                <TaskActionsBar 
                    onAddSubtask={handleManualSubtask}
                    onDelete={handleTaskDeleteOnChange}
                    onEdit={toggleRenameEdit}
                    onGenerateSubtasks={handleAiSubtask}
                />
            </li>
            {isSubtaskInputOpen && (
                <section className="w-full items-start flex gap-2">
                    <input
                        type="text"
                        placeholder="Add a subtask..."
                        onKeyDown={handleSubtaskInput}
                        className="w-full mb-4 px-3 py-1 text-sm rounded border border-zinc-700 dark:bg-zinc-900"
                    />
                    <Button
                        action={() => setSubtaskInputOpen(false)}
                        classes="flex-none text-zinc-500 hover:text-red-500"
                        name="Close"
                        options={{
                            overrideClasses: true,
                            hideNames: true,
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </section>
            )}
            <Modal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmDelete}
                title="Delete Task and Subtasks?"
            >
                This task has {task.subtasks?.length} subtasks.
                Deleting it will also remove all associated subtasks.
            </Modal>
            <Modal
                isOpen={isRenameModalOpen}
                onClose={() => setIsRenameModalOpen(false)}
                additionalActions={renameModalActions}
                onConfirm={confirmRenameTask}
                submitLabel="continue"
                title="Rename Task"
            >
                {isGeneratingSubtasksInModal ? (
                    <GeneratingIndicator message="Updating subtasks from task..." />
                ) : (
                    `This task has ${task.subtasks?.length} subtasks. Renaming this may make these tasks redundant.`
                )}
            </Modal>
        </>
    );
}

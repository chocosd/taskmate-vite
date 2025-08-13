import Button from '@components/ui/Button';
import { useAuth } from '@context/auth/useAuth';
import { TasksWithoutIds } from '@context/supabase-tasks/supabase-tasks-context.model';
import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { useToast } from '@context/toast/useToast';
import { ToastType } from '@enums/toast-type.enum';
import { Task } from '@models/task.model';
import { verifyProofWithChatGPT } from '@services/proofVerification.service';
import { taskStyles } from '@styles/taskClassNames';
import GeneratingIndicator from '@ui/GeneratingIndicator';
import Modal, { ButtonActions } from '@ui/Modal';
import ProgressBar from '@ui/ProgressBar';
import { generateTasksFromPrompt } from '@utils/generate-tasks-from-prompt';
import { Shield, ShieldCheck, Trash2 } from 'lucide-react';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProofSubmissionModal from '../ProofSubmissionModal';
import TaskActionsBar from './TaskActionsBar';
import TaskEditModal from './TaskEditModal';
import TaskItemHeader from './TaskItemHeader';

type TaskItemProps = {
    task: Task;
    onDragStart?: () => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: () => void;
    isDragging?: boolean;
    isSelected?: boolean;
    onSelectionChange?: (isSelected: boolean) => void;
    showSelection?: boolean;
};

export default function TaskItem({
    task,
    onDragOver,
    onDragStart,
    onDrop,
    isDragging = false,
    isSelected = false,
    onSelectionChange,
    showSelection = false,
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
        updateTaskProof,
    } = useSupabaseTasks();
    const { user } = useAuth();
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
    const [showProofModal, setShowProofModal] = useState(false);
    const [isVerifyingProof, setIsVerifyingProof] = useState(false);

    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [pendingRenameTask, setPendingRenameTask] =
        useState<Task | null>(null);
    const [pendingNewTitle, setPendingNewTitle] = useState('');
    const [showEditTitle, setShowEditTitle] = useState(false);
    const [inputTitle, setInputTitle] = useState(task.title);
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] =
        useState(false);

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

    const handleTaskToggleOnChange = () => {
        // If task requires proof and is not completed, show proof modal
        if (task.requires_proof && !task.completed) {
            setShowProofModal(true);
        } else {
            toggleTask(task.id);
        }
    };

    const handleProofSubmission = async (file: File) => {
        setIsVerifyingProof(true);

        try {
            // Verify the proof with ChatGPT
            const verificationResult = await verifyProofWithChatGPT(
                task.title,
                task.title, // Using title as description for now
                file
            );

            if (verificationResult.isValid) {
                // Proof is valid, complete the task with proof text
                const proofText = `File: ${file.name} - Verified with ${Math.round(verificationResult.confidence * 100)}% confidence. ${verificationResult.reasoning}`;
                await updateTaskProof(task.id, proofText);
                showToast(
                    ToastType.Success,
                    `Proof verified! Task completed with ${Math.round(verificationResult.confidence * 100)}% confidence.`
                );
            } else {
                // Proof is invalid, show the reasoning
                showToast(
                    ToastType.Error,
                    `Proof verification failed: ${verificationResult.reasoning}`
                );

                // Show suggestions if available
                if (
                    verificationResult.suggestions &&
                    verificationResult.suggestions.length > 0
                ) {
                    console.log(
                        'Suggestions for better proof:',
                        verificationResult.suggestions
                    );
                }
            }
        } catch (error) {
            console.error('Proof verification error:', error);
            showToast(
                ToastType.Error,
                `Proof verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        } finally {
            setIsVerifyingProof(false);
        }
    };

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

    const handleEditTask = () => {
        setIsEditTaskModalOpen(true);
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
                className={`${taskClass()} relative group ${dragClass} ${
                    isSelected
                        ? 'ring-2 ring-blue-500 bg-blue-600/10'
                        : ''
                }`}
            >
                <div
                    className={`flex w-full items-start justify-start gap-3 ${completedTaskClass()}`}
                >
                    {/* Selection Checkbox */}
                    {showSelection && (
                        <div className="flex-shrink-0 mt-1">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) =>
                                    onSelectionChange?.(
                                        e.target.checked
                                    )
                                }
                                className="w-4 h-4 text-blue-600 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                        </div>
                    )}

                    <div className="w-full flex flex-col gap-2">
                        <TaskItemHeader
                            task={task}
                            showEditTitle={showEditTitle}
                            inputTitle={inputTitle}
                            onTitleChange={setInputTitle}
                            onRenameKeyDown={handleRenameAttempt}
                            onCheckboxToggle={
                                handleTaskToggleOnChange
                            }
                        />

                        {/* Proof Status Indicator */}
                        {task.requires_proof && (
                            <div className="flex items-center gap-1">
                                {task.proof_submitted ? (
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Shield className="w-4 h-4 text-yellow-500" />
                                )}
                            </div>
                        )}

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
                    task={task}
                    user={user}
                    onAddSubtask={handleManualSubtask}
                    onDelete={handleTaskDeleteOnChange}
                    onEdit={toggleRenameEdit}
                    onEditTask={handleEditTask}
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
            <TaskEditModal
                task={task}
                isOpen={isEditTaskModalOpen}
                onClose={() => setIsEditTaskModalOpen(false)}
            />
            <ProofSubmissionModal
                isOpen={showProofModal}
                onClose={() => setShowProofModal(false)}
                onSubmit={handleProofSubmission}
                task={task}
            />
            {isVerifyingProof && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 text-white rounded-lg p-6 max-w-md shadow-lg">
                        <GeneratingIndicator message="Verifying proof with AI..." />
                    </div>
                </div>
            )}
        </>
    );
}

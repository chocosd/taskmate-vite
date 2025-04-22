import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { useToast } from '@context/toast/useToast';
import { ToastType } from '@enums/toast-type.enum';
import { Task } from '@models/task.model';
import { aiBadge, taskStyles } from '@styles/taskClassNames';
import GeneratingIndicator from '@ui/GeneratingIndicator';
import Modal, { ButtonActions } from '@ui/Modal';
import ProgressBar from '@ui/ProgressBar';
import { generateTasksFromPrompt } from '@utils/generate-tasks-from-prompt';
import { Pen, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const { renameTask, updateSubtaskTitles, deleteSubTasks, deleteTaskWithSubtasks, toggleTask, addTask, deleteTask } = useSupabaseTasks();
    const { showToast } = useToast();

    const [isSubtaskInputOpen, setSubtaskInputOpen] = useState(false);
    const [dragClass, setDragClass] = useState('');
    const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false);
    const [isGeneratingSubtasksInModal, setIsGeneratingSubtasksInModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [pendingRenameTask, setPendingRenameTask] = useState<Task | null>(null);
    const [pendingNewTitle, setPendingNewTitle] = useState('');
    const [showEditTitle, setShowEditTitle] = useState(false);
    const [inputTitle, setInputTitle] = useState(task.title);


    const navigate = useNavigate();

    useEffect(() => {
        setDragClass(() => {
            let itemClasses: string = '';

            if (isDragging) {
                itemClasses += 'opacity-50 border-zinc-300 dark:border-zinc-700';
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

    const toggleRenameEdit = (e?: React.MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault();

        setShowEditTitle((prev) => !prev);
    }

    const handleRenameAttempt = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') {
            return;
        }

        const newTitle = (e.target as unknown as { value: string }).value;

        console.log(newTitle);

        if (task.subtasks && !!task.subtasks.length) {
          setPendingRenameTask(task);
          setPendingNewTitle(newTitle);
          setIsRenameModalOpen(true);
          return;
        }
        
        renameTask(task.id, newTitle);
        toggleRenameEdit();
      }
      

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

            results.forEach((title, index) => {
                addTask({
                    title,
                    generated: true,
                    parent_id: task.id,
                    order: index,
                });
            });
        } catch (err) {
            showToast(ToastType.Error, `Subtask AI generation failed: ${err}`);
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
            showToast(ToastType.Error, `Subtask AI generation failed: ${err}`);
        } finally {
            setIsGeneratingSubtasksInModal(false);

        }
    };
    

    const handleSubtaskInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

        renameTask(
            id,
            pendingNewTitle
        );
        toggleRenameEdit();
    }

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

    const title = showEditTitle
        ?   <input 
                type='text'
                placeholder="Edit Title..."
                className="w-full px-3 py-1 text-sm rounded border border-zinc-700 dark:bg-zinc-900"
                onKeyDown={handleRenameAttempt}
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
            />
        :   <span className="text-sm truncate">
                {task.title}
            </span>;

    return (
        <>
            <li
                key={task.id}
                draggable
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                className={`${taskClass()} flex-col group ${dragClass}`}
            >
                <div
                    className={`flex items-center w-full justify-between group ${completedTaskClass()}`}
                >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* <GripVertical className="cursor-grab text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200" /> */}
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={handleTaskToggleOnChange}
                        />
                        { title }
                        {task.generated && <span className={aiBadge}>(AI)</span>}
                    </div>

                    <div
                        className={`
                            flex gap-2
                            transition-all duration-300 ease-in-out
                            opacity-0 group-hover:opacity-100
                            flex-[0_0_0] group-hover:flex-[0_0_auto]
                            overflow-hidden
                        `}
                    >
                        <button
                            onClick={toggleRenameEdit}
                            className="p-1 rounded hover:bg-zinc-700"
                            title="Edit Title"
                        >
                            <Pen className="w-4 h-4 text-zinc-400" />
                        </button>
                        <button
                            onClick={handleManualSubtask}
                            className="p-1 rounded hover:bg-zinc-700"
                            title="Add Subtask"
                        >
                            <Plus className="w-4 h-4 text-zinc-400" />
                        </button>
                        <button
                            onClick={() => handleAiSubtask()}
                            className="p-1 rounded hover:bg-zinc-700"
                            title="Generate Subtasks"
                        >
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                        </button>
                        <button
                            onClick={handleTaskDeleteOnChange}
                            className="text-zinc-500 hover:text-red-500"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {isGeneratingSubtasks ? (
                    <div className="mt-2 ml-6">
                        <GeneratingIndicator message="Generating subtasks from task..." />
                    </div>
                ) : (
                    !!task.subtasks?.length && (
                        <ProgressBar
                            subtasks={task.subtasks}
                            onView={() => navigate(`/dashboard/${task.id}`)}
                        />
                    )
                )}
            </li>
            {isSubtaskInputOpen && (
                <input
                    type="text"
                    placeholder="Add a subtask..."
                    onKeyDown={handleSubtaskInput}
                    className="w-full mb-4 px-3 py-1 text-sm rounded border border-zinc-700 dark:bg-zinc-900"
                />
            )}
            <Modal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmDelete}
                title="Delete Task and Subtasks?"
            >
                This task has {task.subtasks?.length} subtasks. Deleting it will also remove all
                associated subtasks.
            </Modal>
            <Modal
                isOpen={isRenameModalOpen}
                onClose={() => setIsRenameModalOpen(false)}
                additionalActions={renameModalActions}
                onConfirm={confirmRenameTask}
                confirmLabel='continue'
                title="Rename Task"
            >
                {isGeneratingSubtasksInModal 
                    ? <GeneratingIndicator message="Updating subtasks from task..." />
                    : `This task has ${task.subtasks?.length} subtasks. Renaming this may make these tasks redundant.`
                }
            </Modal>
        </>
    );
}

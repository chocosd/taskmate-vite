import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { useToast } from '@context/toast/useToast';
import { ToastType } from '@enums/toast-type.enum';
import { Task } from '@models/task.model';
import { activeGenerateButton, disabledGenerateButton } from '@styles/taskClassNames';
import Button from '@ui/Button';
import GeneratingIndicator from '@ui/GeneratingIndicator';
import TabButton from '@ui/TabButton';
import { generateTasksFromPrompt } from '@utils/generate-tasks-from-prompt';
import { ArrowLeft, PlusCircle, Sparkles } from 'lucide-react';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskList from './TaskList';

type TaskListView = 'active' | 'completed' | 'all';

export default function TaskView() {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [input, setInput] = useState('');
    const [view, setView] = useState<TaskListView>('all');
    const [isGenerating, setIsGenerating] = useState(false);

    const { tasks, loading, addTask, addTasksBatch } = useSupabaseTasks();

    const parentTask = tasks.find((t) => t.id === taskId);

    const handleAddTask = async () => {
        if (!input.trim()) {
            return;
        }

        try {
            await addTask({
                title: input.trim(),
                order: tasks.length + 1,
                parent_id: taskId ?? undefined,
                generated: false,
            });

            setInput('');
        } catch (err) {
            showToast(ToastType.Error, `Failed to add task: ${err}`);
        }
    };

    const handleGenerateTasks = async () => {
        if (!input.trim()) return;

        setIsGenerating(true);

        try {
            const aiTasks = await generateTasksFromPrompt(input.trim());

            const now = DateTime.now().toISO();
            const baseOrder = tasks.length;
            const newTasks: Task[] = aiTasks.map((title, i) => ({
                title,
                completed: false,
                order: baseOrder + i,
                generated: true,
                parent_id: taskId ?? undefined,
                created_at: now,
            })) as Task[];

            await addTasksBatch(newTasks);

            setInput('');
        } catch (err) {
            showToast(ToastType.Error, `AI generation failed: ${err}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmitOnEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTask();
        }
    };

    const isTabActive = (taskView: TaskListView) => taskView === view;

    const tasksToShow = tasks
        .filter((task) => {
            if (taskId) {
                return task.parent_id === taskId;
            }

            if (view === 'active') {
                return !task.completed && !task.parent_id;
            }
            if (view === 'completed') {
                return task.completed && !task.parent_id;
            }

            return !task.parent_id;
        })
        .sort((a, b) => a.order - b.order);

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            {taskId && (
                <div className="mb-4">
                    <Button
                        action={() => navigate('/dashboard')}
                        classes="text-sm text-zinc-400 hover:text-white px-2 py-1 inline-flex items-center gap-2"
                        options={{ overrideClasses: true }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to all tasks
                    </Button>
                </div>
            )}
            <h1 className="text-2xl font-semibold mb-1">
                {parentTask ? parentTask.title : 'Your Tasks'}
            </h1>
            {parentTask && <p className="text-sm text-zinc-500 mb-6">Subtasks for this task</p>}

            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    placeholder={parentTask ? 'Add a subtask...' : 'Add a new task'}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleSubmitOnEnter}
                    className="flex-1 px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Button action={handleAddTask}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add
                </Button>
                <Button
                    action={handleGenerateTasks}
                    classes={input.trim() ? activeGenerateButton : disabledGenerateButton}
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                </Button>
            </div>

            {!taskId && (
                <div className="flex gap-2 mb-4">
                    <TabButton
                        name="All"
                        isActive={isTabActive('all')}
                        action={() => setView('all')}
                    />
                    <TabButton
                        name="Active"
                        isActive={isTabActive('active')}
                        action={() => setView('active')}
                    />
                    <TabButton
                        name="Completed"
                        isActive={isTabActive('completed')}
                        action={() => setView('completed')}
                    />
                </div>
            )}

            {loading || isGenerating ? (
                <GeneratingIndicator />
            ) : (
                <TaskList tasks={tasksToShow} allTasks={tasks} />
            )}
        </div>
    );
}

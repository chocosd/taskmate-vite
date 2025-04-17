import { useTasks } from '@hooks/useTasks.hooks';
import { TaskActionTypes } from '@state/task/enums/task-state.enum';
import Button from '@ui/Button';
import { generateTasksFromPrompt } from '@utils/generate-tasks-from-prompt';
import { PlusCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import TaskList from './TaskList';
import GeneratingIndicator from './ui/GeneratingIndicator';
import TabButton from './ui/TabButton';

type TaskListView = 'active' | 'completed' | 'all';

export default function TaskView() {
    const { dispatch, state } = useTasks();
    const [input, setInput] = useState('');
    const [view, setView] = useState<TaskListView>('all');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAddTask = () => {
        if (!input.trim()) {
            return;
        }

        dispatch({ type: TaskActionTypes.AddTask, payload: { title: input } });

        setInput('');
    };

    const filteredTasks = state.tasks.filter((task) => {
        if (view === 'active') {
            return !task.completed;
        }

        if (view === 'completed') {
            return task.completed;
        }

        return true;
    });

    const handleGenerateTasks = async () => {
      if (!input.trim()) {
        return;
      };

      setIsGenerating(true);
    
      try {
        const aiTasks = await generateTasksFromPrompt(input.trim());
    
        aiTasks.forEach((title) =>
          dispatch({
            type: TaskActionTypes.AddTask,
            payload: { title, generated: true },
          })
        );
        setInput("");
      } catch (err) {
          console.error("AI generation failed", err);
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

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6">Your Tasks</h1>

            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Add a new task"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleSubmitOnEnter}
                    className="flex-1 px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Button action={handleAddTask}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add
                </Button>
                <Button action={handleGenerateTasks} classes={['bg-blue-600 text-white']}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                </Button>
            </div>

            <div className="flex gap-2 mb-4">
                <TabButton name="All" isActive={isTabActive('all')} action={() => setView('all')} />
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

            {isGenerating ? (
                <GeneratingIndicator/>
            ) : (
                <TaskList tasks={filteredTasks} />
            )}
        </div>
    );
}

import { useTasks } from '@hooks/useTasks.hooks';
import { TaskActionTypes } from '@state/task/enums/task-state.enum';
import Button from '@ui/Button';
import { PlusCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import TaskList from './TaskList';

export default function TaskView() {
    const { dispatch } = useTasks();
    const [input, setInput] = useState('');

    const handleAddTask = () => {
        if (!input.trim()) {
            return;
        }

        dispatch({ type: TaskActionTypes.AddTask, payload: { title: input } });

        setInput('');
    };

    const handleAIStub = () => {
        dispatch({
            type: TaskActionTypes.AddTask,
            payload: { title: 'Learn React fundamentals', generated: true },
        });
        dispatch({
            type: TaskActionTypes.AddTask,
            payload: { title: 'Build a task manager', generated: true },
        });
        dispatch({
            type: TaskActionTypes.AddTask,
            payload: { title: 'Add dark mode support', generated: true },
        });
    };

    const handleSubmitOnEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTask();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6">Your Tasks</h1>

            <div className="flex items-center gap-2 mb-6">
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
                <Button action={handleAIStub} classes={['bg-blue-600 text-white']}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                </Button>
            </div>

            <TaskList />
        </div>
    );
}

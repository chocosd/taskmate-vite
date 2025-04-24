import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { useTaskActions } from '@hooks/useTaskActions.hooks'; // Hook to handle add/generate
import {
    activeGenerateButton,
    disabledGenerateButton,
} from '@styles/taskClassNames';
import Button from '@ui/Button';
import { StateSetter } from '@utils/types/state-setter.type';
import { PlusCircle, Settings, Sparkles } from 'lucide-react';
import { useState } from 'react';

type TaskInputBarProps = {
    setIsGenerating: StateSetter<boolean>;
};

export default function TaskInputBar({
    setIsGenerating,
}: TaskInputBarProps) {
    const [input, setInput] = useState('');
    const { handleAddTask, handleGenerateTasks } = useTaskActions(input, setInput);
    const { openOptions } = useSupabaseTasks();

    const handleSubmitOnEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTask();
        }
    };

    return (
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
            <Button
                action={async () => {
                    setIsGenerating(true);
                    await handleGenerateTasks();
                    setIsGenerating(false);
                }}
                classes={
                    input.trim()
                        ? activeGenerateButton
                        : disabledGenerateButton
                }
            >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
            </Button>
            <Button
                action={openOptions}
                styles={{ alignSelf: 'stretch' }}
            >
                <Settings className="w-4 h-4" />
            </Button>
        </div>
    );
}

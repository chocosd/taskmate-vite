import Button from '@components/ui/Button';
import { Pen, Plus, Sparkles, Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

type ActionConfig = {
    label: string;
    onClick: () => void;
    icon: ReactNode;
    hoverClasses?: string;
};

type TaskActionsBarProps = {
    onEdit: () => void;
    onAddSubtask: () => void;
    onGenerateSubtasks: () => void;
    onDelete: () => void;
};

export default function TaskActionsBar({
    onEdit,
    onAddSubtask,
    onGenerateSubtasks,
    onDelete,
}: TaskActionsBarProps) {
    const actions: ActionConfig[] = [
        {
            label: 'Edit Title',
            onClick: onEdit,
            icon: <Pen className="w-4 h-4 text-zinc-400" />,
        },
        {
            label: 'Add Subtask',
            onClick: onAddSubtask,
            icon: <Plus className="w-4 h-4 text-zinc-400" />,
        },
        {
            label: 'Generate Subtasks',
            onClick: onGenerateSubtasks,
            icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
        },
        {
            label: 'Delete',
            onClick: onDelete,
            icon: <Trash2 className="w-4 h-4" />,
            hoverClasses: 'hover:text-red-500',
        },
    ];

    return (
        <div className="absolute top-3 right-3 bg-zinc-900 rounded-bl-lg flex gap-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {actions.map(
                (
                    {
                        label,
                        onClick,
                        icon,
                        hoverClasses = 'hover:bg-zinc-700',
                    },
                    index
                ) => (
                    <Button
                        key={label + index}
                        action={onClick}
                        classes={`p-1 rounded ${hoverClasses}`}
                        name={label}
                        options={{
                            overrideClasses: true,
                            hideNames: true,
                        }}
                    >
                        {icon}
                    </Button>
                )
            )}
        </div>
    );
}

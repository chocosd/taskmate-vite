import { TaskStatus } from '@state/task/enums/task-status.enum';
import { Eye } from 'lucide-react';
import Button from './Button';

type ProgressBarProps = {
    subtasks: TaskStatus[];
    onView?: () => void;
};

export default function ProgressBar({
    subtasks,
    onView,
}: ProgressBarProps) {
    if (!subtasks.length) {
        return null;
    }

    const statusToColor = {
        [TaskStatus.Completed]: 'bg-green-500',
        [TaskStatus.Generated]: 'bg-purple-500',
        [TaskStatus.Manual]: 'bg-blue-500',
    };

    const complete = subtasks.filter(
        (s) => s === TaskStatus.Completed
    ).length;

    return (
        <div className="mt-2 w-full flex flex-col gap-1">
            <div className="w-full flex items-center justify-between">
                {onView && (
                    <Button
                        action={onView}
                        classes="mr-3"
                        size="small"
                    >
                        <Eye className="w-3 h-3" />
                    </Button>
                )}

                <div className="flex-1 h-2 gap-1 rounded-md bg-white/10 overflow-hidden flex">
                    {subtasks.map((status, i) => (
                        <div
                            key={i}
                            className={`flex-1 ${statusToColor[status]}`}
                        />
                    ))}
                </div>
            </div>
            <span className="text-xs text-zinc-400">
                {complete}/{subtasks.length} subtasks complete
            </span>
        </div>
    );
}

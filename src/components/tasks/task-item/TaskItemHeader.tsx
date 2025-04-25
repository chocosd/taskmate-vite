import ProfilePicture from '@components/ui/ProfilePicture';
import { Task, TaskPriority } from '@models/task.model';
import DateHelper from '@utils/helpers/date.helper';

interface TaskItemHeaderProps {
    task: Task;
    showEditTitle: boolean;
    inputTitle: string;
    onTitleChange: (val: string) => void;
    onCheckboxToggle: () => void;
    onRenameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function TaskItemHeader({
    task,
    showEditTitle,
    inputTitle,
    onTitleChange,
    onCheckboxToggle,
    onRenameKeyDown,
}: TaskItemHeaderProps) {
    const title = showEditTitle ? (
        <input
            type="text"
            placeholder="Edit Title..."
            className="w-full px-3 py-1 text-sm rounded border border-zinc-700 dark:bg-zinc-900"
            value={inputTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={onRenameKeyDown}
        />
    ) : (
        <span className="text-lg break-words font-bold task-item-title">
            {task.title}
        </span>
    );

    const priorityStyles = () => {
        let styles = { background: 'bg-transparent', color: 'text-white' };
        switch (task.priority) {
            case TaskPriority.High:
                styles = { background: 'bg-red-500', color: 'text-white' };
                break;
            case TaskPriority.Medium:
                styles = { background: 'bg-orange-500', color: 'text-white' };
                break;
            case TaskPriority.Low:
                styles = { background: 'bg-yellow-500', color: 'text-black' };
                break;
        }

        return styles;
    };

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-start gap-3 justify-start text-2xl">
                <input
                    type="checkbox"
                    className="accent-primary mt-[8px]"
                    checked={task.completed}
                    onChange={onCheckboxToggle}
                />
                <ProfilePicture
                    user={{ profile_picture: '', email: 'hello@stevendix.co.uk' }}
                    size={22}
                    className="mt-[4px]"
                />
                {title}
            </div>

            <div className="flex w-full items-center gap-2 mt-1">
                {task.priority && (
                    <div className={`flex px-3 py-1 items-center gap-1 rounded-md ${priorityStyles().background}`}>
                        <span className={`text-xs font-bold ${priorityStyles().color}`}>{task.priority}</span>
                    </div>
                )}
                <span className="text-xs text-blue-400">(AI)</span>
                {task.due_date && (
                    <div className="text-xs text-zinc-400">
                        {DateHelper(task.due_date).formatRelativeDueDate()}
                    </div>
                )}
            </div>
        </div>
    );
}

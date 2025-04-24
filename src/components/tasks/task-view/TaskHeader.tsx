import Button from '@components/ui/Button';
import { Task } from '@models/task.model';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type TaskHeaderProps = {
    parentTask?: Task;
    taskId?: string;
};

export default function TaskHeader({
    parentTask,
    taskId,
}: TaskHeaderProps) {
    const navigate = useNavigate();

    return (
        <>
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
            {parentTask && (
                <p className="text-sm text-zinc-500 mb-6">
                    Subtasks for this task
                </p>
            )}
        </>
    );
}

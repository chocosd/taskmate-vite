import Button from '@components/ui/Button';
import FormModal from '@components/ui/FormModal';
import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { TaskListView } from '@enums/task-list-view.enum';
import { Task } from '@models/task.model';
import { Routes } from '@routes/routes.enum';
import GeneratingIndicator from '@ui/GeneratingIndicator';
import { createOptionFields } from '@utils/functions/create-option-fields';
import { TaskDateUtils } from '@utils/helpers/date.helper';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskList from '../TaskList';
import TaskHeader from './TaskHeader';
import TaskInputBar from './TaskInputBar';
import TaskTabs from './TaskTabs';

export default function TaskView() {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();

    const [isGenerating, setIsGenerating] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

    const {
        connections,
        tasks,
        createdTasks,
        loading,
        isOptionsOpen,
        closeOptions,
        setOptionsData,
        optionsData,
        currentTab,
        setCurrentTab,
    } = useSupabaseTasks();

    const parentTask = tasks.find((t) => t.id === taskId);

    useEffect(() => {
        const isCreatedBy = currentTab === TaskListView.CreatedBy;

        const result = (isCreatedBy ? createdTasks : tasks)
            .filter((task) => {
                if (taskId) {
                    return task.parent_id === taskId;
                }
                if (currentTab === TaskListView.Active) {
                    return !task.completed && !task.parent_id;
                }
                if (currentTab === TaskListView.Completed) {
                    return task.completed && !task.parent_id;
                }

                return !task.parent_id;
            })
            .sort((a, b) => a.order - b.order);

        setFilteredTasks(result);
    }, [currentTab, taskId, tasks, createdTasks]);

    const optionFields = createOptionFields(connections);

    const handleOptionsSubmit = (data?: Record<string, unknown>) => {
        if (!data) {
            return;
        }
    };

    const handleCalendarNavigation = () => {
        navigate(`/${Routes.Calendar}`);
    };

    // Filter out overdue tasks for calendar scheduling
    const schedulableTasks = TaskDateUtils.getSchedulableTasks(tasks);

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <TaskHeader parentTask={parentTask} taskId={taskId} />

            <TaskInputBar setIsGenerating={setIsGenerating} />

            {!taskId && (
                <>
                    <TaskTabs
                        setCurrentTab={setCurrentTab}
                        currentTab={currentTab}
                    />

                    {/* Calendar CTA - only show when there are schedulable tasks and not viewing subtasks */}
                    {schedulableTasks.length > 0 && (
                        <div className="mb-4 p-3 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-white mb-1">
                                        Organize Your Schedule
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        Let AI schedule your{' '}
                                        {schedulableTasks.length}{' '}
                                        tasks around your calendar
                                    </p>
                                </div>
                                <Button
                                    action={handleCalendarNavigation}
                                    classes="ml-3 px-3 py-1 text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:opacity-90 transition-opacity inline-flex items-center gap-1"
                                    options={{
                                        overrideClasses: true,
                                    }}
                                >
                                    <Calendar className="w-3 h-3" />
                                    Calendar
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {loading || isGenerating ? (
                <GeneratingIndicator />
            ) : (
                <TaskList
                    tasks={filteredTasks}
                    allTasks={
                        currentTab === TaskListView.CreatedBy
                            ? createdTasks
                            : tasks
                    }
                />
            )}

            <FormModal
                title="Task Options"
                isOpen={isOptionsOpen}
                fields={optionFields}
                updateModel={setOptionsData}
                model={optionsData}
                onClose={() => closeOptions()}
                onSubmit={() => {
                    handleOptionsSubmit(optionsData);
                    closeOptions();
                }}
            />
        </div>
    );
}

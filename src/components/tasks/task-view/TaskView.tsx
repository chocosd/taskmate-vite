import { FormField } from '@components/forms/form-types.model';
import Button from '@components/ui/Button';
import FormModal from '@components/ui/FormModal';
import { OptionsData } from '@context/supabase-tasks/supabase-tasks-context.model';
import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { TaskListView } from '@enums/task-list-view.enum';
import { useTranslation } from '@hooks/useTranslation';
import { Task } from '@models/task.model';
import { Routes } from '@routes/routes.enum';
import GeneratingIndicator from '@ui/GeneratingIndicator';
import { createOptionFields } from '@utils/functions/create-option-fields';
import { TaskDateUtils } from '@utils/helpers/date.helper';
import { Calendar, Check, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskList from '../TaskList';
import TaskHeader from './TaskHeader';
import TaskInputBar from './TaskInputBar';
import TaskTabs from './TaskTabs';

export default function TaskView() {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const { translate } = useTranslation();

    console.log(translate);

    const [isGenerating, setIsGenerating] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<Set<string>>(
        new Set()
    );
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [showSelectionBar, setShowSelectionBar] = useState(false);

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
        toggleTask,
        deleteTask,
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
                if (currentTab === TaskListView.Overdue) {
                    return (
                        !task.completed &&
                        !task.parent_id &&
                        TaskDateUtils.isTaskOverdue(task)
                    );
                }

                return !task.parent_id;
            })
            .sort((a, b) => a.order - b.order);

        setFilteredTasks(result);
    }, [currentTab, taskId, tasks, createdTasks]);

    const optionFields = createOptionFields(
        connections
    ) as unknown as FormField<OptionsData>[];

    const handleOptionsSubmit = (data?: Record<string, unknown>) => {
        if (!data) {
            return;
        }
    };

    const handleCalendarNavigation = () => {
        navigate(`/${Routes.Calendar}`);
    };

    // Mass selection handlers
    const handleTaskSelection = (
        taskId: string,
        isSelected: boolean
    ) => {
        const newSelected = new Set(selectedTasks);
        if (isSelected) {
            newSelected.add(taskId);
        } else {
            newSelected.delete(taskId);
        }
        setSelectedTasks(newSelected);

        if (newSelected.size === 0) {
            setIsSelectionMode(false);
            setShowSelectionBar(false);
        } else if (!isSelectionMode) {
            setIsSelectionMode(true);
            setShowSelectionBar(true);
        }
    };

    const handleSelectAll = () => {
        if (selectedTasks.size === filteredTasks.length) {
            setSelectedTasks(new Set());
            setIsSelectionMode(false);
            setShowSelectionBar(false);
        } else {
            setSelectedTasks(
                new Set(filteredTasks.map((task) => task.id))
            );
            setIsSelectionMode(true);
            setShowSelectionBar(true);
        }
    };

    const handleBulkComplete = async () => {
        const promises = [...selectedTasks].map((taskId) =>
            toggleTask(taskId)
        );
        await Promise.all(promises);
        setSelectedTasks(new Set());
        setIsSelectionMode(false);
        setShowSelectionBar(false);
    };

    const handleBulkDelete = async () => {
        if (
            window.confirm(
                translate('TASK_VIEW.DELETE_CONFIRMATION', {
                    size: selectedTasks.size,
                })
            )
        ) {
            const promises = [...selectedTasks].map((taskId) =>
                deleteTask(taskId)
            );
            await Promise.all(promises);
            setSelectedTasks(new Set());
            setIsSelectionMode(false);
            setShowSelectionBar(false);
        }
    };

    const handleCancelSelection = () => {
        setSelectedTasks(new Set());
        setIsSelectionMode(false);
        setShowSelectionBar(false);
    };

    const handleSelectTasks = () => {
        setIsSelectionMode(true);
        setShowSelectionBar(true);
    };

    // Filter out overdue tasks for calendar scheduling
    const schedulableTasks = TaskDateUtils.getSchedulableTasks(tasks);

    return (
        <div className="w-full max-w-2xl mx-auto h-screen flex flex-col">
            {/* Fixed Header Section */}
            <div className="flex-shrink-0 p-4">
                <TaskHeader parentTask={parentTask} taskId={taskId} />
                <TaskInputBar setIsGenerating={setIsGenerating} />

                {!taskId && (
                    <>
                        <TaskTabs
                            setCurrentTab={setCurrentTab}
                            currentTab={currentTab}
                            onSelectTasks={handleSelectTasks}
                            showSelectButton={
                                filteredTasks.length > 0 &&
                                !isSelectionMode
                            }
                        />

                        {/* Calendar CTA - only show when there are schedulable tasks and not viewing subtasks */}
                        {schedulableTasks.length > 0 && (
                            <div className="mb-4 p-3 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-white mb-1">
                                            {translate(
                                                'TASK_VIEW.ORGANIZE_SCHEDULE'
                                            )}
                                        </h3>
                                        <p className="text-xs text-zinc-400">
                                            {translate(
                                                'TASK_VIEW.ORGANIZE_SCHEDULE_DESCRIPTION',
                                                {
                                                    count: schedulableTasks.length,
                                                }
                                            )}
                                        </p>
                                    </div>
                                    <Button
                                        action={
                                            handleCalendarNavigation
                                        }
                                        classes="ml-3 px-3 py-1 text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:opacity-90 transition-opacity inline-flex items-center gap-1"
                                        options={{
                                            overrideClasses: true,
                                        }}
                                    >
                                        <Calendar className="w-3 h-3" />
                                        {translate(
                                            'TASK_VIEW.CALENDAR'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Mass Selection Controls - Animated */}
                        <div
                            className={`transition-all duration-300 ease-out overflow-hidden ${
                                showSelectionBar
                                    ? 'max-h-20 opacity-100 mb-4'
                                    : 'max-h-0 opacity-0 mb-0'
                            }`}
                        >
                            <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-white">
                                            {translate(
                                                'TASK_VIEW.TASKS_SELECTED',
                                                {
                                                    count: selectedTasks.size,
                                                }
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            action={handleSelectAll}
                                            classes="px-3 py-1 text-xs bg-zinc-600 text-white rounded-md hover:bg-zinc-700 transition-colors inline-flex items-center gap-1"
                                            options={{
                                                overrideClasses: true,
                                            }}
                                        >
                                            {selectedTasks.size ===
                                            filteredTasks.length
                                                ? translate(
                                                      'TASK_VIEW.DESELECT_ALL'
                                                  )
                                                : translate(
                                                      'TASK_VIEW.SELECT_ALL'
                                                  )}
                                        </Button>
                                        <Button
                                            action={
                                                handleBulkComplete
                                            }
                                            classes="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors inline-flex items-center gap-1"
                                            options={{
                                                overrideClasses: true,
                                            }}
                                        >
                                            <Check className="w-3 h-3" />
                                            {translate(
                                                'TASK_VIEW.BULK_COMPLETE'
                                            )}
                                        </Button>
                                        <Button
                                            action={handleBulkDelete}
                                            classes="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors inline-flex items-center gap-1"
                                            options={{
                                                overrideClasses: true,
                                            }}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            {translate(
                                                'TASK_VIEW.BULK_DELETE'
                                            )}
                                        </Button>
                                        <Button
                                            action={
                                                handleCancelSelection
                                            }
                                            classes="px-3 py-1 text-xs bg-zinc-600 text-white rounded-md hover:bg-zinc-700 transition-colors inline-flex items-center gap-1"
                                            options={{
                                                overrideClasses: true,
                                            }}
                                        >
                                            <X className="w-3 h-3" />
                                            {translate(
                                                'COMMON.CANCEL'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Scrollable Task List Section */}
            <div className="flex-1 overflow-hidden">
                {isGenerating ? (
                    <div className="h-full flex items-center justify-center">
                        <GeneratingIndicator />
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto px-4 pb-4">
                        <TaskList
                            tasks={filteredTasks}
                            allTasks={
                                currentTab === TaskListView.CreatedBy
                                    ? createdTasks
                                    : tasks
                            }
                            loading={loading}
                            selectedTasks={selectedTasks}
                            onTaskSelection={handleTaskSelection}
                            onSelectAll={handleSelectAll}
                            isSelectionMode={isSelectionMode}
                            allSelected={
                                selectedTasks.size ===
                                    filteredTasks.length &&
                                filteredTasks.length > 0
                            }
                        />
                    </div>
                )}
            </div>

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

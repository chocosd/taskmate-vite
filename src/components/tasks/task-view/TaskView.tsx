import FormModal from '@components/ui/FormModal';
import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { TaskListView } from '@enums/task-list-view.enum';
import { Task } from '@models/task.model';
import GeneratingIndicator from '@ui/GeneratingIndicator';
import { createOptionFields } from '@utils/functions/create-option-fields';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TaskList from '../TaskList';
import TaskHeader from './TaskHeader';
import TaskInputBar from './TaskInputBar';
import TaskTabs from './TaskTabs';

export default function TaskView() {
    const { taskId } = useParams<{ taskId: string }>();

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
        setCurrentTab
    } = useSupabaseTasks();

    const parentTask = tasks.find((t) => t.id === taskId);

    useEffect(() => {
        if (currentTab === TaskListView.CreatedBy) {
            setFilteredTasks(createdTasks);
            return;
        }
        const result = tasks
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

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <TaskHeader parentTask={parentTask} taskId={taskId} />

            <TaskInputBar setIsGenerating={setIsGenerating} />

            {!taskId && (
                <TaskTabs setCurrentTab={setCurrentTab} currentTab={currentTab} />
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

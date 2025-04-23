import { AutocompleteOption } from '@components/forms/fields/AutocompleteInput';
import { FormFieldType } from '@components/forms/form-field-types.enum';
import { FormField } from '@components/forms/form-types.model';
import FormModal from '@components/ui/FormModal';
import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import Button from '@ui/Button';
import GeneratingIndicator from '@ui/GeneratingIndicator';
import TabButton from '@ui/TabButton';
import {
    ArrowLeft
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskInputBar from './TaskInputBar';
import TaskList from './TaskList';

type TaskListView = 'active' | 'completed' | 'all' | 'created';

export default function TaskView() {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();

    const [view, setView] = useState<TaskListView>('all');
    const [isGenerating, setIsGenerating] = useState(false);

    const {
        connections,
        tasks,
        createdTasks,
        loading,
        isOptionsOpen,
        closeOptions,
        setOptionsData,
        optionsData
    } = useSupabaseTasks();

    const parentTask = tasks.find((t) => t.id === taskId);

    const isTabActive = (taskView: TaskListView) => taskView === view;

    const tasksToShow = (
        isTabActive('created')
            ? createdTasks
            : tasks.filter((task) => {
                  if (taskId) {
                      return task.parent_id === taskId;
                  }

                  if (view === 'active') {
                      return !task.completed && !task.parent_id;
                  }
                  if (view === 'completed') {
                      return task.completed && !task.parent_id;
                  }

                  return !task.parent_id;
              })
    ).sort((a, b) => a.order - b.order);

    const optionFields: FormField[] = [
        {
            type: FormFieldType.AUTOCOMPLETE,
            name: 'assignee',
            label: 'Assign To',
            config: {
                loadOptions: (search: string) =>
                    Promise.resolve(
                        connections
                            .filter((conn) =>
                                conn.connection_email
                                    ?.toLowerCase()
                                    .includes(search.toLowerCase())
                            )
                            .map(
                                ({connection_email, connection_id}) =>
                                    ({
                                        label: connection_email,
                                        value: connection_id,
                                    }) as AutocompleteOption
                            )
                    ),
            },
        },
        {
            type: FormFieldType.DATETIME,
            name: 'due_date',
            label: 'Due Date',
        },
        {
            type: FormFieldType.RADIO,
            name: 'priority',
            label: 'Priority',
            options: [
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
            ],
        },
    ];

    const handleOptionsSubmit = (data?: Record<string, unknown>) => {
        if (!data) {
            return;
        }
        
        console.log(data);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
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

            <TaskInputBar setIsGenerating={setIsGenerating}/>

            {!taskId && (
                <div className="flex gap-2 mb-4">
                    <TabButton
                        name="All"
                        isActive={isTabActive('all')}
                        action={() => setView('all')}
                    />
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
                    <TabButton
                        name="Created"
                        isActive={isTabActive('created')}
                        action={() => setView('created')}
                    />
                </div>
            )}
            {loading || isGenerating ? (
                <GeneratingIndicator />
            ) : (
                <TaskList tasks={tasksToShow} allTasks={tasks} />
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

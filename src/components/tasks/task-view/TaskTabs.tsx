import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { TaskListView } from '@enums/task-list-view.enum';
import { useTranslation } from '@hooks/useTranslation';
import TabButton from '@ui/TabButton';
import Tooltip from '@ui/Tooltip';
import { CheckSquare } from 'lucide-react';
import { useEffect } from 'react';

export type TaskTabsProps = {
    currentTab: TaskListView;
    setCurrentTab: (view: TaskListView) => void;
    onSelectTasks?: () => void;
    showSelectButton?: boolean;
};

export default function TaskTabs({
    setCurrentTab,
    currentTab,
    onSelectTasks,
    showSelectButton = false,
}: TaskTabsProps) {
    const { fetchCreatedTasks } = useSupabaseTasks();
    const { translate } = useTranslation();

    const tabs: { value: TaskListView; label: string }[] = [
        {
            value: TaskListView.All,
            label: translate('TASK_TABS.ALL'),
        },
        {
            value: TaskListView.Active,
            label: translate('TASK_TABS.ACTIVE'),
        },
        {
            value: TaskListView.Completed,
            label: translate('TASK_TABS.COMPLETED'),
        },
        {
            value: TaskListView.Overdue,
            label: translate('TASK_TABS.OVERDUE'),
        },
        {
            value: TaskListView.CreatedBy,
            label: translate('TASK_TABS.CREATED_BY'),
        },
    ];

    useEffect(() => {
        if (currentTab === TaskListView.CreatedBy) {
            fetchCreatedTasks();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTab]);

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
                {tabs.map((tab) => (
                    <TabButton
                        key={tab.value}
                        name={tab.value}
                        isActive={currentTab === tab.value}
                        action={() => setCurrentTab(tab.value)}
                    >
                        {tab.label}
                    </TabButton>
                ))}
            </div>

            {showSelectButton && onSelectTasks && (
                <Tooltip
                    content={translate('TASK_VIEW.SELECT_TASKS')}
                    position="bottom"
                >
                    <button
                        onClick={onSelectTasks}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
                        title={translate('TASK_VIEW.SELECT_TASKS')}
                    >
                        <CheckSquare className="w-4 h-4" />
                    </button>
                </Tooltip>
            )}
        </div>
    );
}

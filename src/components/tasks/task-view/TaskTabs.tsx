import { useSupabaseTasks } from '@context/supabase-tasks/useSupabaseTasks';
import { TaskListView } from '@enums/task-list-view.enum';
import TabButton from '@ui/TabButton';
import { useEffect } from 'react';

export type TaskTabsProps = {
    currentTab: TaskListView;
    setCurrentTab: (view: TaskListView) => void;
};

export default function TaskTabs({
    setCurrentTab,
    currentTab,
}: TaskTabsProps) {
    const { fetchCreatedTasks } = useSupabaseTasks();

    const tabs: TaskListView[] = [
        TaskListView.All,
        TaskListView.Active,
        TaskListView.Completed,
        TaskListView.CreatedBy,
    ];

    useEffect(() => {
        if (currentTab === TaskListView.CreatedBy) {
            fetchCreatedTasks();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTab]);

    return (
        <div className="flex gap-2 mb-4">
            {tabs.map((tab) => (
                <TabButton
                    key={tab}
                    name={tab}
                    isActive={currentTab === tab}
                    action={() => setCurrentTab(tab)}
                />
            ))}
        </div>
    );
}

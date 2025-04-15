import TaskView from '@components/TaskView';
import TaskProvider from '@context/TasksProvider';

export default function Dashboard() {
    return (
        <TaskProvider>
            <TaskView />
        </TaskProvider>
    );
}

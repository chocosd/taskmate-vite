import { SupabaseTasksProvider } from '@context/supabase-tasks/SupabaseTasksProvider';
import { Outlet } from 'react-router-dom';

export default function TasksProvider() {
    return (
        <SupabaseTasksProvider>
            <Outlet />
        </SupabaseTasksProvider>
    );
}

import { SupabaseTasksProvider } from '@context/supabase-tasks/SupabaseTasksProvider';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
    return (
        <SupabaseTasksProvider>
            <Outlet />
        </SupabaseTasksProvider>
    );
}

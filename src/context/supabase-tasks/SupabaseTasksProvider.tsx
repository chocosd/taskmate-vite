import { useAuth } from '@context/auth/useAuth';
import { useSupabaseTasksService } from '@services/useSupabaseTasks.service';
import { User } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { SupabaseTasksContext } from './supabase-tasks.context';

export function SupabaseTasksProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();

    const service = useSupabaseTasksService(user as User);

    const hasFetched = useRef(false);

    useEffect(() => {
        if (!user || hasFetched.current) {
            return;
        }

        hasFetched.current = true;

        const fetchData = async () => {
            service.setLoading(true);

            try {
                await Promise.all([
                    service.fetchAssignedTasks(),
                    service.fetchCreatedTasks(),
                    service.fetchConnections(),
                ]);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                service.setLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <SupabaseTasksContext.Provider value={service}>
            {children}
        </SupabaseTasksContext.Provider>
    );
}

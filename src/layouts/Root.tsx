import ThemeToggle from '@components/ThemeToggle';
import Logo from '@components/ui/Logo';
import UserDropdown from '@components/UserDropdown';
import { useAuth } from '@context/auth/useAuth';
import { Routes } from '@routes/routes.enum';
import { Bell } from 'lucide-react';
import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const titleMap: Record<string, string> = {
    [Routes.Login]: 'Login',
    [Routes.About]: 'About',
    [Routes.Settings]: 'Settings',
    [Routes.Dashboard]: 'Dashboard',
    [Routes.Calendar]: 'Calendar',
};

export default function Root() {
    const { user } = useAuth();
    const { pathname } = useLocation();
    const isLoginPage = pathname === `/${Routes.Login}`;

    useEffect(() => {
        const fallback =
            pathname.replace('/', '').charAt(0).toUpperCase() +
            pathname.slice(2);
        const title = titleMap[pathname] || fallback || 'Taskmate';
        document.title = `Taskmate: ${title}`;
    }, [pathname]);

    const shouldShowLayout = user && !isLoginPage;

    return (
        <div className="min-h-screen w-full bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            {shouldShowLayout && (
                <header className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900 w-full">
                    <div className="text-lg font-bold tracking-tight">
                        <Link to="/">
                            <Logo size={{ h: 24 }} />
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Bell className="h-5 w-5 hover:text-primary cursor-pointer" />
                        <UserDropdown />
                    </div>
                </header>
            )}

            <main className={shouldShowLayout ? 'py-10 px-6' : ''}>
                <div
                    className={
                        shouldShowLayout
                            ? 'max-w-[1440px] mx-auto w-full'
                            : 'w-full'
                    }
                >
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

import ThemeToggle from "@components/ThemeToggle";
import { useAuth } from "@hooks/useAuth.hooks";
import { Bell, UserCircle2 } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Root() {
  const { user } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const shouldShowLayout = user && !isLoginPage;

  return (
    <div className="min-h-screen w-full bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {shouldShowLayout && (
        <header className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900 w-full">
          <div className="text-lg font-bold tracking-tight">
            <Link to="/">Taskmate</Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Bell className="h-5 w-5 hover:text-primary cursor-pointer" />
            <UserCircle2 className="h-6 w-6 hover:text-primary cursor-pointer" />
          </div>
        </header>
      )}

      <main className={shouldShowLayout ? "py-10 px-6" : ""}>
        <div className={shouldShowLayout ? "max-w-[1440px] mx-auto w-full" : "w-full"}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

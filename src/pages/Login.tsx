import LoginForm from '@components/login/LoginForm';
import ThemeToggle from '@components/ThemeToggle';
import Logo from '@ui/Logo';

export default function Login() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white">
            <div className="hidden md:flex relative w-3/5 text-white overflow-hidden">
                <div className="absolute inset-0 z-0 clip-right bg-[#00aeff] clip-reveal"></div>
                <div className="relative z-10 flex flex-col justify-center items-start w-full p-10">
                    <h1 className="text-start text-5xl font-bold mb-4">
                        Welcome to Taskmate
                    </h1>
                    <p className="text-start text-2xl max-w-md text-center">
                        Manage your tasks with your mate. Stay
                        productive. Stay on track.
                    </p>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 py-16">
                <div className="w-full max-w-sm">
                    <div className="absolute top-4 right-4 md:flex gap-4">
                        <Logo size={{ w: 150 }} />
                        <ThemeToggle />
                    </div>

                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

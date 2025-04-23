import ThemeToggle from '@components/ThemeToggle';
import { useAuth } from '@context/auth/useAuth';
import { useToast } from '@context/toast/useToast';
import { ToastType } from '@enums/toast-type.enum';
import { Routes } from '@routes/routes.enum';
import Button from '@ui/Button';
import Logo from '@ui/Logo';
import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Login() {
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const from =
        location.state?.from?.pathname ?? `/${Routes.Dashboard}`;

    const handleEmailChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err: unknown) {
            showToast(
                ToastType.Error,
                `err.message || 'Check your credentials.': ${err}`
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white">
            <div className="hidden md:flex relative w-3/5 text-white overflow-hidden">
                <div className="absolute inset-0 z-0 clip-right bg-[#00aeff] clip-reveal"></div>
                <div className="relative z-10 flex flex-col justify-center items-center w-full p-10">
                    <h1 className="text-4xl font-bold mb-4">
                        Welcome to Taskmate
                    </h1>
                    <p className="text-lg max-w-md text-center">
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
                    <h2 className="text-2xl font-semibold md:flex mb-6">
                        Log in
                    </h2>
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                            className="w-full px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <Button
                            name={
                                isLoading ? 'Logging in...' : 'Login'
                            }
                            type="submit"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}

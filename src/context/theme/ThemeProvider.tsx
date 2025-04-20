import { isBrowser } from '@utils/functions/is-browser';
import { useEffect, useState } from 'react';
import { Theme } from './theme-context.model';
import { ThemeContext } from './theme.context';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const getInitialTheme = (): Theme => {
        if (!isBrowser()) return 'light';
        const stored = localStorage.getItem('theme');
        if (stored) return JSON.parse(stored);
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme));
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

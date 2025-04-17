import { useTheme } from '@hooks/useTheme.hooks';
import Button from '@ui/Button';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle({ className }: { className?: string[] | string }) {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const classes = Array.isArray(className) ? className.join(' ') : className;

    const icon = theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />;

    return (
        <Button action={toggleTheme} classes={classes}>
            {icon}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

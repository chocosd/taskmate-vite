type ButtonProps = {
    name?: string;
    action?: () => void;
    type?: 'button' | 'submit' | 'reset';
    children?: React.ReactNode;
    classes?: string[] | string;
};

export default function Button({
    name,
    action,
    type = 'button',
    children,
    classes = '',
}: ButtonProps) {
    const classList = Array.isArray(classes) ? classes.join(' ') : classes;

    const baseStyles =
        'inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';

    const themeStyles =
        'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600';

    return (
        <button
            type={type}
            onClick={action}
            className={`${baseStyles} ${themeStyles} ${classList}`}
        >
            {name || children}
        </button>
    );
}

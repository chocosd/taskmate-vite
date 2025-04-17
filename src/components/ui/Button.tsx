export type ButtonProps = {
    name?: string;
    action?: () => void;
    type?: 'button' | 'submit' | 'reset';
    children?: React.ReactNode;
    size?: 'small' | 'normal' | 'large';
    classes?: string[] | string;
    options?: {
        overrideClasses: boolean;
    };
};

export default function Button({
    name,
    action,
    type = 'button',
    children,
    classes = '',
    size = 'normal',
    options,
}: ButtonProps) {
    const classList = Array.isArray(classes) ? classes.join(' ') : classes;

    const baseStyles = `inline-flex items-center ${size} rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none`;

    const themeStyles =
        'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600';

    let className = `${baseStyles} ${themeStyles} ${classList} ${size}`;

    if (options?.overrideClasses) {
        className = classList;
    }

    return (
        <button type={type} onClick={action} className={className}>
            {name || children}
        </button>
    );
}

import { CSSProperties } from 'react';

export type ButtonProps = {
    name?: string;
    action?: () => void;
    type?: 'button' | 'submit' | 'reset';
    children?: React.ReactNode;
    size?: 'small' | 'normal' | 'large';
    variant?:
        | 'default'
        | 'primary'
        | 'secondary'
        | 'danger'
        | 'success'
        | 'ghost';
    classes?: string[] | string;
    styles?: CSSProperties;
    disabled?: boolean;
    options?: {
        overrideClasses: boolean;
        hideNames?: boolean;
    };
};

export default function Button({
    name,
    action,
    type = 'button',
    children,
    classes = '',
    size = 'normal',
    variant = 'default',
    styles: inlineStyles,
    disabled = false,
    options,
}: ButtonProps) {
    const classList = Array.isArray(classes)
        ? classes.join(' ')
        : classes;

    const baseStyles =
        'inline-flex items-center rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none';
    const themeStyles =
        'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600';

    const sizeStyles = {
        small: 'px-2 py-1 text-xs',
        normal: 'px-3 py-2',
        large: 'px-4 py-3 text-base',
    };

    const variantStyles = {
        default: themeStyles,
        primary:
            'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
        secondary:
            'bg-zinc-600 text-white hover:bg-zinc-700 dark:bg-zinc-500 dark:hover:bg-zinc-600',
        danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
        success:
            'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
        ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
    };

    const cssClasses = [
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        disabled &&
            'opacity-50 cursor-not-allowed pointer-events-none',
        classList,
    ]
        .filter(Boolean)
        .join(' ');

    let className = cssClasses;

    if (options?.overrideClasses) {
        className = classList;
    }

    return (
        <button
            style={inlineStyles}
            type={type}
            onClick={action}
            className={className}
            title={name}
            disabled={disabled}
        >
            {(!options?.hideNames && name) || children}
        </button>
    );
}

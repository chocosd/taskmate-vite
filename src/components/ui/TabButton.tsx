import Button, { ButtonProps } from './Button';

export type TabButtonProps = Pick<
    ButtonProps,
    'name' | 'action' | 'children' | 'size'
> & {
    isActive: boolean;
};

export default function TabButton({
    name,
    action,
    children,
    isActive,
    size = 'normal',
}: TabButtonProps) {
    const tabButtonClasses = isActive
        ? `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-white ${size}`
        : `bg-transparent text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 ${size}`;

    return (
        <Button
            name={name}
            action={action}
            type="button"
            size="normal"
            classes={tabButtonClasses}
            options={{ overrideClasses: true }}
        >
            {children}
        </Button>
    );
}

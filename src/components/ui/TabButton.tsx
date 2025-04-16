import Button, { ButtonProps } from "./Button";

export type TabButtonProps = Pick<ButtonProps, "name" | "action" | "children"> & {
  isActive: boolean;
};

export default function TabButton({
  name,
  action,
  children,
  isActive,
}: TabButtonProps) {
  const tabButtonClasses = isActive
    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-white"
    : "bg-transparent text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800";

  return (
    <Button
      name={name}
      action={action}
      type="button"
      classes={tabButtonClasses}
      options={{ overrideClasses: true }}
    >
      {children}
    </Button>
  );
}

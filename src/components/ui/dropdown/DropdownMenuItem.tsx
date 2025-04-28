import { ReactNode } from 'react';

type DropdownMenuItemProps = {
    onClick: () => void;
    children: ReactNode;
};

export default function DropdownMenuItem({
    onClick,
    children,
}: DropdownMenuItemProps) {
    return (
        <div
            onClick={onClick}
            className="px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm"
        >
            {children}
        </div>
    );
}

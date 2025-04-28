import { ReactNode } from 'react';

type DropdownMenuContentProps = {
    isOpen: boolean;
    children: ReactNode;
};

export default function DropdownMenuContent({
    isOpen,
    children,
}: DropdownMenuContentProps) {
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-900 text-white rounded-md shadow-lg z-50">
            {children}
        </div>
    );
}

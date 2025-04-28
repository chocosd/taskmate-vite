import { ReactNode } from 'react';

type DropdownMenuTriggerProps = {
    onClick: () => void;
    children: ReactNode;
};

export default function DropdownMenuTrigger({
    onClick,
    children,
}: DropdownMenuTriggerProps) {
    return (
        <div onClick={onClick} className="cursor-pointer">
            {children}
        </div>
    );
}

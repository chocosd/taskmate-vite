import { ReactNode } from 'react';

type DropdownMenuProps = {
    children: ReactNode;
};

export default function DropdownMenu({
    children,
}: DropdownMenuProps) {
    return <div className="relative inline-block">{children}</div>;
}

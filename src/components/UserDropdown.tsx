import { useAuth } from '@context/auth/useAuth';
import { Routes } from '@routes/routes.enum';
import DropdownMenu from '@ui/dropdown/DropdownMenu';
import DropdownMenuContent from '@ui/dropdown/DropdownMenuContent';
import DropdownMenuItem from '@ui/dropdown/DropdownMenuItem';
import DropdownMenuSeparator from '@ui/dropdown/DropdownMenuSeparator';
import DropdownMenuTrigger from '@ui/dropdown/DropdownMenuTrigger';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from './ui/ProfilePicture';

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { profile, logout } = useAuth();
    const navigate = useNavigate();

    const goToConnections = () => {
        setIsOpen(false);
        navigate(`/${Routes.Connections}`, { replace: true });
        console.log('hey?');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger onClick={() => setIsOpen(!isOpen)}>
                <ProfilePicture user={profile} />
            </DropdownMenuTrigger>
            <DropdownMenuContent isOpen={isOpen}>
                <DropdownMenuItem
                    onClick={() => console.log('Account')}
                >
                    Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={goToConnections}>
                    Connections
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

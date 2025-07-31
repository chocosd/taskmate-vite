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
    };

    const goToCalendar = () => {
        setIsOpen(false);
        navigate(`/${Routes.Calendar}`, { replace: true });
    };

    const goToDashboard = () => {
        setIsOpen(false);
        navigate(`/${Routes.Dashboard}`, { replace: true });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger onClick={() => setIsOpen(!isOpen)}>
                <ProfilePicture user={profile} />
            </DropdownMenuTrigger>
            <DropdownMenuContent isOpen={isOpen}>
                <DropdownMenuItem onClick={goToDashboard}>
                    Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={goToCalendar}>
                    Calendar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={goToConnections}>
                    Connections
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => console.log('Account')}
                >
                    Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

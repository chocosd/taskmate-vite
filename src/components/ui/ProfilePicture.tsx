import { Profile } from '@models/profile.model';
import { User } from 'lucide-react';

export type ProfilePictureProps = {
    user: Profile | null;
    size?: number;
    className?: string;
};

function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 50%)`;
    return color;
}

export default function ProfilePicture({
    user,
    size = 32,
    className,
}: ProfilePictureProps) {
    if (!user) {
        return <User />;
    }

    const name = user?.username ?? user?.email;

    const initials = name?.[0]?.toUpperCase() ?? '?';
    const bgColor = stringToColor(name ?? 'default');

    if (user?.profile_picture) {
        return (
            <img
                src={user?.profile_picture}
                alt={name}
                className="rounded-full object-cover"
                style={{
                    width: size,
                    height: size,
                }}
            />
        );
    }

    return (
        <div
            className={`rounded-full flex-none flex items-center justify-center text-white font-semibold ${className}`}
            style={{
                backgroundColor: bgColor,
                width: size,
                height: size,
                fontSize: size / 2,
            }}
        >
            {initials}
        </div>
    );
}

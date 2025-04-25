import { User } from '@supabase/supabase-js';

export type UserExtended = Partial<User> & {
    profile_picture?: string | null;
};

export type ProfilePictureProps = {
    user: UserExtended;
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
    className
}: ProfilePictureProps) {
    const initials = user.email?.[0]?.toUpperCase() ?? '?';
    const bgColor = stringToColor(user.email ?? 'default');

    if (user.profile_picture) {
        return (
            <img
                src={user.profile_picture}
                alt={user.email}
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

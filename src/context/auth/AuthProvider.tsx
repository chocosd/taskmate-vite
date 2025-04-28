import { LogInModel } from '@components/login/LoginForm';
import Loading from '@components/ui/Loading';
import { supabase } from '@lib/supabaseClient';
import { Profile } from '@models/profile.model';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { SignUpPayload } from './auth-context.model';
import { AuthContext } from './auth.context';

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const currentUser = session?.user ?? null;
                setUser(currentUser);
            }
        );

        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            const currentUser = data.session?.user ?? null;
            setUser(currentUser);
            setLoading(false);
        };

        getSession();

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setProfile(null);
                return;
            }

            const { data: profileData, error: profileError } =
                await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

            if (profileError) {
                console.error('Profile fetch error:', profileError);
                return;
            }

            setProfile(profileData);
        };

        fetchProfile();
    }, [user]);

    const login = async ({ email, password }: LogInModel) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw error;
        }
    };

    const signUp = async ({
        email,
        password,
        username,
    }: SignUpPayload): Promise<{
        needsEmailConfirmation: boolean;
    }> => {
        const { data: signUpData, error: signUpError } =
            await supabase.auth.signUp({
                email,
                password,
            });

        if (signUpError) {
            throw signUpError;
        }

        const user = signUpData.user;
        const session = signUpData.session;

        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: user?.id,
                username,
                email,
                profile_image: null,
            });

        if (profileError) {
            throw profileError;
        }

        const needsEmailConfirmation = !session;

        return { needsEmailConfirmation };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <AuthContext.Provider
            value={{ user, login, signUp, profile, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

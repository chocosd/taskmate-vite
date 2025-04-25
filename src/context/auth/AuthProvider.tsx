import { LogInModel, SignUpModel } from '@components/login/LoginForm';
import { supabase } from '@lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { AuthContext } from './auth.context';

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user ?? null);
            setLoading(false);
        };

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        getSession();

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

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
    }: Omit<SignUpModel, 'matchingPassword'>) => {
        const { data: userData, error: signUpError } =
            await supabase.auth.signUp({
                email,
                password,
            });

        if (userData?.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: userData.user.id,
                    username,
                    profile_image: null,
                });

            if (profileError) {
                /* */
            }
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

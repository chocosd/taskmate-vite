import { LogInModel, SignUpModel } from '@components/login/LoginForm';
import { User } from '@supabase/supabase-js';

export type AuthContextType = {
    user: User | null;
    login: (loginModel: LogInModel) => Promise<void>;
    signUp: (
        signUpModel: Omit<SignUpModel, 'matchingPassword'>
    ) => Promise<void>;
    logout: () => Promise<void>;
};

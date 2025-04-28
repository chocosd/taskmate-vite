import { LogInModel, SignUpModel } from '@components/login/LoginForm';
import { Profile } from '@models/profile.model';
import { User } from '@supabase/supabase-js';

export type SignUpPayload = Omit<SignUpModel, 'matchingPassword'>;

export type AuthContextType = {
    user: User | null;
    profile: Profile | null;
    login: (loginModel: LogInModel) => Promise<void>;
    signUp: (
        signUpModel: SignUpPayload
    ) => Promise<{ needsEmailConfirmation: boolean }>;
    logout: () => Promise<void>;
};

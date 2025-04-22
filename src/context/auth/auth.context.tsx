import { createContext } from 'react';
import { AuthContextType } from './auth-context.model';

export const AuthContext = createContext<AuthContextType | null>(
    null
);

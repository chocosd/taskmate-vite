import { useLocalStorage } from '@hooks/useLocalStorage.hooks';
import { createContext } from 'react';

type AuthContextType = {
    user: string | null;
    login: (email: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useLocalStorage<string | null>('session', null);

    const login = (email: string) => {
        setUser(email);
    };

    const logout = () => {
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export { AuthContext };

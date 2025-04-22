import { createContext } from 'react';
import { ThemeContextType } from './theme-context.model';

export const ThemeContext = createContext<
    ThemeContextType | undefined
>(undefined);

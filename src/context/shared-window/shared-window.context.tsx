import { createContext } from 'react';
import { SharedWindowContextType } from './shared-window-context.model';

export const SharedWindowContext =
    createContext<SharedWindowContextType | null>(null);

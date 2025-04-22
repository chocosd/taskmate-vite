import { useContext } from 'react';
import { SharedWindowContext } from './shared-window.context';

export function useSharedWindow() {
    const context = useContext(SharedWindowContext);

    if (!context) {
        throw new Error(
            'useSharedWindow must be used within a SharedWindowProvider'
        );
    }

    return context;
}

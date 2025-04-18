import { SharedWindowContext } from '@context/SharedWindowProvider';
import { useContext } from 'react';

export function useSharedWindow() {
    const context = useContext(SharedWindowContext);

    if (!context) {
        throw new Error('useSharedWindow must be used within a SharedWindowProvider');
    }

    return context;
}

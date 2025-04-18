import { WindowPosition } from '@utils/position';
import { useRef } from 'react';
import { distinctUntilObjectChanged } from './distinct-until-object-changed';

export function usePairwisePosition() {
    const lastPosition = useRef<WindowPosition | null>(null);

    function hasChanged(newPos: WindowPosition): boolean {
        if (!lastPosition.current) {
            lastPosition.current = newPos;
            return true;
        }

        const prev = lastPosition.current;
        const isSame = distinctUntilObjectChanged(prev, newPos);

        if (!isSame) {
            lastPosition.current = newPos;
        }

        return !isSame;
    }

    return { hasChanged };
}

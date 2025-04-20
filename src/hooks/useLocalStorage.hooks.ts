import { ToastType } from '@enums/toast-type.enum';
import { invokeIfFn } from '@utils/functions/invoke-if-fn';
import { isBrowser } from '@utils/functions/is-browser';
import { useEffect, useState } from 'react';
import { useToast } from '../context/toast/useToast';

type InitialValue<T> = T | (() => T);
type LocalStorageState<T = unknown> = readonly [T, React.Dispatch<React.SetStateAction<T>>];

export function useLocalStorage<T = unknown>(
    key: string,
    initialValue: InitialValue<T>
): LocalStorageState<T> {
    const { showToast } = useToast();

    const [value, setValue] = useState<T>(() => {
        try {
            if (!isBrowser()) {
                return invokeIfFn(initialValue);
            }

            const stored = localStorage.getItem(key);
            if (stored !== null) {
                return JSON.parse(stored);
            }

            return invokeIfFn(initialValue);
        } catch (error) {
            showToast(ToastType.Error, `Error reading localStorage key "${key}": ${error}`);

            return invokeIfFn(initialValue);
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            showToast(ToastType.Error, `Error writing to localStorage key "${key}": ${error}`);
        }
    }, [key, value, showToast]);

    return [value, setValue] as const;
}

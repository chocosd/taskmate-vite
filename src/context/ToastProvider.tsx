import { ToastType } from 'enums/toast-type.enum';
import { createContext, useState } from 'react';

export type Toast = {
    id: string;
    type: ToastType;
    message: string;
};

type ToastContextType = {
    toasts: Toast[];
    showToast: (type: ToastType, message: string) => void;
    dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (type: ToastType, message: string) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, type, message }]);

        setTimeout(() => dismissToast(id), 3500);
    };

    const dismissToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export { ToastContext };

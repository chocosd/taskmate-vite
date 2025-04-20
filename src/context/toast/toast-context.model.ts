import { ToastType } from '@enums/toast-type.enum';

export type Toast = {
    id: string;
    type: ToastType;
    message: string;
};

export type ToastContextType = {
    toasts: Toast[];
    showToast: (type: ToastType, message: string) => void;
    dismissToast: (id: string) => void;
};

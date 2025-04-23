import { useToast } from '@context/toast/useToast';
import { ToastType } from '@enums/toast-type.enum';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from './Button';

const typeStyles: Record<ToastType, { text: string; bg: string }> = {
    [ToastType.Success]: {
        text: 'text-green-400',
        bg: 'bg-green-500',
    },
    [ToastType.Error]: {
        text: 'text-red-400',
        bg: 'bg-red-500',
    },
    [ToastType.Info]: {
        text: 'text-blue-400',
        bg: 'bg-blue-500',
    },
};

export default function ToastRenderer() {
    const { toasts, dismissToast } = useToast();

    return (
        <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onDismiss={() => dismissToast(toast.id)}
                />
            ))}
        </div>
    );
}

function ToastItem({
    toast,
    onDismiss,
}: {
    toast: { id: string; type: ToastType; message: string };
    onDismiss: () => void;
}) {
    const [progress, setProgress] = useState(100);
    const { text, bg } = typeStyles[toast.type];

    useEffect(() => {
        const duration = 3500;
        const interval = 50;
        const decrement = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - decrement;
            });
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative bg-zinc-900 text-white px-4 pt-3 pb-2 rounded-lg shadow-md min-w-[280px] overflow-hidden">
            <Button
                action={onDismiss}
                classes="absolute top-2 right-2 text-white/50 hover:text-white"
                options={{ overrideClasses: true }}
            >
                <X className="w-3 h-3" />
            </Button>

            <p
                className={`text-sm font-semibold capitalize mb-1 ${text}`}
            >
                {toast.type}
            </p>
            <p className="text-sm text-white/90">{toast.message}</p>

            <div className="flex h-1 overflow-hidden rounded-b bg-white/10 mt-2">
                <div
                    className={`h-full ${bg} transition-all`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

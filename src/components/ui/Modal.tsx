import { ReactNode } from 'react';
import Button from './Button';

export type ButtonActions<T = unknown> = {
    name: string;
    action: (prop?: T) => void;
    modifierClasses?: string;
};

export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    additionalActions?: ButtonActions[];
    onConfirm?: () => void;
    submitLabel?: string;
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    additionalActions,
    onConfirm,
    submitLabel = 'Submit',
}: ModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-zinc-900 text-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">
                    {title}
                </h2>
                <div className="text-sm mb-6">{children}</div>
                <div className="flex justify-end flex-wrap gap-2">
                    <Button
                        action={onClose}
                        classes="px-4 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-sm"
                        name="Cancel"
                    />
                    {additionalActions?.map((action, i) => (
                        <Button
                            key={action.name + i}
                            action={action.action}
                            name={action.name}
                            classes={`px-4 py-1 rounded ${action.modifierClasses} text-sm`}
                        />
                    ))}
                    {onConfirm && (
                        <Button
                            action={onConfirm}
                            classes="px-4 py-1 rounded bg-red-600 hover:bg-red-500 text-sm"
                            name={submitLabel}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

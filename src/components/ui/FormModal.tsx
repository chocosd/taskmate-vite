import FormBuilder, {
    FormBuilderProps,
} from '@components/forms/FormBuilder';
import Button from './Button';
import { ModalProps } from './Modal';

type FormModalProps<TModel extends Record<string, unknown>> = Omit<ModalProps, 'onConfirm' | 'children'> &
    Omit<FormBuilderProps<TModel>, 'onSubmit'> & {
        onSubmit: (data: Record<string, unknown>) => void;
    };

export default function FormModal<TModel extends Record<string, unknown>>({
    isOpen,
    onClose,
    title,
    additionalActions,
    submitLabel = 'Submit',
    fields,
    updateModel,
    model,
    onSubmit,
}: FormModalProps<TModel>) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-zinc-900 text-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">
                    {title}
                </h2>
                <div className="text-sm mb-6">
                    {
                        <FormBuilder
                            fields={fields}
                            model={model}
                            updateModel={updateModel}
                        />
                    }
                </div>
                <div className="flex justify-end gap-2">
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
                    <Button
                        action={() => onSubmit(model)}
                        classes="px-4 py-1 rounded bg-red-600 hover:bg-red-500 text-sm"
                        name={submitLabel}
                    />
                </div>
            </div>
        </div>
    );
}

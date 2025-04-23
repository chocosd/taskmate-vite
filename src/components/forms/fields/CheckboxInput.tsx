import BaseInput, { FormInputProps } from './BaseInput';

export type CheckboxInputProps = FormInputProps & {
    checked: boolean;
    onChange: (checked: boolean) => void;
};

const inputClasses =
    'h-4 w-4 rounded-sm border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-60 transition';

export default function CheckboxInput({
    checked,
    onChange,
    disabled,
    label,
    hint,
    error,
}: CheckboxInputProps) {
    return (
        <BaseInput
            label={label}
            hint={hint}
            disabled={disabled}
            error={error}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className={inputClasses}
            />
        </BaseInput>
    );
}

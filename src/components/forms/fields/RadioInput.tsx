import BaseInput, { FormInputProps } from './BaseInput';
import { FormOption } from './SelectInput';

export type RadioInputProps = FormInputProps & {
    value: string | number;
    options: FormOption[];
    onChange: (val: string | number) => void;
};

export default function RadioInput({
    label,
    value,
    options,
    onChange,
    disabled,
    error,
    hint,
}: RadioInputProps) {
    return (
        <BaseInput
            label={label}
            disabled={disabled}
            error={error}
            hint={hint}
        >
            <div className="flex gap-2">
                {options.map((opt) => {
                    const isSelected = value === opt.value;
                    const baseStyles =
                        'px-3 py-1 rounded-full border cursor-pointer text-sm select-none';
                    const selectedStyles = isSelected
                        ? opt.value === 'low'
                            ? 'bg-green-200 text-green-800 border-green-300'
                            : opt.value === 'medium'
                              ? 'bg-yellow-200 text-yellow-800 border-yellow-300'
                              : 'bg-red-200 text-red-800 border-red-300'
                        : 'bg-transparent text-zinc-500 border-zinc-300';

                    return (
                        <div
                            key={opt.value}
                            className={`${baseStyles} ${selectedStyles} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() =>
                                !disabled && onChange(opt.value)
                            }
                        >
                            {opt.label}
                        </div>
                    );
                })}
            </div>
        </BaseInput>
    );
}

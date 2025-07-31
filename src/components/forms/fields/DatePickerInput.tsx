import DateHelper from '@utils/helpers/date.helper';
import { DateTime } from 'luxon';
import BaseInput, { FormInputProps } from './BaseInput';

export type DatePickerInputProps = FormInputProps & {
    value: string; // ISO string
    onChange: (val: string) => void;
};

export default function DatePickerInput({
    label,
    value,
    onChange,
    disabled,
    error,
    hint,
}: DatePickerInputProps) {
    const localDateValue = DateHelper(value).format(
        "yyyy-MM-dd'T'HH:mm"
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        const iso = val
            ? DateTime.fromFormat(val, "yyyy-MM-dd'T'HH:mm").toISO()
            : '';
        onChange(iso ?? '');
    };

    return (
        <BaseInput
            label={label}
            disabled={disabled}
            error={error}
            hint={hint}
        >
            <input
                type="datetime-local"
                value={localDateValue}
                onChange={handleChange}
                disabled={disabled}
                className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
            />
        </BaseInput>
    );
}

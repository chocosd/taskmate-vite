import BaseInput, { FormInputProps } from './BaseInput';

export type NumberInputProps = FormInputProps & {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

const inputClasses = `w-full rounded-md border border-gray-300 dark:border-gray-600
  bg-white dark:bg-gray-800 text-sm
  text-gray-900 dark:text-gray-100
  placeholder-gray-400 dark:placeholder-gray-500
  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
  focus:border-blue-500 dark:focus:border-blue-400
  disabled:bg-gray-100 dark:disabled:bg-gray-700
  disabled:text-gray-400 dark:disabled:text-gray-500
  p-2 transition`;

export default function NumberInput({ value, onChange, disabled, label, hint, min, max, error }: NumberInputProps) {
  return (
    <BaseInput label={label} hint={hint} disabled={disabled} error={error}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        min={min}
        max={max}
        className={inputClasses}
      />
    </BaseInput>
  );
};

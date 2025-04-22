import { inputClasses } from '../styles/styles';
import BaseInput, { FormInputProps } from './BaseInput';

export type FormOption = {
  label: string;
  value: string | number;
};

export type SelectInputProps = FormInputProps & {
  value: string | number;
  onChange: (value: string | number) => void;
  options: FormOption[];
};

export default function SelectInput({
  value,
  onChange,
  disabled,
  label,
  hint,
  options,
  error
}: SelectInputProps) {
  return (
    <BaseInput label={label} hint={hint} disabled={disabled} error={error}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={inputClasses}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </BaseInput>
  );
}

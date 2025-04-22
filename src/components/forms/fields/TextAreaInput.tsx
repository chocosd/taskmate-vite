import { inputClasses } from '../styles/styles';
import BaseInput, { FormInputProps } from './BaseInput';

type TextAreaInputProps = FormInputProps & {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
};

export default function TextAreaInput({
  value,
  onChange,
  disabled,
  label,
  hint,
  error,
  rows = 4,
}: TextAreaInputProps) {
  return (
    <BaseInput label={label} hint={hint} disabled={disabled} error={error}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        className={inputClasses}
      />
    </BaseInput>
  );
}

export type BaseInputProps = {
  label: string;
  disabled?: boolean;
  hint?: string;
  error?: string | null;
  children: React.ReactNode;
};

export type FormInputProps = Omit<BaseInputProps, 'children'>;

export default function BaseInput({ label, disabled, error, hint, children }: BaseInputProps) {

  return (
    <div className="mb-4">
      <label className={`block font-medium mb-1 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
        {label}
      </label>
      {children}
      {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

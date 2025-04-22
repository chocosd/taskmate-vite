
import { useToast } from '@context/toast/useToast';
import { ToastType } from '@enums/toast-type.enum';
import React from 'react';
import { type FormInputProps } from './fields/BaseInput';
import CheckboxInput from './fields/CheckboxInput';
import NumberInput from './fields/NumberInput';
import SelectInput from './fields/SelectInput';
import TextAreaInput from './fields/TextAreaInput';
import { FormFieldType } from './form-field-types.enum';
import { type FormField } from './form-types.model';
import { useFormBuilder } from './useFormBuilder';

type FormBuilderProps = {
  fields: FormField[];
  model?: Record<string, unknown>;
  onSubmit?: (data: Record<string, unknown>) => void;
};

export default function FormBuilder({ fields, model = {}, onSubmit }: FormBuilderProps) {
  const { errors, validateForm, formState, touched, updateField } = useFormBuilder(fields, model);
  const { showToast } = useToast();

  const renderField = (field: FormField) => {
    const isHidden = typeof field.hide === 'function' ? field.hide(formState) : field.hide;

    if (isHidden) {
        return null;
    }

    const isDisabled =
      typeof field.disabled === 'function' ? field.disabled(formState) : field.disabled;

      
    const commonProps: FormInputProps = {
        disabled: isDisabled,
        error: errors[field.name],
        label: field.label,
        hint: field.config?.hint,
    };


switch (field.type) {
      case FormFieldType.NUMBER:
        return (
          <NumberInput
            key={field.name}
            value={formState[field.name] as number ?? ''}
            onChange={(val) => updateField(field.name, val)}
            {...commonProps}
            min={field.config?.min}
            max={field.config?.max}
          />
        );

      case FormFieldType.TEXTAREA:
        return (
          <TextAreaInput
            key={field.name}
            value={formState[field.name] as string ?? ''}
            onChange={(val) => updateField(field.name, val)}
            {...commonProps}
            error={touched[field.name] ? errors[field.name] : null}
            rows={field.config?.rows}
          />
        );

      case FormFieldType.SELECT:
        return (
          <SelectInput
            key={field.name}
            value={formState[field.name] as string | number ?? ''}
            onChange={(val) => updateField(field.name, val)}
            {...commonProps}
            error={touched[field.name] ? errors[field.name] : null}
            options={field.options}
          />
        );

      case FormFieldType.CHECKBOX:
        return (
          <CheckboxInput
            key={field.name}
            checked={formState[field.name] as boolean ?? false}
            onChange={(val) => updateField(field.name, val)}
            error={touched[field.name] ? errors[field.name] : null}
            {...commonProps}
          />
        );

      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
        showToast(ToastType.Error, 'Form is invalid');
        
        return;
    }
  
    onSubmit?.(formState);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map(renderField)}

      {onSubmit && (
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      )}
    </form>
  );
}

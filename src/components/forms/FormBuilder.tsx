import { useToast } from '@context/toast/useToast';
import { ToastType } from '@enums/toast-type.enum';
import { StateSetter } from '@utils/types/state-setter.type';
import React from 'react';
import AutocompleteInput, {
    AutocompleteOption,
} from './fields/AutocompleteInput';
import { type FormInputProps } from './fields/BaseInput';
import CheckboxInput from './fields/CheckboxInput';
import DatePickerInput from './fields/DatePickerInput';
import NumberInput from './fields/NumberInput';
import RadioInput from './fields/RadioInput';
import SelectInput from './fields/SelectInput';
import TextAreaInput from './fields/TextAreaInput';
import { FormFieldType } from './form-field-types.enum';
import { type FormField } from './form-types.model';
import { useFormBuilder } from './useFormBuilder';

export type FormBuilderProps<T extends Record<string, unknown>> = {
    fields: FormField[];
    model: T;
    updateModel: StateSetter<T>;
    onSubmit?: (data: T) => void;
};

export default function FormBuilder<TModel extends Record<string, unknown>>({
    fields,
    model,
    onSubmit,
    updateModel
}: FormBuilderProps<TModel>) {
    const { errors, validateForm, formState, touched, updateField } =
        useFormBuilder<TModel>(fields, model, updateModel);
    const { showToast } = useToast();

    const renderField = (field: FormField) => {
        const isHidden =
            typeof field.hide === 'function'
                ? field.hide(formState)
                : field.hide;

        if (isHidden) {
            return null;
        }

        const isDisabled =
            typeof field.disabled === 'function'
                ? field.disabled(formState)
                : field.disabled;

        const commonProps: FormInputProps = {
            disabled: isDisabled,
            error: touched && errors[field.name],
            label: field.label,
            hint: field.config?.hint,
        };

        switch (field.type) {
            case FormFieldType.NUMBER:
                return (
                    <NumberInput
                        key={field.name}
                        value={
                            (formState[field.name] as number) ?? ''
                        }
                        onChange={(val) =>
                            updateField(field.name, val)
                        }
                        {...commonProps}
                        min={field.config?.min}
                        max={field.config?.max}
                    />
                );

            case FormFieldType.RADIO:
                return (
                    <RadioInput
                        key={field.name}
                        {...commonProps}
                        options={field.options}
                        onChange={(val) =>
                            updateField(field.name, val)
                        }
                        value={
                            (formState[field.name] as string) ?? ''
                        }
                    />
                );

            case FormFieldType.AUTOCOMPLETE:
                return (
                    <AutocompleteInput
                        key={field.name}
                        value={
                            (formState[
                                field.name
                            ] as AutocompleteOption) ?? {}
                        }
                        {...commonProps}
                        onChange={(val) =>
                            updateField(field.name, val)
                        }
                        loadOptions={field.config.loadOptions}
                    />
                );

            case FormFieldType.TEXTAREA:
                return (
                    <TextAreaInput
                        key={field.name}
                        value={
                            (formState[field.name] as string) ?? ''
                        }
                        onChange={(val) =>
                            updateField(field.name, val)
                        }
                        {...commonProps}
                        rows={field.config?.rows}
                    />
                );

            case FormFieldType.DATETIME:
                return (
                    <DatePickerInput
                        key={field.name}
                        value={
                            (formState[field.name] as string) ?? ''
                        }
                        {...commonProps}
                        onChange={(val) =>
                            updateField(field.name, val)
                        }
                    />
                );

            case FormFieldType.SELECT:
                return (
                    <SelectInput
                        key={field.name}
                        value={
                            (formState[field.name] as
                                | string
                                | number) ?? ''
                        }
                        onChange={(val) =>
                            updateField(field.name, val)
                        }
                        {...commonProps}
                        options={field.options}
                    />
                );

            case FormFieldType.CHECKBOX:
                return (
                    <CheckboxInput
                        key={field.name}
                        checked={
                            (formState[field.name] as boolean) ??
                            false
                        }
                        onChange={(val) =>
                            updateField(field.name, val)
                        }
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
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Submit
                </button>
            )}
        </form>
    );
}

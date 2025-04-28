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
import PasswordInput from './fields/PasswordInput';
import RadioInput from './fields/RadioInput';
import SelectInput from './fields/SelectInput';
import TextAreaInput from './fields/TextAreaInput';
import TextInput from './fields/TextInput';
import { FormFieldType } from './form-field-types.enum';
import { type FormField } from './form-types.model';
import {
    isAutocompleteField,
    isCheckboxField,
    isDatetimeField,
    isNumberField,
    isPasswordField,
    isRadioField,
    isSelectField,
    isTextareaField,
    isTextField,
} from './guards/form-field-type.guards';
import { useFormBuilder } from './useFormBuilder';

export type FormBuilderProps<TModel extends Record<string, unknown>> =
    {
        fields: FormField<TModel>[];
        model: TModel;
        title?: string;
        children?: React.ReactNode;
        updateModel: StateSetter<TModel>;
        onSubmit?: (data: TModel) => void;
    };

export default function FormBuilder<
    TModel extends Record<string, unknown>,
>({
    fields,
    model,
    title,
    onSubmit,
    children,
    updateModel,
}: FormBuilderProps<TModel>) {
    const { errors, validateForm, formState, touched, updateField } =
        useFormBuilder<TModel>(fields, model, updateModel);
    const { showToast } = useToast();

    const renderField = <K extends keyof TModel>(
        field: FormField<TModel>
    ) => {
        const value = formState[field.name];
        const setValue = (val: TModel[K]) =>
            updateField(field.name, val);

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
            placeholder: field.config?.placeholder,
        };

        switch (field.type) {
            case FormFieldType.NUMBER:
                if (!isNumberField(field)) {
                    return null;
                }
                return (
                    <NumberInput
                        value={value as number}
                        onChange={setValue as (val: number) => void}
                        {...commonProps}
                        min={field.config?.min}
                        max={field.config?.max}
                    />
                );

            case FormFieldType.PASSWORD:
                if (!isPasswordField(field)) {
                    return null;
                }

                return (
                    <PasswordInput
                        {...commonProps}
                        value={value as string}
                        onChange={setValue as (val: string) => void}
                    />
                );

            case FormFieldType.TEXT:
                if (!isTextField(field)) {
                    return null;
                }

                return (
                    <TextInput
                        {...commonProps}
                        value={value as string}
                        onChange={setValue as (val: string) => void}
                    />
                );

            case FormFieldType.RADIO:
                if (!isRadioField(field)) {
                    return null;
                }
                return (
                    <RadioInput
                        {...commonProps}
                        options={field.options}
                        value={value as string | number}
                        onChange={
                            setValue as (val: string | number) => void
                        }
                    />
                );

            case FormFieldType.AUTOCOMPLETE:
                if (!isAutocompleteField(field)) {
                    return null;
                }

                return (
                    <AutocompleteInput
                        value={value as AutocompleteOption | null}
                        onChange={
                            setValue as (
                                val: AutocompleteOption | null
                            ) => void
                        }
                        {...commonProps}
                        loadOptions={field.config.loadOptions}
                    />
                );

            case FormFieldType.TEXTAREA:
                if (!isTextareaField(field)) {
                    return null;
                }
                return (
                    <TextAreaInput
                        value={value as string}
                        onChange={setValue as (val: string) => void}
                        {...commonProps}
                        rows={field.config?.rows}
                    />
                );

            case FormFieldType.DATETIME:
                if (!isDatetimeField(field)) {
                    return null;
                }
                return (
                    <DatePickerInput
                        value={value as string}
                        onChange={setValue as (val: string) => void}
                        {...commonProps}
                    />
                );

            case FormFieldType.SELECT:
                if (!isSelectField(field)) {
                    return null;
                }
                return (
                    <SelectInput
                        value={value as string | number}
                        onChange={
                            setValue as (val: string | number) => void
                        }
                        {...commonProps}
                        options={field.options}
                    />
                );

            case FormFieldType.CHECKBOX:
                if (!isCheckboxField(field)) {
                    return null;
                }
                return (
                    <CheckboxInput
                        checked={(value as boolean) ?? false}
                        onChange={setValue as (val: boolean) => void}
                        {...commonProps}
                    />
                );

            default:
                throw new Error(
                    `FormFieldType ${field.type} not recognised, please add this to FormBuilder.tsx`
                );
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
        <>
            {title && (
                <h2 className="text-start text-2xl font-semibold md:flex mb-6">
                    {title}
                </h2>
            )}
            <form
                className="flex flex-col items-start gap-2"
                onSubmit={handleSubmit}
            >
                {fields.map((field) => (
                    <div
                        key={String(field.name)}
                        className="flex-auto w-full"
                    >
                        {renderField(field)}
                    </div>
                ))}

                {children}

                {onSubmit && (
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                )}
            </form>
        </>
    );
}

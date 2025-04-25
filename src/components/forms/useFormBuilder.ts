import { StateSetter } from '@utils/types/state-setter.type';
import { useCallback, useState } from 'react';
import { FormFieldType } from './form-field-types.enum';
import { FormField } from './form-types.model';

function getDefaultValue(type: FormFieldType) {
    switch (type) {
        case FormFieldType.CHECKBOX:
            return false;
        case FormFieldType.NUMBER:
            return 0;
        default:
            return '';
    }
}

export function useFormBuilder<
    TModel extends Record<string, unknown>,
>(
    fields: FormField<TModel>[],
    model: TModel,
    updateModel: StateSetter<TModel>
) {
    const initialState = fields.reduce((acc, field) => {
        const defaultValue =
            model[field.name] ?? getDefaultValue(field.type);
        acc[field.name] = defaultValue as TModel[typeof field.name];
        return acc;
    }, {} as Partial<TModel>) as TModel;

    const [formState, setFormState] = useState<TModel>(initialState);
    const [errors, setErrors] = useState<
        Partial<Record<keyof TModel, string | null>>
    >({});
    const [touched, setTouched] = useState<
        Partial<Record<keyof TModel, boolean>>
    >({});

    function validateForm(): boolean {
        let isValid = true;
        const newErrors: Partial<
            Record<keyof TModel, string | null>
        > = {};
        const newTouched: Partial<Record<keyof TModel, boolean>> = {};

        for (const field of fields) {
            const value = formState[field.name];
            newTouched[field.name] = true;

            if (field.validators) {
                for (const validator of field.validators) {
                    const error = validator(value, formState);
                    if (error) {
                        newErrors[field.name] = error;
                        isValid = false;
                        break;
                    }
                }
            }
        }

        setErrors(newErrors);
        setTouched((prev) => ({ ...prev, ...newTouched }));

        return isValid;
    }

    const updateField = useCallback(
        <K extends keyof TModel>(name: K, value: TModel[K]) => {
            setFormState((prev) => ({ ...prev, [name]: value }));
            setTouched((prev) => ({ ...prev, [name]: true }));

            const updated = { ...model, [name]: value };
            updateModel(updated);

            const field = fields.find((f) => f.name === name);
            if (field?.validators) {
                for (const validator of field.validators) {
                    const error = validator(value, formState);
                    if (error) {
                        setErrors((prev) => ({
                            ...prev,
                            [name]: error,
                        }));
                        return;
                    }
                }
                setErrors((prev) => ({ ...prev, [name]: null }));
            }
        },
        [fields, formState, model, updateModel]
    );

    return {
        formState,
        errors,
        setFormState,
        updateField,
        touched,
        validateForm,
    };
}

// forms/useFormBuilder.ts
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
    fields: FormField[],
    model: TModel,
    updateModel: StateSetter<TModel>
) {
    const initialState = fields.reduce(
        (acc, field) => {
            acc[field.name] =
                model[field.name] ?? getDefaultValue(field.type);
            return acc;
        },
        {} as Record<string, unknown>
    );

    const [formState, setFormState] = useState<TModel>(
        initialState as TModel
    );
    const [errors, setErrors] = useState<
        Record<string, string | null>
    >({});
    const [touched, setTouched] = useState<Record<string, boolean>>(
        {}
    );

    function validateForm(): boolean {
        let isValid = true;
        const newErrors: Record<string, string | null> = {};
        const newTouched: Record<string, boolean> = {};

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
        (name: string, value: unknown) => {
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
        [fields, formState, updateModel]
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

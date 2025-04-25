import { FormFieldType } from '../form-field-types.enum';
import { FormField } from '../form-types.model';

export function isSelectField<TModel>(
    field: FormField<TModel>
): field is Extract<
    FormField<TModel>,
    { type: FormFieldType.SELECT }
> {
    return field.type === FormFieldType.SELECT;
}

export function isRadioField<TModel>(
    field: FormField<TModel>
): field is Extract<
    FormField<TModel>,
    { type: FormFieldType.RADIO }
> {
    return field.type === FormFieldType.RADIO;
}

export function isAutocompleteField<TModel>(
    field: FormField<TModel>
): field is Extract<
    FormField<TModel>,
    { type: FormFieldType.AUTOCOMPLETE }
> {
    return field.type === FormFieldType.AUTOCOMPLETE;
}

export function isNumberField<TModel>(
    field: FormField<TModel>
): field is Extract<
    FormField<TModel>,
    { type: FormFieldType.NUMBER }
> {
    return field.type === FormFieldType.NUMBER;
}
export function isTextareaField<TModel>(
    field: FormField<TModel>
): field is Extract<
    FormField<TModel>,
    { type: FormFieldType.TEXTAREA }
> {
    return field.type === FormFieldType.TEXTAREA;
}

export function isCheckboxField<TModel>(
    field: FormField<TModel>
): field is Extract<
    FormField<TModel>,
    { type: FormFieldType.CHECKBOX }
> {
    return field.type === FormFieldType.CHECKBOX;
}

export function isDatetimeField<TModel>(
    field: FormField<TModel>
): field is Extract<
    FormField<TModel>,
    { type: FormFieldType.DATETIME }
> {
    return field.type === FormFieldType.DATETIME;
}

export function isTextField<TModel>(
    field: FormField<TModel>
): field is Extract<FormField<TModel>, { type: FormFieldType.TEXT }> {
    return field.type === FormFieldType.TEXT;
}

export function isPasswordField<TModel>(
    field: FormField<TModel>
): field is Extract<
    FormField<TModel>,
    { type: FormFieldType.PASSWORD }
> {
    return field.type === FormFieldType.PASSWORD;
}

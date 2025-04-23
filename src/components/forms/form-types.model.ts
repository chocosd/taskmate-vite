import { AutocompleteOption } from './fields/AutocompleteInput';
import { FormOption } from './fields/SelectInput';
import { FormFieldType } from './form-field-types.enum';

export type FormStateCallback =
    | boolean
    | ((formState: Record<string, unknown>) => boolean);
export type BaseFieldConfig = {
    placeholder?: string;
    hint?: string;
};

export type ValidatorFn = (
    value: unknown,
    formState: Record<string, unknown>
) => string | null;

export type BaseField = {
    name: string;
    label: string;
    type: FormFieldType;
    disabled?: FormStateCallback;
    hide?: FormStateCallback;
    validators?: ValidatorFn[];
    config?: BaseFieldConfig;
};

export type NumberField = BaseField & {
    type: FormFieldType.NUMBER;
    config?: BaseFieldConfig & {
        min?: number;
        max?: number;
    };
};

export type CheckboxField = BaseField & {
    type: FormFieldType.CHECKBOX;
};

export type TextAreaField = BaseField & {
    type: FormFieldType.TEXTAREA;
    config?: BaseFieldConfig & {
        rows?: number;
    };
};

export type TextField = BaseField & {
    type: FormFieldType.TEXT;
    config?: BaseFieldConfig & {
        minLength: number;
        maxLength: number;
    };
};

export type AutoCompleteField = BaseField & {
    type: FormFieldType.AUTOCOMPLETE;
    config: BaseFieldConfig & {
        loadOptions: (
            search: string
        ) => Promise<AutocompleteOption[]>;
    };
    options?: FormOption[];
};

export type SelectField = BaseField & {
    type: FormFieldType.SELECT;
    options: { label: string; value: string | number }[];
    config?: BaseFieldConfig;
};

export type RadioField = BaseField & {
    type: FormFieldType.RADIO;
    options: { label: string; value: string }[];
    config?: BaseFieldConfig;
};

export type DateTimeField = BaseField & {
    type: FormFieldType.DATETIME;
    config?: BaseFieldConfig;
};

export type FormField =
    | NumberField
    | TextAreaField
    | SelectField
    | RadioField
    | DateTimeField
    | AutoCompleteField
    | TextField
    | CheckboxField;

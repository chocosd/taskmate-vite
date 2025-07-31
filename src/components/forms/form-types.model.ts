import { AutocompleteOption } from './fields/AutocompleteInput';
import { FormOption } from './fields/SelectInput';
import { FormFieldType } from './form-field-types.enum';

// Shared config for all fields
export type BaseFieldConfig = {
    placeholder?: string;
    hint?: string;
};

// Validator function specific to field type and model
export type ValidatorFn<TModel, TKey extends keyof TModel> = (
    value: TModel[TKey],
    formState: TModel
) => string | null;

// Conditional type to map value type to FormFieldType(s)
export type FieldTypeForValue<T> = T extends string
    ?
          | FormFieldType.TEXT
          | FormFieldType.PASSWORD
          | FormFieldType.TEXTAREA
          | FormFieldType.SELECT
          | FormFieldType.RADIO
          | FormFieldType.AUTOCOMPLETE
    : T extends number
      ?
            | FormFieldType.NUMBER
            | FormFieldType.SELECT
            | FormFieldType.RADIO
      : T extends boolean
        ? FormFieldType.CHECKBOX
        : T extends Date
          ? FormFieldType.DATETIME
          : never;

// ---- Field Types ----

// Base field
export type BaseField<TModel, TKey extends keyof TModel> = {
    name: TKey;
    label: string;
    type: FieldTypeForValue<TModel[TKey]>;
    disabled?: boolean | ((formState: TModel) => boolean);
    hide?: boolean | ((formState: TModel) => boolean);
    validators?: ValidatorFn<TModel, TKey>[];
    config?: BaseFieldConfig;
};

// Field types with specific props
export type TextField<TModel, TKey extends keyof TModel> = BaseField<
    TModel,
    TKey
> & {
    type: FormFieldType.TEXT | FormFieldType.PASSWORD;
    config?: BaseFieldConfig & {
        minLength?: number;
        maxLength?: number;
    };
};

export type TextAreaField<
    TModel,
    TKey extends keyof TModel,
> = BaseField<TModel, TKey> & {
    type: FormFieldType.TEXTAREA;
    config: BaseFieldConfig & {
        rows?: number;
    };
};

export type AutoCompleteField<
    TModel,
    TKey extends keyof TModel,
> = BaseField<TModel, TKey> & {
    type: FormFieldType.AUTOCOMPLETE;
    options: FormOption[];
    config: BaseFieldConfig & {
        loadOptions: (
            search: string
        ) => Promise<AutocompleteOption[]>;
    };
};

export type NumberField<
    TModel,
    TKey extends keyof TModel,
> = BaseField<TModel, TKey> & {
    type: FormFieldType.NUMBER;
    config?: BaseFieldConfig & {
        min?: number;
        max?: number;
    };
};

export type CheckboxField<
    TModel,
    TKey extends keyof TModel,
> = BaseField<TModel, TKey> & {
    type: FormFieldType.CHECKBOX;
};

export type DateTimeField<
    TModel,
    TKey extends keyof TModel,
> = BaseField<TModel, TKey> & {
    type: FormFieldType.DATETIME;
};

export type SelectField<
    TModel,
    TKey extends keyof TModel,
> = BaseField<TModel, TKey> & {
    type: FormFieldType.SELECT;
    options: FormOption[];
};

export type RadioField<TModel, TKey extends keyof TModel> = BaseField<
    TModel,
    TKey
> & {
    type: FormFieldType.RADIO;
    options: FormOption[];
};

// ---- FormField ----

// Collated FormField type based on TModel and TKey
export type FormField<TModel> = {
    [K in keyof TModel]: TModel[K] extends string
        ?
              | AutoCompleteField<TModel, K>
              | TextField<TModel, K>
              | TextAreaField<TModel, K>
              | SelectField<TModel, K>
              | RadioField<TModel, K>
              | DateTimeField<TModel, K>
        : TModel[K] extends number
          ?
                | NumberField<TModel, K>
                | SelectField<TModel, K>
                | RadioField<TModel, K>
          : TModel[K] extends boolean
            ? CheckboxField<TModel, K>
            : TModel[K] extends Date
              ? DateTimeField<TModel, K>
              : never;
}[keyof TModel];

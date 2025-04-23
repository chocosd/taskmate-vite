import { isDefined } from '@utils/is-defined';
import { ValidatorFn } from '../form-types.model';

export const Validators = {
    required:
        (message = 'This field is required.'): ValidatorFn =>
        (value) => {
            if (!isDefined(value)) {
                return message;
            }

            return null;
        },
    min:
        (min: number, message?: string): ValidatorFn =>
        (value) =>
            typeof value === 'number' && value < min
                ? (message ?? `Minimum value is ${min}`)
                : null,
    max:
        (max: number, message?: string): ValidatorFn =>
        (value) =>
            typeof value === 'number' && value > max
                ? (message ?? `Maximum value is ${max}`)
                : null,
};

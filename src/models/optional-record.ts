import { type ObjectKey } from './object-key';

export type OptionalRecord<TConfig extends ObjectKey = ObjectKey, TValue = unknown> = {
    [K in TConfig]+?: TValue;
};

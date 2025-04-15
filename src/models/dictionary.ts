import { type ObjectKey } from './object-key';

export type Dictionary<TValue = string, TKey extends ObjectKey = string> = {
    [K in TKey]: TValue;
};

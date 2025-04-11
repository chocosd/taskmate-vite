import { ObjectKey } from "./object-key.type";

export type Dictionary<TValue = string, TKey extends ObjectKey = string> = {
  [K in TKey]: TValue;
};

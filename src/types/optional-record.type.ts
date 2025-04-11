import { ObjectKey } from "./object-key.type";

export type OptionalRecord<
  TConfig extends ObjectKey = ObjectKey,
  TValue = unknown
> = {
  [K in TConfig]+?: TValue;
};

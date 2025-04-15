import { invokeIfFn } from "@util/functions/invoke-if-fn";
import { isBrowser } from "@util/functions/is-browser";
import { useEffect, useState } from "react";

type InitialValue<T> = T | (() => T);
type LocalStorageState<T = unknown> = readonly [
  T,
  React.Dispatch<React.SetStateAction<T>>
];

export function useLocalStorage<T = unknown>(
  key: string,
  initialValue: InitialValue<T>
): LocalStorageState<T> {
  const [value, setValue] = useState<T>(() => {
    try {
      if (!isBrowser()) {
        return invokeIfFn(initialValue);
      }

      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored);
      }

      return invokeIfFn(initialValue);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);

      return invokeIfFn(initialValue);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

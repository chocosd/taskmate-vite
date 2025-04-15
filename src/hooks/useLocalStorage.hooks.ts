import { isBrowser } from "@util/functions/is-browser";
import { useEffect, useState } from "react";

type LocalStorageState<T = unknown> = readonly [
  T,
  React.Dispatch<React.SetStateAction<T>>
];

export function useLocalStorage<T = unknown>(
  key: string,
  defaultValue: T
): LocalStorageState<T> {
  const [value, setValue] = useState<T>(() => {
    try {
      if (!isBrowser()) {
        return defaultValue;
      }

      const stored = localStorage.getItem(key);

      if (stored) {
        return JSON.parse(stored);
      }

      return defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
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

import { isBrowser } from "@util/functions/is-browser";
import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage.hooks";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "light");

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }
    requestAnimationFrame(() => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    });
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}

import { useTheme } from "@hooks/useTheme.hooks";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "./ui/Button";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [])

  if (!mounted) {
    return null;
  }

  const icon = theme === "dark"
    ? <Sun className="h-4 w-4" />
    : <Moon className="h-4 w-4" />;

  return (
    <Button action={toggleTheme}>
      {icon}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

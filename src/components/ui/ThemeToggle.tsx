"use client";

import * as React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "next-themes";
import Button from "./Button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />; // Spacer
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-10 h-10 p-0 rounded-full"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <FiSun className="h-5 w-5" />
      ) : (
        <FiMoon className="h-5 w-5" />
      )}
    </Button>
  );
}

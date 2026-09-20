"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeKey = "amber" | "moonlight" | "rosewood" | "verdant";

const ThemeContext = createContext<{
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>("amber");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeKey | null;
    if (stored) setThemeState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (t: ThemeKey) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

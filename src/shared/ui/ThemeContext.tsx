"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeKey = "azurlane" | "moonlight" | "rosewood" | "ishmael";

const THEME_KEYS: readonly ThemeKey[] = ["azurlane", "moonlight", "rosewood", "ishmael"];
const STORAGE_KEY = "theme";
const DEFAULT_THEME: ThemeKey = "azurlane";

const ThemeContext = createContext<{
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
} | null>(null);

function readStoredTheme(): ThemeKey {
  try {
    let stored = localStorage.getItem(STORAGE_KEY);
    // Blind Verdant and Limbus Amber were retired in favour of Limbus Ishmael
    if (stored === "verdant" || stored === "amber") stored = "ishmael";
    if (stored && (THEME_KEYS as readonly string[]).includes(stored)) return stored as ThemeKey;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // null = theme not resolved yet (nothing is rendered until it is)
  const [theme, setThemeState] = useState<ThemeKey | null>(null);

  // Resolve the theme from localStorage once on the client; fall back to azurlane.
  useEffect(() => {
    setThemeState(readStoredTheme());
  }, []);

  // Apply + persist only after the theme has been resolved.
  useEffect(() => {
    if (!theme) return;
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  if (!theme) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

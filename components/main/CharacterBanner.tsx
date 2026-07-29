"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { CHARACTERS } from "@/lib/data/characters";

export default function CharacterBanner() {
  const { theme } = useTheme();
  const { title, name } = CHARACTERS[theme];

  return (
    <h1 className="motto" data-text={title}>
      {title} - {name}
    </h1>
  );
}
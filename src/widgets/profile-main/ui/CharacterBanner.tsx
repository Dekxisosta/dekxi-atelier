"use client";

import { useTheme } from "@shared/ui/ThemeContext";
import { CHARACTERS } from "@entities/profile";

export default function CharacterBanner() {
  const { theme } = useTheme();
  const { title, name } = CHARACTERS[theme];

  return (
    <h1 className="motto" data-text={title}>
      {title} - {name}
    </h1>
  );
}

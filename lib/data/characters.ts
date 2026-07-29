export const CHARACTERS = {
  amber: { title: "LOVE AND HATE", name: "DON QUIXOTE" },
  verdant: { title: "BLIND OBSESSION", name: "ISHMAEL" },
  moonlight: { title: "???", name: "???" },
  rosewood: { title: "???", name: "???" },
} as const;

export type ThemeKey = keyof typeof CHARACTERS;
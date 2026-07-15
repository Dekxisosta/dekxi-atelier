export const TECH_STACK = [
  ["html5", "HTML5"],
  ["css3", "CSS3"],
  ["javascript", "JavaScript"],
  ["typescript", "TypeScript"],
  ["python", "Python"],
  ["lua", "Lua"],
  ["java", "Java"],
  ["csharp", "C#"],
  ["react", "React"],
  ["nextjs", "Next.js"],
  ["astro", "Astro"],
  ["vite", "Vite"],
  ["tailwindcss", "Tailwind"],
  ["bootstrap", "Bootstrap"],
  ["sass", "SCSS"],
  ["nodejs", "Node.js"],
  ["spring", "Spring Boot"],
  ["laravel", "Laravel"],
  ["postgresql", "PostgreSQL"],
  ["mysql", "MySQL"],
  ["sqlite", "SQLite"],
  ["mongodb", "MongoDB"],
  ["supabase", "Supabase"],
  ["git", "Git"],
  ["github", "GitHub"],
  ["vercel", "Vercel"],
  ["figma", "Figma"],
  ["canva", "Canva"],
  ["notion", "Notion"]
] as const;

export const DEVICON = (name: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;

export const INVERTED = new Set(["nextjs", "astro", "vercel", "notion", "github"]);
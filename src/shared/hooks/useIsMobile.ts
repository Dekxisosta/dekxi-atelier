import { useMediaQuery } from "./useMediaQuery";

/** Phone width: a single stacked column (matches the 728px breakpoint in layout.css). */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 728px)");
}

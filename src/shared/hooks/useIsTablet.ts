import { useMediaQuery } from "./useMediaQuery";

/** Tablet and below: the layout stacks vertically (matches the 1048px breakpoint in layout.css). */
export function useIsTablet(): boolean {
  return useMediaQuery("(max-width: 1048px)");
}

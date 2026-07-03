import { useQuery } from "@tanstack/react-query";
import { getObligationLibrary } from "./api";
import type { ObligationTab } from "./types";

export function useObligationLibrary(tab: ObligationTab) {
  return useQuery({
    queryKey: ["obligations", "library", tab],
    queryFn: () => getObligationLibrary(tab),
  });
}

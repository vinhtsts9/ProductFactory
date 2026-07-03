import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "./api";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: getDashboardOverview,
  });
}

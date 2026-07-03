import { apiGet } from "../../shared/api/httpClient";
import { dashboardOverview } from "./mockData";
import type { DashboardOverview } from "./types";

export async function getDashboardOverview(): Promise<DashboardOverview> {
  // TODO(API): replace mock with GET /api/dashboard/overview when backend exposes dashboard aggregation.
  // Current MVP spec prioritizes catalog/ontology/config/simulation APIs, so dashboard can stay FE-derived.
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    return apiGet<DashboardOverview>("/dashboard/overview");
  }

  return dashboardOverview;
}

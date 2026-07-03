import { http, HttpResponse } from "msw";
import { dashboardKpis } from "../features/dashboard/mockData";

export const handlers = [
  http.get("/api/dashboard/kpis", () => {
    return HttpResponse.json({ items: dashboardKpis, total: dashboardKpis.length });
  }),
];

import { apiGet } from "../../shared/api/httpClient";
import { obligationLibraryList } from "./mockData";
import type { ObligationLibraryList, ObligationTab } from "./types";

export async function getObligationLibrary(tab: ObligationTab): Promise<ObligationLibraryList> {
  // TODO(API P0): compose from GET /api/obligation-types, /api/obligation-elements, /api/element-types.
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    return apiGet<ObligationLibraryList>(`/obligations/library?tab=${tab}`);
  }

  return obligationLibraryList(tab);
}

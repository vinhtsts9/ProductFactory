import { CATALOG_RAW, RELEASE_STEPS_RAW } from "./mockData";

export async function getCatalogItems() {
  // TODO(API P1): GET /api/catalog
  return CATALOG_RAW;
}

export async function getReleaseSteps() {
  // TODO(API P3): GET /api/releases/:id/steps or equivalent
  return RELEASE_STEPS_RAW;
}

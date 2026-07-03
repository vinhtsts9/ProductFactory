import type { ListResponse } from "../../shared/api/httpClient";
import { apiGet } from "../../shared/api/httpClient";

export async function getBusinessIntents(): Promise<ListResponse<unknown>> {
  // TODO(API P1): GET /api/business-intents
  return apiGet<ListResponse<unknown>>("/business-intents");
}

export async function getProductIntents(): Promise<ListResponse<unknown>> {
  // TODO(API P1): GET /api/product-intents
  return apiGet<ListResponse<unknown>>("/product-intents");
}

export async function getPatterns(): Promise<ListResponse<unknown>> {
  // TODO(API P1): GET /api/patterns
  return apiGet<ListResponse<unknown>>("/patterns");
}

export async function getTemplates(): Promise<ListResponse<unknown>> {
  // TODO(API P1): GET /api/templates
  return apiGet<ListResponse<unknown>>("/templates");
}

export async function getConfigs(): Promise<ListResponse<unknown>> {
  // TODO(API P2): GET /api/configs
  return apiGet<ListResponse<unknown>>("/configs");
}

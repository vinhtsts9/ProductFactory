import type { ListResponse } from "../../shared/api/httpClient";
import { apiGet, apiPost } from "../../shared/api/httpClient";
import {
  mockBusinessIntents,
  mockPatterns,
  mockProductIntents,
  mockTemplates,
} from "./mockData";
import type { BusinessIntent, Pattern, ProductIntent, Template } from "./types";

export async function getBusinessIntents(): Promise<ListResponse<BusinessIntent>> {
  // TODO(API P1): GET /api/business-intents
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    return apiGet<ListResponse<BusinessIntent>>("/business-intents");
  }
  return { items: mockBusinessIntents, total: mockBusinessIntents.length };
}

export async function createBusinessIntent(data: Partial<BusinessIntent>): Promise<BusinessIntent> {
  // TODO(API P1): POST /api/business-intents
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    return apiPost<BusinessIntent>("/business-intents", data);
  }
  const created: BusinessIntent = {
    id: `BI-${String(mockBusinessIntents.length + 1).padStart(3, "0")}`,
    name: data.name ?? "",
    owner: data.owner ?? "Product",
    period: data.period ?? new Date().getFullYear().toString(),
    objective: data.objective ?? "",
    kpis: data.kpis ?? [],
    archetype: data.archetype ?? "FOA_TERM_LOAN",
    segment: data.segment ?? { income: "0", ageRange: [20, 55], groups: [], regions: [] },
    status: "draft",
  };
  mockBusinessIntents.push(created);
  return created;
}

export async function getProductIntents(): Promise<ListResponse<ProductIntent>> {
  // TODO(API P1): GET /api/product-intents
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    return apiGet<ListResponse<ProductIntent>>("/product-intents");
  }
  return { items: mockProductIntents, total: mockProductIntents.length };
}

export async function createProductIntent(data: Partial<ProductIntent>): Promise<ProductIntent> {
  // TODO(API P1): POST /api/product-intents
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    return apiPost<ProductIntent>("/product-intents", data);
  }
  const created: ProductIntent = {
    id: `PI-${String(mockProductIntents.length + 1).padStart(3, "0")}`,
    businessIntentId: data.businessIntentId ?? "",
    name: data.name ?? "",
    archetype: data.archetype ?? "FOA_TERM_LOAN",
    elementCodes: data.elementCodes ?? [],
    status: "draft",
  };
  mockProductIntents.push(created);
  return created;
}

export async function getPatterns(): Promise<ListResponse<Pattern>> {
  // TODO(API P1): GET /api/patterns
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    return apiGet<ListResponse<Pattern>>("/patterns");
  }
  return { items: mockPatterns, total: mockPatterns.length };
}

export async function getTemplates(): Promise<ListResponse<Template>> {
  // TODO(API P1): GET /api/templates
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    return apiGet<ListResponse<Template>>("/templates");
  }
  return { items: mockTemplates, total: mockTemplates.length };
}

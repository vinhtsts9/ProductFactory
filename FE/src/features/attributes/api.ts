import { apiGet } from "../../shared/api/httpClient";
import { attributeDetails, attributeList } from "./mockData";
import type { AttributeDetail, AttributeList } from "./types";

export async function getAttributeList(): Promise<AttributeList> {
  // TODO(API P0): replace mock with GET /api/attributes plus related usage counts.
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    return apiGet<AttributeList>("/attributes");
  }

  return attributeList;
}

export async function getAttributeDetail(code: string): Promise<AttributeDetail> {
  // TODO(API P0): replace mock with GET /api/attributes/:code.
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    return apiGet<AttributeDetail>(`/attributes/${code}`);
  }

  return attributeDetails[code] ?? attributeDetails.base_rate;
}

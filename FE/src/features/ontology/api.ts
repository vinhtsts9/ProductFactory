import type { ListResponse } from "../../shared/api/httpClient";
import { apiGet } from "../../shared/api/httpClient";
import { ontologyOverview } from "./mockData";
import type { OntologyOverview } from "./types";

export type ElementType = {
  code: string;
  name: string;
  status?: string;
};

export async function getElementTypes(): Promise<ListResponse<ElementType>> {
  // TODO(API P0): GET /api/element-types
  // Keep response shape { items, total } as defined in api_spec.md.
  if (import.meta.env.VITE_USE_REAL_API !== "true") {
    return {
      items: ontologyOverview.vocab.map((item) => ({ code: item.code, name: item.name })),
      total: ontologyOverview.vocab.length,
    };
  }

  return apiGet<ListResponse<ElementType>>("/element-types");
}

export async function getElementType(code: string): Promise<ElementType> {
  // TODO(API P0): GET /api/element-types/:code
  return apiGet<ElementType>(`/element-types/${code}`);
}

export async function getObligationTypes(): Promise<ListResponse<unknown>> {
  // TODO(API P0): GET /api/obligation-types
  return apiGet<ListResponse<unknown>>("/obligation-types");
}

export async function getBlocks(): Promise<ListResponse<unknown>> {
  // TODO(API P0): GET /api/blocks
  return apiGet<ListResponse<unknown>>("/blocks");
}

export async function getAttributes(): Promise<ListResponse<unknown>> {
  // TODO(API P0): GET /api/attributes
  return apiGet<ListResponse<unknown>>("/attributes");
}

export async function getOntologyOverview(): Promise<OntologyOverview> {
  // TODO(API P0): replace mock with a composed endpoint such as GET /api/ontology/overview,
  // or compose from /api/element-types, /api/obligation-types, /api/blocks, and /api/attributes.
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    return apiGet<OntologyOverview>("/ontology/overview");
  }

  return ontologyOverview;
}

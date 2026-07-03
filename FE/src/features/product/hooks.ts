import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBusinessIntent,
  createProductIntent,
  getBusinessIntents,
  getPatterns,
  getProductIntents,
  getTemplates,
} from "./api";
import type { BusinessIntent, ProductIntent } from "./types";

export function useBusinessIntents() {
  return useQuery({
    queryKey: ["product", "business-intents"],
    queryFn: getBusinessIntents,
  });
}

export function useCreateBusinessIntent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BusinessIntent>) => createBusinessIntent(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product", "business-intents"] }),
  });
}

export function useProductIntents() {
  return useQuery({
    queryKey: ["product", "product-intents"],
    queryFn: getProductIntents,
  });
}

export function useCreateProductIntent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ProductIntent>) => createProductIntent(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product", "product-intents"] }),
  });
}

export function usePatterns() {
  return useQuery({
    queryKey: ["product", "patterns"],
    queryFn: getPatterns,
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: ["product", "templates"],
    queryFn: getTemplates,
  });
}

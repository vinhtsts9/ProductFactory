import { useQuery } from "@tanstack/react-query";
import { getAttributeDetail, getAttributeList } from "./api";

export function useAttributeList() {
  return useQuery({
    queryKey: ["attributes", "list"],
    queryFn: getAttributeList,
  });
}

export function useAttributeDetail(code: string) {
  return useQuery({
    queryKey: ["attributes", "detail", code],
    queryFn: () => getAttributeDetail(code),
  });
}

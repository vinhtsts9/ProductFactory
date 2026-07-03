import { useQuery } from "@tanstack/react-query";
import { getBlockDetail, getBlockList } from "./api";

export function useBlockList() {
  return useQuery({
    queryKey: ["blocks", "list"],
    queryFn: getBlockList,
  });
}

export function useBlockDetail(code: string) {
  return useQuery({
    queryKey: ["blocks", "detail", code],
    queryFn: () => getBlockDetail(code),
  });
}

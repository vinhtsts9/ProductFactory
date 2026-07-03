import { useQuery } from "@tanstack/react-query";
import { getOntologyOverview } from "./api";

export function useOntologyOverview() {
  return useQuery({
    queryKey: ["ontology", "overview"],
    queryFn: getOntologyOverview,
  });
}

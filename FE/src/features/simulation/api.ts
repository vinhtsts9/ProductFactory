import { apiGet } from "../../shared/api/httpClient";

export async function getSimulationCatalog(): Promise<unknown> {
  // TODO(API P3): GET /api/simulations/catalog or equivalent once backend names final endpoint.
  return apiGet<unknown>("/simulations/catalog");
}

export async function runSimulation(): Promise<unknown> {
  // TODO(API P3): POST /api/simulations/run with variant, amount, months, rate, fees, penalties.
  throw new Error("TODO(API): wire POST /api/simulations/run when backend is available.");
}

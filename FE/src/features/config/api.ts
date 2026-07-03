import { INITIAL_CONFIGS } from "./mockData";
import type { Config } from "./types";

export async function getConfigs(): Promise<Config[]> {
  // TODO(API P2): GET /api/configs
  return INITIAL_CONFIGS;
}

export async function getConfig(id: string): Promise<Config | undefined> {
  // TODO(API P2): GET /api/configs/:id
  return INITIAL_CONFIGS.find((c) => c.id === id);
}

export async function saveConfig(config: Config): Promise<Config> {
  // TODO(API P2): PUT /api/configs/:id
  const idx = INITIAL_CONFIGS.findIndex((c) => c.id === config.id);
  if (idx !== -1) {
    INITIAL_CONFIGS[idx] = config;
  }
  return config;
}

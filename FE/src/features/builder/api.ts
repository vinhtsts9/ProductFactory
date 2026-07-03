import { BLOCKS, OTS } from "./mockData";
import type { Block, ObligationType } from "./types";

export async function getBuilderBlocks(): Promise<Block[]> {
  // TODO(API P0): GET /api/blocks or similar endpoint
  return BLOCKS;
}

export async function getBuilderOTS(): Promise<ObligationType[]> {
  // TODO(API P0): GET /api/obligation-types or similar endpoint
  return OTS;
}

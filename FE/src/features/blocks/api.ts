import { apiGet } from "../../shared/api/httpClient";
import { blockDetails, blockList } from "./mockData";
import type { BlockDetail, BlockList } from "./types";

export async function getBlockList(): Promise<BlockList> {
  // TODO(API P0): replace mock with GET /api/blocks.
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    return apiGet<BlockList>("/blocks");
  }

  return blockList;
}

export async function getBlockDetail(code: string): Promise<BlockDetail> {
  // TODO(API P0): replace mock with GET /api/blocks/:code.
  if (import.meta.env.VITE_USE_REAL_API === "true") {
    return apiGet<BlockDetail>(`/blocks/${code}`);
  }

  return blockDetails[code] ?? blockDetails.BLOCK_INTEREST;
}

export type ProductStatus = "draft" | "review" | "approved" | "published" | "retired";

export type BusinessIntentKpi = {
  metric: string;
  target: string;
  unit: string;
};

export type BusinessIntentSegment = {
  income: string;
  ageRange: [number, number];
  groups: string[];
  regions: string[];
};

export type BusinessIntent = {
  id: string;
  name: string;
  owner: string;
  period: string;
  objective: string;
  kpis: BusinessIntentKpi[];
  archetype: string;
  segment: BusinessIntentSegment;
  status: ProductStatus;
};

export type ProductIntent = {
  id: string;
  businessIntentId: string;
  name: string;
  archetype: string;
  elementCodes: string[];
  status: ProductStatus;
};

export type PatternBlock = {
  blockId: string;
  order: number;
  required: boolean;
};

export type Pattern = {
  id: string;
  code: string;
  name: string;
  obligationTypeCodes: string[];
  blocks: PatternBlock[];
  status: ProductStatus;
};

export type TemplateFrame = {
  slotCode: string;
  min: string;
  max: string;
  defaultValue: string;
};

export type Template = {
  id: string;
  name: string;
  patternId: string;
  audience: string;
  lockedBlockIds: string[];
  frames: TemplateFrame[];
  status: ProductStatus;
};

import type { ListColumn, ListRow, ListTab } from "../../shared/ui/FoundationListPage";

export type AttributeList = {
  tabs: ListTab[];
  searchPlaceholder: string;
  filters: string[];
  actionLabel: string;
  footerText: string;
  columns: ListColumn[];
  rows: ListRow[];
};

export type AttributeConstraint = {
  type: string;
  rule: string;
  kind: "regulatory" | "range" | "required" | "dependency";
  note?: string;
};

export type AttributeUsageBlock = {
  blockCode: string;
  blockName: string;
  slotName: string;
  required: boolean;
};

export type AttributeScopeValue = {
  scope: string;
  value: string;
  priority: string;
};

export type AttributeDetail = {
  code: string;
  name: string;
  dataType: string;
  group: string;
  domain: string;
  required: boolean;
  description: string;
  constraints: AttributeConstraint[];
  usageBlocks: AttributeUsageBlock[];
  scopeValues: AttributeScopeValue[];
};

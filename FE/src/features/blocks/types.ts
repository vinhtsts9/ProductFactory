import type { ListColumn, ListRow } from "../../shared/ui/FoundationListPage";

export type BlockList = {
  searchPlaceholder: string;
  filters: string[];
  actionLabel: string;
  footerText: string;
  columns: ListColumn[];
  rows: ListRow[];
};

export type AnswerSlot = {
  code: string;
  name: string;
  attributeCode: string;
  dataType: string;
  required: boolean;
  defaultValue?: string;
};

export type BlockDetail = {
  code: string;
  name: string;
  group: string;
  governedBy: string;
  status: string;
  description: string;
  slots: AnswerSlot[];
  usedByPatterns: {
    code: string;
    name: string;
    role: string;
  }[];
};

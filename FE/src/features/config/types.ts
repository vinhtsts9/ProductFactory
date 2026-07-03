export interface ConfigFragment {
  id: string;
  scopeType: "default" | "people" | "place" | "time";
  scopeVal: string;
  value: string;
  note?: string;
  warn?: boolean;
  added?: boolean;
}

export interface ConfigSlot {
  code: string;
  name: string;
  block: string;
  attr: string;
  dataType: string;
  required: boolean;
  constraint: string;
  fragments: ConfigFragment[];
}

export interface Config {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  status: "draft" | "review" | "approved" | "published";
  reviewer: string;
  slots: ConfigSlot[];
}

export interface ResolutionResult {
  value: string;
  scopeLabel: string;
  scopeColor: string;
  scopeBg: string;
  reason: string;
  priority: number;
}

export interface ExplainRow {
  label: string;
  value: string;
  priority: number;
  matched: boolean;
  isWin: boolean;
  rowBg: string;
  markColor: string;
  mark: string;
}

export interface AnswerSlot {
  name: string;
  code: string;
  type: string;
  def: string;
  rule: string;
  req: boolean;
}

export interface Block {
  id: string;
  name: string;
  code: string;
  group: string;
  gov: string;
  slots: AnswerSlot[];
}

export interface ObligationType {
  id: string;
  name: string;
  code: string;
  archetype: string;
  role: string;
}

export interface CoverageRow {
  key: string;
  label: string;
  blockId: string;
  status: "covered" | "missing" | "covered-opt" | "suggest" | "na";
  agg: "req" | "pos" | "no";
  inCanvas: boolean;
  chipLabel: string;
  chipBg: string;
  chipFg: string;
  dot: string;
  mark: string;
  showAdd: boolean;
}

export interface CoverageVerdict {
  label: string;
  bg: string;
  fg: string;
  ok: boolean;
}

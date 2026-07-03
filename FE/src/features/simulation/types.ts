export interface SimulationInput {
  variant: string;
  amount: number;
  months: number;
  rate: number;
  assetValue: number;
  segment: "standard" | "loyalty" | "vip";
  startDate: string;
  appraisalFee: number;
  periodicFeePct: number;
  penaltyOn: boolean;
  penaltyPeriod: number;
  penaltyDays: number;
  prepayOn: boolean;
  prepayPeriod: number;
  prepayAmount: number;
  graceOn: boolean;
  graceMonths: number;
  earlyOn: boolean;
  earlyPeriod: number;
  earlyPenaltyPct: number;
}

export interface AmortizationRow {
  period: string;
  periodStart: string;
  periodEnd: string;
  opening: string;
  principal: string;
  interest: string;
  fee: string;
  penalty: string;
  payment: string;
  closing: string;
  rowBg: string;
  hasTag: boolean;
  tagText: string;
  tagColor: string;
}

export interface SimulationChartBar {
  label: number;
  showLabel: boolean;
  priH: string;
  intH: string;
  feeH: string;
  hasExtra: boolean;
}

export interface ConstraintCheck {
  pass: boolean;
  title: string;
  detail: string;
  value: string;
  mark: string;
  bg: string;
  bd: string;
  iconBg: string;
  valColor: string;
}

import type { SimulationInput, AmortizationRow, SimulationChartBar, ConstraintCheck } from "./types";

export interface SimulationResult {
  vinfo: { name: string; template: string };
  effRate: number;
  pmt: number;
  totalInt: number;
  totalPay: number;
  ltv: number;
  schedule: AmortizationRow[];
  chart: SimulationChartBar[];
  cumPoints: string;
  capitalLineY: string;
  breakevenPeriod: number | null;
  breakevenX: string | null;
  principal: number;
  totalFee: number;
  totalPenalty: number;
  totalPrepay: number;
  totalEarlyPen: number;
  apprFee: number;
  periodsUsed: number;
  grossInflow: number;
  earlySettledAt: number | null;
  grace: number;
  checks: ConstraintCheck[];
  allPass: boolean;
}

// Utility formatters
export function fmtVnd(val: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(val));
}

export function fmtDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function calculateSimulation(s: SimulationInput): SimulationResult {
  const variants: Record<string, { name: string; template: string }> = {
    "VAR-101": { name: "Vay nhanh Xe máy 18 tháng", template: "TPL Vay cầm cố trả góp" },
  };
  const vinfo = variants[s.variant] || variants["VAR-101"];

  const segMap = {
    standard: { adj: 0 },
    loyalty: { adj: -0.5 },
    vip: { adj: -0.3 },
  };
  const effRate = Math.max(0.3, s.rate + (segMap[s.segment]?.adj || 0));
  const r = effRate / 100;
  const P = s.amount;
  const n = s.months;

  const annuity = (bal: number, rate: number, k: number) => {
    return rate > 0 ? (bal * rate) / (1 - Math.pow(1 + rate, -k)) : bal / k;
  };

  const penRate = r * 1.5;
  const apprFee = s.appraisalFee || 0;
  const feePct = (s.periodicFeePct || 0) / 100;

  let pmt = annuity(P, r, n);
  let bal = P;
  let totalInt = 0;
  let totalFee = apprFee;
  let totalPenalty = 0;
  let totalPrepay = 0;
  let totalEarlyPen = 0;
  let cum = apprFee;

  const schedule: AmortizationRow[] = [];
  const chart: SimulationChartBar[] = [];
  const periodTotals: number[] = [];
  let breakevenPeriod: number | null = null;
  let earlySettledAt: number | null = null;

  const grace = s.graceOn ? Math.max(0, Math.min(Math.floor(s.graceMonths), n - 1)) : 0;
  const baseDate = s.startDate ? new Date(s.startDate + "T00:00:00") : new Date();

  if (grace > 0) {
    pmt = annuity(P, r, n - grace);
  }

  for (let i = 1; i <= n && bal > 1; i++) {
    const interest = bal * r;
    const fee = bal * feePct;
    const inGrace = i <= grace;

    let principal = inGrace ? 0 : Math.min(pmt - interest, bal);
    const isPenalty = s.penaltyOn && i === s.penaltyPeriod;
    const penalty = isPenalty ? pmt * (s.penaltyDays / 30) * penRate : 0;

    const isPrepay = s.prepayOn && !inGrace && i === s.prepayPeriod;
    const prepay = isPrepay ? Math.min(s.prepayAmount, Math.max(0, bal - principal)) : 0;

    const isEarly = s.earlyOn && i === s.earlyPeriod && bal - principal - prepay > 1;
    let early = 0;
    let earlyPen = 0;

    if (isEarly) {
      early = Math.max(0, bal - principal - prepay);
      earlyPen = early * (s.earlyPenaltyPct / 100);
    }

    const closing = isEarly ? 0 : Math.max(0, bal - principal - prepay);
    const periodTotal = principal + interest + fee + penalty + prepay + early + earlyPen;

    totalInt += interest;
    totalFee += fee;
    totalPenalty += penalty;
    totalPrepay += prepay;
    totalEarlyPen += earlyPen;
    cum += periodTotal;
    periodTotals.push(periodTotal);

    let tag: { t: string; c: string } | null = null;
    if (isEarly) {
      tag = { t: `Tất toán sớm · phạt ${fmtVnd(earlyPen)}đ`, c: "#B23B3B" };
    } else if (inGrace) {
      tag = { t: "Ân hạn · chỉ trả lãi", c: "#9A6B00" };
    } else if (isPenalty && isPrepay) {
      tag = { t: "Phạt + Trả bớt gốc", c: "#B23B3B" };
    } else if (isPenalty) {
      tag = { t: `Trễ ${s.penaltyDays} ngày · phạt`, c: "#B23B3B" };
    } else if (isPrepay) {
      tag = { t: `Trả bớt gốc ${fmtVnd(prepay)}đ`, c: "#0B7349" };
    }

    schedule.push({
      period: `Kỳ ${i}`,
      periodStart: fmtDate(addMonths(baseDate, i - 1)),
      periodEnd: fmtDate(addMonths(baseDate, i)),
      opening: fmtVnd(bal),
      principal: principal > 0 ? fmtVnd(principal) : early > 0 ? `${fmtVnd(early)} (TT)` : "—",
      interest: fmtVnd(interest),
      fee: fmtVnd(fee),
      penalty: penalty + earlyPen > 0 ? fmtVnd(penalty + earlyPen) : "—",
      payment: fmtVnd(periodTotal),
      closing: fmtVnd(closing),
      rowBg: tag ? (isEarly || isPenalty ? "#FEF6F6" : inGrace ? "#FFFBF0" : "#F4FBF7") : "#fff",
      hasTag: !!tag,
      tagText: tag ? tag.t : "",
      tagColor: tag ? tag.c : "#fff",
    });

    const maxBar = pmt * 1.6;
    chart.push({
      label: i,
      showLabel: n <= 18 ? true : i === 1 || i === n || i % 3 === 0,
      priH: `${(((principal + early) / maxBar) * 86).toFixed(1)}%`,
      intH: `${((interest / maxBar) * 86).toFixed(1)}%`,
      feeH: `${(((fee + penalty + earlyPen) / maxBar) * 86).toFixed(1)}%`,
      hasExtra: fee + penalty + earlyPen > 0,
    });

    bal = closing;

    if (isEarly) {
      earlySettledAt = i;
      break;
    }

    if (i === grace && grace > 0) {
      pmt = annuity(bal, r, n - grace);
    } else if (prepay > 0 && bal > 1) {
      pmt = annuity(bal, r, n - i);
    }
  }

  const grossInflow = cum;
  const periodsUsed = schedule.length;

  let run = apprFee;
  const pts: string[] = [];
  for (let i = 0; i < periodsUsed; i++) {
    run += periodTotals[i];
    const x = (((i + 0.5) / periodsUsed) * 100).toFixed(2);
    const y = (100 - (run / grossInflow) * 100).toFixed(2);
    pts.push(`${x},${y}`);
    if (breakevenPeriod === null && run - apprFee >= P) {
      breakevenPeriod = i + 1;
    }
  }

  const cumPoints = pts.join(" ");
  const totalPay = grossInflow;
  const capitalLineY = (100 - (P / totalPay) * 100).toFixed(2);
  const breakevenX = breakevenPeriod !== null ? (((breakevenPeriod - 0.5) / periodsUsed) * 100).toFixed(2) : null;
  const ltv = s.assetValue > 0 ? (s.amount / s.assetValue) * 100 : 0;

  // Rules checks
  const CAP = 1.65;
  const MIN = 3000000;
  const MAX = 50000000;
  const MAXTERM = 18;
  const LTVMAX = 80;

  const mk = (ok: boolean, title: string, detail: string, value: string): ConstraintCheck => ({
    pass: ok,
    title,
    detail,
    value,
    mark: ok ? "✓" : "!",
    bg: ok ? "#F4FBF7" : "#FEF6F6",
    bd: ok ? "#D5EEE0" : "#F2D4D4",
    iconBg: ok ? "#0E8C5A" : "#D9893B",
    valColor: ok ? "#0B7349" : "#B26B1B",
  });

  const checks = [
    mk(s.amount >= MIN && s.amount <= MAX, "Số tiền trong hạn mức cấp", "Limit cho phép 3.000.000đ – 50.000.000đ", `${fmtVnd(s.amount)}đ`),
    mk(ltv <= LTVMAX, "Tỷ lệ cho vay LTV ≤ 80%", "LTV = số tiền vay / giá trị tài sản", `${ltv.toFixed(1)}%`),
    mk(effRate <= CAP, "Lãi suất ≤ trần quy định", "Trần 1,65%/tháng theo quy định nội bộ", `${effRate.toFixed(2)}%/th`),
    mk(n <= MAXTERM, "Kỳ hạn hợp lệ (≤ 18 tháng)", "Answer Slot installment_count: 1 – 18", `${n} tháng`),
  ];
  const allPass = checks.every((c) => c.pass);

  return {
    vinfo,
    effRate,
    pmt,
    totalInt,
    totalPay,
    ltv,
    schedule,
    chart,
    cumPoints,
    capitalLineY,
    breakevenPeriod,
    breakevenX,
    principal: P,
    totalFee,
    totalPenalty,
    totalPrepay,
    totalEarlyPen,
    apprFee,
    periodsUsed,
    grossInflow,
    earlySettledAt,
    grace,
    checks,
    allPass,
  };
}

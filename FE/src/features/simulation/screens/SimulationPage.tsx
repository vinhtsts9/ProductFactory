import { useState, useMemo } from "react";
import { Bolt, Play, Target, Send, ArrowLeft, X } from "lucide-react";
import type { SimulationInput } from "../types";
import { calculateSimulation, fmtVnd } from "../simulationCalc";
import type { AppView } from "../../../app/navigation";

interface SimulationPageProps {
  onNavigate: (view: AppView) => void;
}

export function SimulationPage({ onNavigate }: SimulationPageProps) {
  // Pinned scenarios state (max 3)
  const [pinned, setPinned] = useState<SimulationInput[]>([]);

  // Simulation form inputs state
  const [variant, setVariant] = useState("VAR-101");
  const [amount, setAmount] = useState(30000000);
  const [months, setMonths] = useState(18);
  const [startDate, setStartDate] = useState("2026-07-15");
  const [rate, setRate] = useState(1.5);
  const [assetValue, setAssetValue] = useState(45000000);
  const [segment, setSegment] = useState<"standard" | "loyalty" | "vip">("standard");

  const [appraisalFee, setAppraisalFee] = useState(500000);
  const [periodicFeePct, setPeriodicFeePct] = useState(0.15);

  const [penaltyOn, setPenaltyOn] = useState(true);
  const [penaltyPeriod, setPenaltyPeriod] = useState(6);
  const [penaltyDays, setPenaltyDays] = useState(10);

  const [prepayOn, setPrepayOn] = useState(true);
  const [prepayPeriod, setPrepayPeriod] = useState(9);
  const [prepayAmount, setPrepayAmount] = useState(8000000);

  const [graceOn, setGraceOn] = useState(false);
  const [graceMonths, setGraceMonths] = useState(2);

  const [earlyOn, setEarlyOn] = useState(false);
  const [earlyPeriod, setEarlyPeriod] = useState(12);
  const [earlyPenaltyPct, setEarlyPenaltyPct] = useState(2.0);

  // Group inputs together for calculation
  const currentInputs = useMemo((): SimulationInput => {
    return {
      variant,
      amount,
      months,
      rate,
      assetValue,
      segment,
      startDate,
      appraisalFee,
      periodicFeePct,
      penaltyOn,
      penaltyPeriod,
      penaltyDays,
      prepayOn,
      prepayPeriod,
      prepayAmount,
      graceOn,
      graceMonths,
      earlyOn,
      earlyPeriod,
      earlyPenaltyPct,
    };
  }, [
    variant,
    amount,
    months,
    rate,
    assetValue,
    segment,
    startDate,
    appraisalFee,
    periodicFeePct,
    penaltyOn,
    penaltyPeriod,
    penaltyDays,
    prepayOn,
    prepayPeriod,
    prepayAmount,
    graceOn,
    graceMonths,
    earlyOn,
    earlyPeriod,
    earlyPenaltyPct,
  ]);

  // Compute simulation data
  const simRes = useMemo(() => {
    return calculateSimulation(currentInputs);
  }, [currentInputs]);

  // Pinned calculations
  const pinnedRes = useMemo(() => {
    return pinned.map((p) => calculateSimulation(p));
  }, [pinned]);

  // SCENARIO COLORS
  const SCEN_LABELS = ["A", "B", "C", "D"];
  const SCEN_COLORS = ["#0E8C5A", "#E8920C", "#2F73C4", "#6A45B0"];

  const handlePin = () => {
    if (pinned.length < 3) {
      setPinned((prev) => [...prev, { ...currentInputs }]);
    }
  };

  const handleClearPin = (idx: number) => {
    setPinned((prev) => prev.filter((_, i) => i !== idx));
  };

  // Compare Table Columns
  const cmpCols = useMemo(() => {
    const list = [currentInputs, ...pinned];
    return list.map((s, i) => ({
      label: `P/A ${SCEN_LABELS[i]}`,
      color: SCEN_COLORS[i],
      sub: `${fmtVnd(s.amount)}đ · ${s.months}th`,
    }));
  }, [currentInputs, pinned]);

  // Compare Table Rows
  const cmpRows = useMemo(() => {
    const list = [simRes, ...pinnedRes];
    const fM = (x: number) => fmtVnd(x) + "đ";

    const makeRow = (metric: string, vals: string[], nums: number[]) => {
      const best = Math.min(...nums);
      const worst = Math.max(...nums);
      return {
        metric,
        cells: vals.map((v, i) => {
          const isBest = nums.length > 1 && nums[i] === best && best !== worst;
          return {
            text: v,
            color: isBest ? "#0B7349" : "#243A30",
            bg: isBest ? "#ECF6F1" : "transparent",
            weight: isBest ? 700 : 600,
          };
        }),
      };
    };

    return [
      makeRow("Kỳ trả hàng tháng", list.map((x) => fM(x.pmt)), list.map((x) => x.pmt)),
      makeRow("Tổng lãi", list.map((x) => fM(x.totalInt)), list.map((x) => x.totalInt)),
      makeRow("Tổng phải trả", list.map((x) => fM(x.totalPay)), list.map((x) => x.totalPay)),
      makeRow("Lãi suất hiệu dụng/tháng", list.map((x) => x.effRate.toFixed(2).replace(".", ",") + "%"), list.map((x) => x.effRate)),
      makeRow("Điểm hòa vốn (kỳ)", list.map((x) => (x.breakevenPeriod !== null ? `Kỳ ${x.breakevenPeriod}` : "—")), list.map((x) => x.breakevenPeriod || 999)),
      makeRow("Tỷ lệ LTV", list.map((x) => x.ltv.toFixed(1).replace(".", ",") + "%"), list.map((x) => x.ltv)),
    ];
  }, [simRes, pinnedRes]);

  // Renders the CSV download action
  const handleExportCSV = () => {
    const rows = [
      ["Ky", "Tu ngay", "Den ngay", "Du dau ky", "Goc", "Lai", "Phi", "Phat", "Ky tra", "Du cuoi ky"],
      ...simRes.schedule.map((r) => [
        r.period,
        r.periodStart,
        r.periodEnd,
        r.opening,
        r.principal,
        r.interest,
        r.fee,
        r.penalty,
        r.payment,
        r.closing,
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `amortization_${variant}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const schedRows = simRes.schedule
      .map(
        (r) =>
          `<tr><td style="padding:6px;border-bottom:1px solid #eee;font-size:11px">${r.period}</td><td style="padding:6px;border-bottom:1px solid #eee;text-align:right;font-size:11px">${r.opening}</td><td style="padding:6px;border-bottom:1px solid #eee;text-align:right;font-size:11px;color:#0B7349;font-weight:600">${r.principal}</td><td style="padding:6px;border-bottom:1px solid #eee;text-align:right;font-size:11px;color:#9A6B00">${r.interest}</td><td style="padding:6px;border-bottom:1px solid #eee;text-align:right;font-size:11px;font-weight:700">${r.payment}</td><td style="padding:6px;border-bottom:1px solid #eee;text-align:right;font-size:11px">${r.closing}</td></tr>`
      )
      .join("");

    const html = `<html><head><title>Simulation Report</title><style>body{font-family:sans-serif;padding:30px;color:#333}table{width:100%;border-collapse:collapse}th{text-align:left;padding:8px;background:#f4f7f5}td{padding:8px;border-bottom:1px solid #eee}</style></head><body><h2>Bao cao mo phong - Product Factory</h2><p>Sieu pham: ${simRes.vinfo.name} (${variant})</p><p>Goc vay: ${fmtVnd(amount)}đ | Ky han: ${months} thang | Lai suat: ${rate}%/thang | LTV: ${simRes.ltv.toFixed(1)}%</p><table><thead><tr><th>KY</th><th style="text-align:right">DU DAU KY</th><th style="text-align:right">GOC</th><th style="text-align:right">LAI</th><th style="text-align:right">KY TRA</th><th style="text-align:right">DU CUOI KY</th></tr></thead><tbody>${schedRows}</tbody></table></body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      setTimeout(() => {
        w.focus();
        w.print();
      }, 500);
    }
  };

  const hasCompare = pinned.length > 0;
  const canPin = pinned.length < 3;

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0, animation: "fadeUp .3s ease" }}>
      {/* LEFT FORM PANE */}
      <div style={{ width: 360, flex: "none", background: "#fff", borderRight: "1px solid #E6ECE8", overflowY: "auto", minHeight: 0 }}>
        <div style={{ padding: "20px 22px", borderBottom: "1px solid #EEF2EF" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg,#14B870,#0E8C5A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "none",
                color: "#fff",
              }}
            >
              <Bolt size={19} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#122019" }}>Kịch bản mô phỏng</div>
              <div style={{ fontSize: 11.5, color: "#8A998F", marginTop: 1 }}>Nhập điều kiện khoản vay để chạy thử</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 17 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#41524A", display: "block", marginBottom: 7 }}>Sản phẩm (Variant)</label>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #E0E7E2",
                borderRadius: 9,
                padding: "11px 13px",
                fontSize: 13,
                color: "#243A30",
                background: "#FBFDFC",
                outline: "none",
              }}
            >
              <option value="VAR-101">VAR-101 (Vay nhanh Xe máy 18 tháng)</option>
            </select>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#A7B5AC", marginTop: 5 }}>
              {variant} · {simRes.vinfo.template}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#41524A" }}>Số tiền vay</label>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0B7349" }}>{fmtVnd(amount)}đ</span>
            </div>
            <input
              type="range"
              min="3000000"
              max="50000000"
              step="1000000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#0E8C5A" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#A7B5AC", marginTop: 3 }}>
              <span>3tr</span>
              <span>50tr</span>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#41524A" }}>Kỳ hạn</label>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0B7349" }}>{months} tháng</span>
            </div>
            <input
              type="range"
              min="3"
              max="36"
              step="1"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#0E8C5A" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#A7B5AC", marginTop: 3 }}>
              <span>3</span>
              <span>36</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#41524A", display: "block", marginBottom: 7 }}>Ngày bắt đầu kỳ đầu tiên</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #E0E7E2",
                borderRadius: 8,
                padding: "9px 11px",
                fontSize: 13,
                outline: "none",
                fontFamily: "inherit",
                color: "#243A30",
              }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#41524A" }}>Lãi suất (Base Rate)</label>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0B7349" }}>{rate}%/tháng</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#0E8C5A" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#A7B5AC", marginTop: 3 }}>
              <span>0,5%</span>
              <span>2,0% · trần</span>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#41524A" }}>Giá trị tài sản ĐB</label>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0B7349" }}>{fmtVnd(assetValue)}đ</span>
            </div>
            <input
              type="range"
              min="10000000"
              max="120000000"
              step="1000000"
              value={assetValue}
              onChange={(e) => setAssetValue(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#0E8C5A" }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#41524A", display: "block", marginBottom: 8 }}>Phân khúc khách hàng (Selector Scope)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {(["standard", "loyalty", "vip"] as const).map((k) => {
                const on = segment === k;
                const label = k === "standard" ? "Khách hàng tiêu chuẩn" : k === "loyalty" ? "Khách hàng thân thiết" : "Khách hàng VIP";
                const sub = k === "standard" ? "Base Rate mặc định" : k === "loyalty" ? "Ưu đãi −0,5%/tháng" : "Ưu đãi −0,3%/tháng";
                return (
                  <button
                    key={k}
                    onClick={() => setSegment(k)}
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      alignItems: "flex-start",
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: `1.5px solid ${on ? "#0E8C5A" : "#E6ECE8"}`,
                      background: on ? "#F4FBF7" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "#243A30" }}>{label}</span>
                    <span style={{ fontSize: 11, color: on ? "#0B7349" : "#A7B5AC", fontWeight: on ? 600 : 400 }}>{sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FEE SLIDERS */}
          <div style={{ borderTop: "1px solid #EEF2EF", paddingTop: 15 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: "#8A998F", marginBottom: 11 }}>PHÍ</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#41524A" }}>Phí thẩm định (1 lần · giải ngân)</label>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#2F73C4" }}>{fmtVnd(appraisalFee)}đ</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="100000"
                  value={appraisalFee}
                  onChange={(e) => setAppraisalFee(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#2F73C4" }}
                />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#41524A" }}>Phí quản lý theo kỳ (% dư nợ)</label>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#2F73C4" }}>{periodicFeePct}%/kỳ</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={periodicFeePct}
                  onChange={(e) => setPeriodicFeePct(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#2F73C4" }}
                />
              </div>
            </div>
          </div>

          {/* Penalty scenario toggle */}
          <div style={{ borderTop: "1px solid #EEF2EF", paddingTop: 15 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#122019" }}>Tình huống phạt trễ hạn</div>
                <div style={{ fontSize: 11, color: "#8A998F", marginTop: 1 }}>Phạt = 150% lãi suất trên kỳ trả</div>
              </div>
              <div
                onClick={() => setPenaltyOn(!penaltyOn)}
                style={{
                  width: 38,
                  height: 22,
                  borderRadius: 99,
                  background: penaltyOn ? "#B23B3B" : "#D7E1DB",
                  position: "relative",
                  flex: "none",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: penaltyOn ? 18 : 2,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 2px rgba(0,0,0,.2)",
                    transition: "left 0.2s",
                  }}
                />
              </div>
            </div>
            {penaltyOn && (
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#5E6F66", display: "block", marginBottom: 5 }}>Trễ tại kỳ</label>
                  <input
                    type="number"
                    value={penaltyPeriod}
                    onChange={(e) => setPenaltyPeriod(Number(e.target.value))}
                    style={{ border: "1px solid #E0E7E2", borderRadius: 8, padding: "8px 10px", fontSize: 13, width: "100%", outline: "none" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#5E6F66", display: "block", marginBottom: 5 }}>Số ngày trễ</label>
                  <input
                    type="number"
                    value={penaltyDays}
                    onChange={(e) => setPenaltyDays(Number(e.target.value))}
                    style={{ border: "1px solid #E0E7E2", borderRadius: 8, padding: "8px 10px", fontSize: 13, width: "100%", outline: "none" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Prepayment scenario toggle */}
          <div style={{ borderTop: "1px solid #EEF2EF", paddingTop: 15 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#122019" }}>Tình huống trả bớt gốc</div>
                <div style={{ fontSize: 11, color: "#8A998F", marginTop: 1 }}>Tái phân bổ kỳ trả sau trả trước</div>
              </div>
              <div
                onClick={() => setPrepayOn(!prepayOn)}
                style={{
                  width: 38,
                  height: 22,
                  borderRadius: 99,
                  background: prepayOn ? "#0E8C5A" : "#D7E1DB",
                  position: "relative",
                  flex: "none",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: prepayOn ? 18 : 2,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 2px rgba(0,0,0,.2)",
                    transition: "left 0.2s",
                  }}
                />
              </div>
            </div>
            {prepayOn && (
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <div style={{ flex: "none", width: 90 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#5E6F66", display: "block", marginBottom: 5 }}>Tại kỳ</label>
                  <input
                    type="number"
                    value={prepayPeriod}
                    onChange={(e) => setPrepayPeriod(Number(e.target.value))}
                    style={{ border: "1px solid #E0E7E2", borderRadius: 8, padding: "8px 10px", fontSize: 13, width: "100%", outline: "none" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#5E6F66", display: "block", marginBottom: 5 }}>Số tiền trả thêm (đ)</label>
                  <input
                    type="number"
                    value={prepayAmount}
                    onChange={(e) => setPrepayAmount(Number(e.target.value))}
                    style={{ border: "1px solid #E0E7E2", borderRadius: 8, padding: "8px 10px", fontSize: 13, width: "100%", outline: "none" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Grace period toggle */}
          <div style={{ borderTop: "1px solid #EEF2EF", paddingTop: 15 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#122019" }}>Tình huống ân hạn</div>
                <div style={{ fontSize: 11, color: "#8A998F", marginTop: 1 }}>Kỳ đầu chỉ trả lãi, hoãn gốc</div>
              </div>
              <div
                onClick={() => setGraceOn(!graceOn)}
                style={{
                  width: 38,
                  height: 22,
                  borderRadius: 99,
                  background: graceOn ? "#E8920C" : "#D7E1DB",
                  position: "relative",
                  flex: "none",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: graceOn ? 18 : 2,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 2px rgba(0,0,0,.2)",
                    transition: "left 0.2s",
                  }}
                />
              </div>
            </div>
            {graceOn && (
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justify: "space-between", alignItems: "baseline", marginBottom: 7 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#5E6F66" }}>Số kỳ ân hạn (chỉ trả lãi)</label>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#9A6B00" }}>{graceMonths} kỳ</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={graceMonths}
                  onChange={(e) => setGraceMonths(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#E8920C" }}
                />
              </div>
            )}
          </div>

          {/* Early settlement scenario */}
          <div style={{ borderTop: "1px solid #EEF2EF", paddingTop: 15 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#122019" }}>Tình huống tất toán sớm</div>
                <div style={{ fontSize: 11, color: "#8A998F", marginTop: 1 }}>Đóng toàn bộ dư nợ + phí phạt tất toán</div>
              </div>
              <div
                onClick={() => setEarlyOn(!earlyOn)}
                style={{
                  width: 38,
                  height: 22,
                  borderRadius: 99,
                  background: earlyOn ? "#B23B3B" : "#D7E1DB",
                  position: "relative",
                  flex: "none",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: earlyOn ? 18 : 2,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 2px rgba(0,0,0,.2)",
                    transition: "left 0.2s",
                  }}
                />
              </div>
            </div>
            {earlyOn && (
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <div style={{ flex: "none", width: 90 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#5E6F66", display: "block", marginBottom: 5 }}>Tại kỳ</label>
                  <input
                    type="number"
                    value={earlyPeriod}
                    onChange={(e) => setEarlyPeriod(Number(e.target.value))}
                    style={{ border: "1px solid #E0E7E2", borderRadius: 8, padding: "8px 10px", fontSize: 13, width: "100%", outline: "none" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#5E6F66", display: "block", marginBottom: 5 }}>Phạt tất toán (% dư nợ)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={earlyPenaltyPct}
                    onChange={(e) => setEarlyPenaltyPct(Number(e.target.value))}
                    style={{ border: "1px solid #E0E7E2", borderRadius: 8, padding: "8px 10px", fontSize: 13, width: "100%", outline: "none" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid #EEF2EF", paddingTop: 15 }}>
            <button
              onClick={handlePin}
              disabled={!canPin}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "10px",
                padding: "11px",
                fontSize: "12.5px",
                fontWeight: 700,
                color: "#fff",
                background: canPin ? "#243A30" : "#B4C4BB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                cursor: canPin ? "pointer" : "not-allowed",
              }}
            >
              <Target size={14} color="#fff" /> Ghim phương án ({pinned.length}/3)
            </button>
            <div style={{ display: "flex", gap: 9 }}>
              <button
                onClick={handleExportCSV}
                style={{
                  flex: 1,
                  border: "1px solid #C2D0C8",
                  borderRadius: "10px",
                  padding: "11px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#41524A",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: "pointer",
                }}
              >
                Xuất CSV
              </button>
              <button
                onClick={handleExportPDF}
                style={{
                  flex: 1,
                  border: "1px solid #C2D0C8",
                  borderRadius: "10px",
                  padding: "11px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#41524A",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: "pointer",
                }}
              >
                Xuất PDF
              </button>
            </div>

            {hasCompare && (
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 10 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, color: "#A7B5AC" }}>PHƯƠNG ÁN ĐÃ GHIM</div>
                {pinned.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "9px 11px",
                      background: "#F4F7F5",
                      border: "1px solid #E6ECE8",
                      borderRadius: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        background: SCEN_COLORS[i + 1],
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 800,
                        flex: "none",
                      }}
                    >
                      {SCEN_LABELS[i + 1]}
                    </span>
                    <div style={{ flex: 1, minWidth: 0, fontSize: 11, color: "#5E6F66" }}>
                      {fmtVnd(p.amount)}đ · {p.months} tháng · {p.rate}%
                    </div>
                    <button
                      onClick={() => handleClearPin(i)}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#A7B5AC",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        flex: "none",
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RESULTS/MAIN PANE */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "24px 26px", background: "#F4F7F5" }}>
        {/* Scenario Comparison Block */}
        {hasCompare && (
          <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, padding: "18px 20px", marginBottom: 18 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: "#122019", marginBottom: 3 }}>So sánh {pinned.length + 1} phương án</div>
            <div style={{ fontSize: 12, color: "#8A998F", marginBottom: 15 }}>
              Chỉ số có nền xanh lá là giá trị tối ưu nhất (thấp nhất). P/A A là kịch bản đang điều chỉnh trực tiếp.
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "9px 12px", borderBottom: "2px solid #EEF2EF" }}>CHỈ SỐ</th>
                    {cmpCols.map((c, i) => (
                      <th
                        key={i}
                        style={{ textAlign: "right", padding: "9px 12px", borderBottom: "2px solid #EEF2EF", verticalAlign: "top" }}
                      >
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: c.color }}>{c.label}</div>
                        <div style={{ fontSize: 10, fontWeight: 500, color: "#A7B5AC", marginTop: 1 }}>{c.sub}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cmpRows.map((r, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #F1F5F2" }}>
                      <td style={{ padding: "10px 12px", fontSize: 12.5, fontWeight: 600, color: "#243A30" }}>{r.metric}</td>
                      {r.cells.map((c, ci) => (
                        <td key={ci} style={{ padding: "7px 8px", textAlign: "right" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 9px",
                              borderRadius: 7,
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 12,
                              fontWeight: c.weight,
                              color: c.color,
                              background: c.bg,
                            }}
                          >
                            {c.text}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cost KPIs (Top level cards) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 18 }}>
          {[
            { label: "KỲ TRẢ ĐỊNH KỲ", value: `${fmtVnd(simRes.pmt)}đ`, color: "#122019", sub: "Gốc + lãi (chưa phí)" },
            { label: "TỔNG LÃI", value: `${fmtVnd(simRes.totalInt)}đ`, color: "#9A6B00", sub: "Trên toàn kỳ hạn" },
            { label: "TỔNG PHÍ", value: `${fmtVnd(simRes.totalFee)}đ`, color: "#2F73C4", sub: "Thẩm định + phí theo kỳ" },
            { label: "TỔNG PHẢI TRẢ", value: `${fmtVnd(simRes.totalPay)}đ`, color: "#0B7349", sub: "Gốc + lãi + phí + phạt" },
          ].map((k, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, padding: "16px 18px" }}>
              <div style={{ fontSize: 11, color: "#A7B5AC", fontWeight: 600, letterSpacing: 0.3 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: k.color, marginTop: 7, letterSpacing: -0.5 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: "#8A998F", marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Detail Cost Breakdown (Second level cards) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 18 }}>
          {[
            { label: "PHÍ THẨM ĐỊNH (1 LẦN)", value: `${fmtVnd(simRes.apprFee)}đ`, color: "#2F73C4", sub: "Thu tại giải ngân" },
            { label: "PHÍ QUẢN LÝ THEO KỲ", value: `${periodicFeePct}%`, color: "#2F73C4", sub: `Dư nợ đầu kỳ · ${fmtVnd(simRes.totalFee - simRes.apprFee)}đ` },
            {
              label: "TỔNG PHẠT TRỄ HẠN",
              value: `${fmtVnd(simRes.totalPenalty)}đ`,
              color: simRes.totalPenalty > 0 ? "#B23B3B" : "#A7B5AC",
              sub: penaltyOn ? `Kỳ ${penaltyPeriod} · trễ ${penaltyDays} ngày` : "Không phạt",
            },
            {
              label: "ĐÃ TRẢ BỚT GỐC",
              value: `${fmtVnd(simRes.totalPrepay)}đ`,
              color: simRes.totalPrepay > 0 ? "#0E8C5A" : "#A7B5AC",
              sub: prepayOn ? `Kỳ ${prepayPeriod} · trả bớt` : "Không có",
            },
          ].map((k, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, padding: "14px 16px" }}>
              <div style={{ fontSize: 10.5, color: "#A7B5AC", fontWeight: 700, letterSpacing: 0.2, marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: k.color, letterSpacing: -0.3 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: "#8A998F", marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Grace & Settlement Details (Third level cards) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 18 }}>
          {[
            { label: "KỲ ÂN HẠN (CHỈ TRẢ LÃI)", value: graceOn ? `${graceMonths} kỳ` : "0 kỳ", color: graceOn ? "#9A6B00" : "#A7B5AC", sub: graceOn ? `Phân bổ từ kỳ ${graceMonths + 1}` : "Không ân hạn" },
            { label: "TẤT TOÁN TRƯỚC HẠN", value: earlyOn ? `Kỳ ${earlyPeriod}` : "—", color: earlyOn ? "#B23B3B" : "#A7B5AC", sub: earlyOn ? `Đóng sớm ${months - earlyPeriod} kỳ` : "Hết kỳ hạn" },
            {
              label: "PHẠT TẤT TOÁN SỚM",
              value: `${fmtVnd(simRes.totalEarlyPen)}đ`,
              color: simRes.totalEarlyPen > 0 ? "#B23B3B" : "#A7B5AC",
              sub: earlyOn ? `${earlyPenaltyPct}% dư nợ tất toán` : "Không phạt",
            },
            {
              label: "KỲ THỰC TRẢ",
              value: `${simRes.periodsUsed} / ${months} kỳ`,
              color: "#122019",
              sub: earlyOn ? "Kết thúc sớm" : "Đủ kỳ hạn",
            },
          ].map((k, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, padding: "14px 16px" }}>
              <div style={{ fontSize: 10.5, color: "#A7B5AC", fontWeight: 700, letterSpacing: 0.2, marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: k.color, letterSpacing: -0.3 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: "#8A998F", marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Constraint Checks List */}
        <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, padding: "18px 20px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: "#122019" }}>Kiểm tra ràng buộc (Constraint Validation)</div>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: simRes.allPass ? "#0B7349" : "#B23B3B",
                background: simRes.allPass ? "#DCF3E7" : "#FBE3E3",
                padding: "4px 11px",
                borderRadius: 99,
              }}
            >
              {simRes.allPass ? "HỢP LỆ" : "CÓ RÀNG BUỘC CHƯA ĐẠT"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {simRes.checks.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 13px",
                  border: `1px solid ${c.bd}`,
                  borderRadius: 10,
                  background: c.bg,
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: c.iconBg,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "none",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {c.mark}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#243A30" }}>{c.title}</div>
                  <div style={{ fontSize: 11.5, color: "#5E6F66", marginTop: 2 }}>{c.detail}</div>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 600, color: c.valColor }}>
                  {c.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cashflow Chart Visualization */}
        <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, padding: "18px 20px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "#122019" }}>Dòng tiền (Cashflow) — góc nhìn bên cho vay</div>
              <div style={{ fontSize: 12, color: "#8A998F", marginTop: 2 }}>
                Cơ cấu Gốc/Lãi mỗi kỳ &amp; đường thu hồi lũy kế so với vốn giải ngân
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flex: "none", paddingTop: 2 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: "#0E8C5A" }}></span>
                <span style={{ fontSize: 11.5, color: "#5E6F66", fontWeight: 500 }}>Gốc</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: "#E8920C" }}></span>
                <span style={{ fontSize: 11.5, color: "#5E6F66", fontWeight: 500 }}>Lãi</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: "#2F73C4" }}></span>
                <span style={{ fontSize: 11.5, color: "#5E6F66", fontWeight: 500 }}>Phí/Phạt</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 14, height: 0, borderTop: "2px solid #0E8C5A" }}></span>
                <span style={{ fontSize: 11.5, color: "#5E6F66", fontWeight: 500 }}>Lũy kế (A)</span>
              </span>
            </div>
          </div>

          <div style={{ position: "relative", height: 210, padding: "0 2px", marginBottom: 6 }}>
            {/* Capital base reference line */}
            <div style={{ position: "absolute", left: 0, right: 0, top: `${simRes.capitalLineY}%`, borderTop: "1.5px dashed #C2A56B", zIndex: 2, pointerEvents: "none" }}>
              <span style={{ position: "absolute", right: 0, top: -9, fontSize: 10, fontWeight: 600, color: "#9A6B00", background: "#FBEFC7", padding: "1px 7px", borderRadius: 6 }}>
                Vốn giải ngân
              </span>
            </div>

            {/* SVG Cumulative curve line */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 3, pointerEvents: "none", overflow: "visible" }}>
              {pinnedRes.map((p, pi) => (
                <polyline key={pi} points={p.cumPoints} fill="none" stroke={SCEN_COLORS[pi + 1]} strokeWidth="0.7" strokeDasharray="2 1.5" vectorEffect="non-scaling-stroke" />
              ))}
              <polyline points={simRes.cumPoints} fill="none" stroke="#0E8C5A" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
            </svg>

            {/* Breakeven period marker */}
            {simRes.breakevenPeriod !== null && simRes.breakevenX !== null && (
              <div style={{ position: "absolute", top: 0, bottom: 18, left: `${simRes.breakevenX}%`, width: 0, borderLeft: "1.5px dotted #0E8C5A", zIndex: 2 }}>
                <span style={{ position: "absolute", top: -2, left: 5, fontSize: 10, fontWeight: 700, color: "#0B7349", whiteSpace: "nowrap", background: "#DCF3E7", padding: "1px 7px", borderRadius: 6 }}>
                  Hòa vốn: Kỳ {simRes.breakevenPeriod}
                </span>
              </div>
            )}

            {/* Chart Bars */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, top: 0, display: "flex", alignItems: "flex-end", gap: 3 }}>
              {simRes.chart.map((b, bi) => (
                <div key={bi} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", minWidth: 0 }}>
                  <div style={{ width: "100%", maxWidth: 26, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                    <div style={{ width: "100%", height: b.feeH, background: "#2F73C4", borderRadius: "3px 3px 0 0" }}></div>
                    <div style={{ width: "100%", height: b.intH, background: "#E8920C" }}></div>
                    <div style={{ width: "100%", height: b.priH, background: "#0E8C5A" }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart X Labels */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 16, display: "flex", gap: 3 }}>
              {simRes.chart.map((b, bi) => (
                <div key={bi} style={{ flex: 1, textAlign: "center", minWidth: 0, fontSize: 9.5, color: "#A7B5AC", overflow: "hidden" }}>
                  {b.showLabel && <span>Kỳ {b.label}</span>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#A7B5AC", textAlign: "center" }}>
            Trục X: kỳ trả · Trục Y: tỷ trọng trong kỳ trả · Đường lũy kế leo dần thể hiện tiền thu về cộng dồn
          </div>
        </div>

        {/* Amortization Schedule Table */}
        <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "#122019" }}>Lịch trả nợ (Amortization Schedule)</div>
              <div style={{ fontSize: 12, color: "#8A998F", marginTop: 2 }}>Dư nợ giảm dần · {months} kỳ · {fmtVnd(amount)}đ gốc</div>
            </div>
          </div>
          <div style={{ overflowX: "auto", maxHeight: 340, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead>
                <tr style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1, borderBottom: "2px solid #EEF2EF" }}>
                  <th style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "9px 12px" }}>KỲ</th>
                  <th style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "9px 12px" }}>TỪ NGÀY</th>
                  <th style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "9px 12px" }}>ĐẾN NGÀY</th>
                  <th style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "9px 12px" }}>DƯ ĐẦU KỲ</th>
                  <th style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "9px 12px" }}>GỐC</th>
                  <th style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "9px 12px" }}>LÃI</th>
                  <th style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: "#2F73C4", padding: "9px 12px" }}>PHÍ</th>
                  <th style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: "#B23B3B", padding: "9px 12px" }}>PHẠT</th>
                  <th style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "9px 12px" }}>KỲ TRẢ</th>
                  <th style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "9px 12px" }}>DƯ CUỐI KỲ</th>
                </tr>
              </thead>
              <tbody>
                {simRes.schedule.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F1F5F2", background: r.rowBg }}>
                    <td style={{ padding: "10px 12px", fontSize: 12.5, fontWeight: 600, color: "#243A30" }}>
                      <div>{r.period}</div>
                      {r.hasTag && (
                        <div style={{ fontSize: 9.5, fontWeight: 700, color: r.tagColor, marginTop: 2 }}>
                          ● {r.tagText}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#5E6F66", fontFamily: "'JetBrains Mono', monospace" }}>{r.periodStart}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#5E6F66", fontFamily: "'JetBrains Mono', monospace" }}>{r.periodEnd}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12.5, color: "#5E6F66", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{r.opening}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12.5, color: "#0B7349", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{r.principal}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12.5, color: "#9A6B00", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{r.interest}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12.5, color: "#2F73C4", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{r.fee}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12.5, color: "#B23B3B", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{r.penalty}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12.5, color: "#122019", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{r.payment}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12.5, color: "#5E6F66", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{r.closing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

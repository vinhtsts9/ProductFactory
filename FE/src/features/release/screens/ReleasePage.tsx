import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { RELEASE_STEPS_RAW } from "../mockData";
import type { AppView } from "../../../app/navigation";

// Define icons mapping for steps
import { Target, Route, GitBranch, LayoutTemplate, FileCog, Zap, CircleDollarSign, Rocket } from "lucide-react";

const stepIcons: Record<string, React.ComponentType<{ size: number; color?: string }>> = {
  target: Target,
  route: Route,
  "git-branch": GitBranch,
  "layout-template": LayoutTemplate,
  "file-cog": FileCog,
  zap: Zap,
  "circle-dollar-sign": CircleDollarSign,
  rocket: Rocket,
};

interface ReleasePageProps {
  onNavigate: (view: AppView) => void;
}

export function ReleasePage({ onNavigate }: ReleasePageProps) {
  const [releaseDone, setReleaseDone] = useState(4); // default 4 steps done
  const [releaseSel, setReleaseSel] = useState(4); // selected step index
  const [releaseView, setReleaseView] = useState<"stepper" | "swimlane">("stepper");

  const total = RELEASE_STEPS_RAW.length;
  const pct = Math.round((releaseDone / total) * 100);

  const roleColors: Record<string, [string, string]> = {
    "Product Owner": ["#FBEFC7", "#8A6300"],
    "Product Designer": ["#ECF6F1", "#0B7349"],
    "Product Designer / QA": ["#E5EEF9", "#2F73C4"],
    "Checker / Approver": ["#EAE3F7", "#6A45B0"],
    "Vận hành (Operations)": ["#FDE7D6", "#B5651A"],
  };

  const steps = RELEASE_STEPS_RAW.map((s, i) => {
    const status: "done" | "current" | "upcoming" = i < releaseDone ? "done" : i === releaseDone ? "current" : "upcoming";
    const isSel = i === releaseSel;
    const rc = roleColors[s.role] || ["#EEF1EF", "#41524A"];
    const StepIcon = stepIcons[s.icon] || Target;

    return {
      ...s,
      idx: i,
      num: i + 1,
      status,
      isSel,
      roleBg: rc[0],
      roleFg: rc[1],
      StepIcon,
      statusChip: status === "done" ? { t: "Hoàn thành", bg: "#DCF3E7", fg: "#0B7349" } : status === "current" ? { t: "Đang làm", bg: "#FEF3D6", fg: "#9A6B00" } : { t: "Chưa tới", bg: "#F1F5F2", fg: "#A7B5AC" },
    };
  });

  const selectedStep = steps[releaseSel];
  const selectedStatus = selectedStep.status;

  const handleComplete = () => {
    setReleaseDone((prev) => {
      const nextDone = Math.max(prev, releaseSel + 1);
      setReleaseSel(Math.min(releaseSel + 1, total - 1));
      return nextDone;
    });
  };

  const handleReopen = () => {
    setReleaseDone(releaseSel);
  };

  // Swimlane coordinates
  const laneOrder = ["Product Owner", "Product Designer", "Product Designer / QA", "Checker / Approver", "Vận hành (Operations)"];
  const laneShort = ["Product Owner", "Product Designer", "Designer / QA", "Checker / Approver", "Vận hành"];
  const headerH = 38;
  const laneH = 116;
  const colW = 210;
  const pad = 16;
  const cardW = 176;
  const cardH = 72;
  const canvasW = total * colW;
  const canvasH = headerH + laneOrder.length * laneH;
  const getLaneCenter = (r: number) => headerH + r * laneH + laneH / 2;

  return (
    <div style={{ padding: "24px 26px", maxWidth: 1240, animation: "fadeUp .3s ease" }}>
      {/* top banner */}
      <div
        style={{
          background: "linear-gradient(120deg,#0B3B2E,#0E5C44)",
          borderRadius: 16,
          padding: "22px 26px",
          marginBottom: 22,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#7FD8AE", letterSpacing: 0.4 }}>ĐANG PHÁT HÀNH</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginTop: 4 }}>Vay nhanh Xe máy 18 tháng</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#A9CFBE", marginTop: 4 }}>
            CFG-0042 → VAR-101
          </div>
        </div>
        <div style={{ flex: "none", width: 280 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12.5, color: "#C9E6D9", fontWeight: 500 }}>Tiến độ quy trình</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>
              {releaseDone}/{total} bước
            </span>
          </div>
          <div style={{ height: 10, borderRadius: 99, background: "rgba(255,255,255,.15)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                borderRadius: 99,
                width: `${pct}%`,
                background: "linear-gradient(90deg,#19C079,#7FD8AE)",
                transition: "width .4s",
              }}
            />
          </div>
          <div style={{ fontSize: 11.5, color: "#7FD8AE", marginTop: 7 }}>{pct}% hoàn thành · còn lại trước khi lên kệ</div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div style={{ display: "flex", gap: 9, marginBottom: 18 }}>
        <button
          onClick={() => setReleaseView("stepper")}
          style={{
            fontSize: "12.5px",
            fontWeight: releaseView === "stepper" ? 700 : 500,
            color: releaseView === "stepper" ? "#fff" : "#41524A",
            background: releaseView === "stepper" ? "#0E8C5A" : "#fff",
            border: releaseView === "stepper" ? "none" : "1px solid #E6ECE8",
            padding: "8px 15px",
            borderRadius: 9,
            cursor: "pointer",
          }}
        >
          Hướng dẫn từng bước
        </button>
        <button
          onClick={() => setReleaseView("swimlane")}
          style={{
            fontSize: "12.5px",
            fontWeight: releaseView === "swimlane" ? 700 : 500,
            color: releaseView === "swimlane" ? "#fff" : "#41524A",
            background: releaseView === "swimlane" ? "#0E8C5A" : "#fff",
            border: releaseView === "swimlane" ? "none" : "1px solid #E6ECE8",
            padding: "8px 15px",
            borderRadius: 9,
            cursor: "pointer",
          }}
        >
          Sơ đồ Swimlane
        </button>
      </div>

      {/* Tab content: Stepper */}
      {releaseView === "stepper" && (
        <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 22, alignItems: "start" }}>
          {/* timeline list */}
          <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 14, padding: "16px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: "#8A998F", padding: "4px 8px 12px" }}>
              {total} BƯỚC PHÁT HÀNH SẢN PHẨM
            </div>
            {steps.map((s, i) => (
              <div key={i}>
                <div
                  onClick={() => setReleaseSel(i)}
                  style={{
                    display: "flex",
                    gap: 13,
                    padding: "13px 14px",
                    borderRadius: 12,
                    cursor: "pointer",
                    background: s.isSel ? "#F4FBF7" : "transparent",
                    border: `1.5px solid ${s.isSel ? "#0E8C5A" : "transparent"}`,
                    transition: "background .15s",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none" }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        flex: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13.5,
                        fontWeight: 700,
                        background: s.status === "done" ? "#0E8C5A" : s.status === "current" ? "#FEF3D6" : "#F1F5F2",
                        color: s.status === "done" ? "#fff" : s.status === "current" ? "#9A6B00" : "#A7B5AC",
                        border: s.status === "current" ? "2px solid #E8920C" : "none",
                      }}
                    >
                      {s.status === "done" ? "✓" : s.num}
                    </div>
                    {i < total - 1 && (
                      <div
                        style={{
                          width: 2,
                          height: 20,
                          background: i < releaseDone ? "#0E8C5A" : "#E0E7E2",
                          marginTop: 2,
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, paddingTop: 5 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: s.isSel ? "#0B7349" : s.status === "upcoming" ? "#8A998F" : "#243A30",
                        lineHeight: 1.3,
                      }}
                    >
                      {s.title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 6 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: s.roleFg, background: s.roleBg, padding: "2px 8px", borderRadius: 99 }}>
                        {s.role}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: s.statusChip.fg,
                      background: s.statusChip.bg,
                      padding: "3px 9px",
                      borderRadius: 99,
                      height: "fit-content",
                      marginTop: 5,
                      flex: "none",
                    }}
                  >
                    {s.statusChip.t}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* detail view */}
          <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 14, overflow: "hidden" }}>
            <div
              style={{
                background:
                  selectedStatus === "done"
                    ? "linear-gradient(135deg,#0E8C5A,#0B6B45)"
                    : selectedStatus === "current"
                    ? "linear-gradient(135deg,#E8920C,#C9740A)"
                    : "linear-gradient(135deg,#5E6F66,#41524A)",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 15,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 13,
                  background: "rgba(255,255,255,.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "none",
                  color: "#fff",
                }}
              >
                {selectedStep.StepIcon && <selectedStep.StepIcon size={22} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.82)" }}>
                  BƯỚC {selectedStep.num} / {total} · {selectedStatus === "done" ? "Đã hoàn thành" : selectedStatus === "current" ? "Đang thực hiện" : "Chưa bắt đầu"}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginTop: 3 }}>{selectedStep.title}</div>
              </div>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "#fff",
                  background: "rgba(255,255,255,.2)",
                  padding: "5px 12px",
                  borderRadius: 99,
                  flex: "none",
                }}
              >
                {selectedStep.role}
              </span>
            </div>

            <div style={{ padding: "22px 24px" }}>
              <div style={{ fontSize: 13.5, color: "#41524A", lineHeight: 1.6, marginBottom: 20 }}>{selectedStep.desc}</div>

              {/* inputs / outputs */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                <div style={{ flex: 1, border: "1px solid #EEF2EF", borderRadius: 11, padding: "12px 14px", background: "#FBFDFC" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, color: "#A7B5AC" }}>ĐẦU VÀO</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#243A30", marginTop: 4 }}>{selectedStep.input}</div>
                </div>
                <span style={{ color: "#0E8C5A", flex: "none" }}>
                  <ArrowRight size={15} />
                </span>
                <div style={{ flex: 1, border: "1px solid #CDE9DA", borderRadius: 11, padding: "12px 14px", background: "#F4FBF7" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, color: "#0B7349" }}>ĐẦU RA</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0B7349", marginTop: 4 }}>{selectedStep.output}</div>
                </div>
              </div>

              {/* checklist */}
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, color: "#8A998F", marginBottom: 11 }}>VIỆC CẦN LÀM</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {selectedStep.checklist.map((c, ci) => {
                  const cdone = selectedStatus === "done" || (selectedStatus === "current" && ci === 0);
                  return (
                    <div key={ci} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", border: "1px solid #EEF2EF", borderRadius: 10 }}>
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 7,
                          flex: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          border: `1.5px solid ${cdone ? "#0E8C5A" : "#D7E1DB"}`,
                          background: cdone ? "#0E8C5A" : "#fff",
                          color: "#fff",
                        }}
                      >
                        {cdone ? "✓" : ""}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: cdone ? "#243A30" : "#5E6F66" }}>{c}</span>
                    </div>
                  );
                })}
              </div>

              {/* tip box */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  background: "#FFFBF0",
                  border: "1px solid #F2E6C2",
                  borderRadius: 11,
                  padding: "12px 14px",
                  marginBottom: 22,
                }}
              >
                <span style={{ fontSize: 15, flex: "none" }}>💡</span>
                <div style={{ fontSize: 12.5, color: "#8A6300", lineHeight: 1.5 }}>{selectedStep.tip}</div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 11 }}>
                <button
                  onClick={() => {
                    const targetView = selectedStep.view as AppView;
                    onNavigate(targetView);
                  }}
                  style={{
                    flex: 1,
                    background: "#0E8C5A",
                    color: "#fff",
                    borderRadius: 10,
                    padding: 13,
                    fontSize: 13.5,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    border: "none",
                    boxShadow: "0 2px 8px rgba(14,140,90,.3)",
                    cursor: "pointer",
                  }}
                >
                  {selectedStep.goLabel} →
                </button>
                {selectedStatus === "current" && (
                  <button
                    onClick={handleComplete}
                    style={{
                      flex: "none",
                      border: "1.5px solid #0E8C5A",
                      color: "#0B7349",
                      background: "#fff",
                      borderRadius: 10,
                      padding: "13px 18px",
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ✓ Hoàn thành bước
                  </button>
                )}
                {selectedStatus === "done" && (
                  <button
                    onClick={handleReopen}
                    style={{
                      flex: "none",
                      border: "1.5px solid #E6ECE8",
                      color: "#41524A",
                      background: "#fff",
                      borderRadius: 10,
                      padding: "13px 18px",
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Mở lại bước
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab content: Swimlane layout */}
      {releaseView === "swimlane" && (
        <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#122019", marginBottom: 3 }}>Sơ đồ Swimlane theo vai trò</div>
          <div style={{ fontSize: 12, color: "#8A998F", marginBottom: 16 }}>
            Luồng phát hành chạy từ trái qua phải; mỗi làn thể hiện một vai trò. Mũi tên chỉ ra điểm bàn giao công việc. Nhấp chọn bước để xem chi tiết.
          </div>

          <div style={{ display: "flex", border: "1px solid #EEF2EF", borderRadius: 12, overflow: "hidden" }}>
            {/* lane headers */}
            <div style={{ width: 160, flex: "none", borderRight: "1px solid #EEF2EF", background: "#fff" }}>
              <div style={{ height: headerH, borderBottom: "1px solid #F1F5F2" }}></div>
              {laneShort.map((nm, r) => {
                const laneRole = laneOrder[r];
                const rc = roleColors[laneRole] || ["#EEF1EF", "#41524A"];
                return (
                  <div
                    key={r}
                    style={{
                      height: laneH,
                      borderBottom: "1px solid #F1F5F2",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 13px",
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, color: rc[1], background: rc[0], padding: "4px 9px", borderRadius: 8, lineHeight: 1.2 }}>
                      {nm}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* timeline scroll area */}
            <div style={{ flex: 1, overflowX: "auto" }}>
              <div style={{ position: "relative", width: canvasW, height: canvasH }}>
                {/* horizontal rows */}
                {laneShort.map((_, r) => (
                  <div
                    key={r}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: headerH + r * laneH,
                      height: laneH,
                      background: r % 2 === 0 ? "#FBFDFC" : "#F4F7F5",
                      borderBottom: "1px solid #F1F5F2",
                    }}
                  />
                ))}

                {/* column titles */}
                {steps.map((st, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: i * colW + pad,
                      width: cardW,
                      height: headerH,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#8A998F",
                      borderBottom: "1px solid #F1F5F2",
                    }}
                  >
                    Bước {st.num}
                  </div>
                ))}

                {/* SVG Connections */}
                <svg
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                >
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#D7E1DB" />
                    </marker>
                    <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0E8C5A" />
                    </marker>
                  </defs>
                  {steps.map((_, i) => {
                    if (i === total - 1) return null;
                    const r1 = laneOrder.indexOf(steps[i].role);
                    const r2 = laneOrder.indexOf(steps[i + 1].role);
                    const y1 = getLaneCenter(r1);
                    const y2 = getLaneCenter(r2);
                    const x1 = i * colW + pad + cardW;
                    const x2 = (i + 1) * colW + pad;
                    const midX = (x1 + x2) / 2;
                    const active = i + 1 < releaseDone;
                    const color = active ? "#0E8C5A" : i + 1 === releaseDone ? "#E8920C" : "#D7E1DB";
                    const marker = active ? "url(#arrow-active)" : "url(#arrow)";

                    return (
                      <g key={i}>
                        {/* Horizontal from card to mid-point */}
                        <line x1={x1} y1={y1} x2={midX} y2={y1} stroke={color} strokeWidth={2} />
                        {/* Vertical segment */}
                        <line x1={midX} y1={y1} x2={midX} y2={y2} stroke={color} strokeWidth={2} />
                        {/* Horizontal from mid-point to next card with arrow */}
                        <line x1={midX} y1={y2} x2={x2} y2={y2} stroke={color} strokeWidth={2} markerEnd={marker} />
                      </g>
                    );
                  })}
                </svg>

                {/* Step cards */}
                {steps.map((st, i) => {
                  const r = laneOrder.indexOf(st.role);
                  const active = i < releaseDone;
                  const current = i === releaseDone;
                  const bg = current ? "#FFFBF0" : "#fff";
                  const bd = st.isSel ? "#0E8C5A" : active ? "#CDE9DA" : current ? "#F2DE9E" : "#E6ECE8";
                  const dotColor = active ? "#0E8C5A" : current ? "#E8920C" : "#C2D0C8";

                  return (
                    <div
                      key={i}
                      onClick={() => setReleaseSel(i)}
                      style={{
                        position: "absolute",
                        left: i * colW + pad,
                        top: getLaneCenter(r) - cardH / 2,
                        width: cardW,
                        height: cardH,
                        background: bg,
                        border: `1.5px solid ${bd}`,
                        borderRadius: 11,
                        padding: "9px 11px",
                        cursor: "pointer",
                        boxShadow: st.isSel ? "0 4px 14px rgba(14,140,90,.16)" : "0 1px 2px rgba(11,59,46,.04)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 4,
                        zIndex: 2,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 6,
                            background: "#F1F5F2",
                            color: "#5E6F66",
                            fontSize: 10.5,
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flex: "none",
                          }}
                        >
                          {st.num}
                        </span>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            color: "#243A30",
                            lineHeight: 1.2,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {st.title}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 25 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, flex: "none" }} />
                        <span style={{ fontSize: 10, fontWeight: 600, color: dotColor }}>
                          {active ? "Hoàn thành" : current ? "Đang làm" : "Chưa tới"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 20, marginTop: 14, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#A7B5AC", fontWeight: 600 }}>CHÚ GIẢI:</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 18, height: 3, borderRadius: 2, background: "#0E8C5A" }}></span>
              <span style={{ fontSize: 11.5, color: "#5E6F66" }}>Đã hoàn thành</span>
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 18, height: 3, borderRadius: 2, background: "#E8920C" }}></span>
              <span style={{ fontSize: 11.5, color: "#5E6F66" }}>Đang thực hiện</span>
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 18, height: 3, borderRadius: 2, background: "#D7E1DB" }}></span>
              <span style={{ fontSize: 11.5, color: "#5E6F66" }}>Chưa tới</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

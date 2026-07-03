import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, History, Send, Tag, Trash2, Plus, ArrowRight } from "lucide-react";
import { getConfig, saveConfig } from "../api";
import type { Config, ConfigSlot, ConfigFragment } from "../types";
import type { AppView } from "../../../app/navigation";

interface ConfigFormPageProps {
  configId: string;
  onNavigate: (view: AppView) => void;
}

export function ConfigFormPage({ configId, onNavigate }: ConfigFormPageProps) {
  const [config, setConfig] = useState<Config | null>(null);
  const [selectedSlotCode, setSelectedSlotCode] = useState<string>("base_rate");

  // Local state for the "Add Fragment" form
  const [draftScopeType, setDraftScopeType] = useState<"default" | "people" | "place" | "time">("default");
  const [draftScopeVal, setDraftScopeVal] = useState("");
  const [draftValue, setDraftValue] = useState("");

  // Local state for the "Resolution Context" inspector (right panel)
  const [ctxSegment, setCtxSegment] = useState("Standard");
  const [ctxPlace, setCtxPlace] = useState("HCM");
  const [ctxTime, setCtxTime] = useState("Hiện tại");

  // Load config on mount or ID change
  useEffect(() => {
    getConfig(configId).then((c) => {
      if (c) {
        setConfig(c);
        // Default to first slot if base_rate is not in slots
        if (c.slots.length > 0 && !c.slots.some((s) => s.code === "base_rate")) {
          setSelectedSlotCode(c.slots[0].code);
        }
      }
    });
  }, [configId]);

  // Priority mapping and metadata
  const CFG_PRIORITY = { default: 0, time: 1, place: 2, people: 3 };
  const CFG_SCOPE_META = {
    default: { label: "Mặc định", short: "null", color: "#5E6F66", bg: "#F1F5F2" },
    people: { label: "People", short: "Borrower Segment", color: "#1F5FAF", bg: "#E5EEF9" },
    place: { label: "Place", short: "Khu vực", color: "#0B7349", bg: "#DCF3E7" },
    time: { label: "Time", short: "Hiệu lực", color: "#9A6B00", bg: "#FBEFC7" },
  };

  // Constraint validation logic
  const validateFragment = (slotCode: string, value: string) => {
    if (slotCode === "base_rate") {
      const m = /([0-9]+(?:[.,][0-9]+)?)/.exec(value);
      if (m) {
        const r = parseFloat(m[1].replace(",", "."));
        if (r > 1.65) return { ok: false, msg: "Vượt trần 1,65%/tháng" };
        if (r > 1.5) return { ok: true, msg: "Gần trần", warn: true };
      }
    }
    if (slotCode === "ltv") {
      const m = /([0-9]+)/.exec(value);
      if (m && parseInt(m[1]) > 80) return { ok: false, msg: "Vượt LTV 80%" };
    }
    return { ok: true, msg: "Hợp lệ", warn: false };
  };

  // Helper functions for updating state and saving config
  const updateConfig = (newSlots: ConfigSlot[]) => {
    if (!config) return;
    const nextConfig = { ...config, slots: newSlots };
    setConfig(nextConfig);
    saveConfig(nextConfig);
  };

  // Add Fragment handler
  const handleAddFragment = () => {
    if (!config) return;
    if (draftScopeType !== "default" && !draftScopeVal.trim()) return;
    if (!draftValue.trim()) return;

    const newSlots = config.slots.map((s) => {
      if (s.code !== selectedSlotCode) return s;

      const newFrag: ConfigFragment = {
        id: `${draftScopeType}:${draftScopeVal || "def"}:${Date.now()}`,
        scopeType: draftScopeType,
        scopeVal: draftScopeType === "default" ? "" : draftScopeVal,
        value: draftValue,
        added: true,
      };

      return {
        ...s,
        fragments: [...s.fragments, newFrag],
      };
    });

    updateConfig(newSlots);
    setDraftValue("");
    setDraftScopeVal("");
  };

  // Remove Fragment handler
  const handleRemoveFragment = (fragId: string) => {
    if (!config) return;
    const newSlots = config.slots.map((s) => {
      if (s.code !== selectedSlotCode) return s;
      return {
        ...s,
        fragments: s.fragments.filter((f) => f.id !== fragId),
      };
    });
    updateConfig(newSlots);
  };

  // Resolution context matcher helper
  const matchesContext = (f: ConfigFragment) => {
    if (f.scopeType === "default") return true;
    if (f.scopeType === "people") return f.scopeVal.toLowerCase() === ctxSegment.toLowerCase();
    if (f.scopeType === "place") {
      return f.scopeVal
        .split(",")
        .map((x) => x.trim().toLowerCase())
        .includes(ctxPlace.toLowerCase());
    }
    if (f.scopeType === "time") return f.scopeVal.toLowerCase() === ctxTime.toLowerCase();
    return false;
  };

  // Compute intermediate lists and metrics
  const computedState = useMemo(() => {
    if (!config) return null;

    // Process all slots
    const processedSlots = config.slots.map((s) => {
      const filled = s.fragments.length > 0;
      return { ...s, filled };
    });

    // Required completeness metrics
    const reqSlots = processedSlots.filter((s) => s.required);
    const reqFilledCount = reqSlots.filter((s) => s.filled).length;
    const totalReq = reqSlots.length;
    const completenessPct = totalReq > 0 ? Math.round((reqFilledCount / totalReq) * 100) : 0;

    // Sidebar groups by block
    const blockOrder = ["Bên tham gia", "Hạn mức", "Lãi suất", "Tài sản đảm bảo", "Trả nợ", "Phạt & Quá hạn"];
    const sidebar = blockOrder.map((blockName) => {
      const groupSlots = processedSlots.filter((s) => s.block === blockName);
      const reqGroup = groupSlots.filter((s) => s.required);
      const filledGroup = reqGroup.filter((s) => s.filled).length;
      return {
        block: blockName,
        count: `${filledGroup}/${reqGroup.length}`,
        complete: filledGroup === reqGroup.length,
        slots: groupSlots.map((s) => {
          const isSelected = s.code === selectedSlotCode;
          const status = !s.required && !s.filled ? "optional" : s.filled ? "filled" : "empty";
          return {
            code: s.code,
            name: s.name,
            required: s.required,
            isSelected,
            status,
          };
        }),
      };
    });

    // Current slot
    const currentSlot = processedSlots.find((s) => s.code === selectedSlotCode) || processedSlots[0];

    // Current slot fragments mapped with validations
    const fragRows = currentSlot.fragments
      .map((f) => {
        const sm = CFG_SCOPE_META[f.scopeType];
        const val = validateFragment(currentSlot.code, f.value);
        const isMatched = matchesContext(f);
        return {
          id: f.id,
          scopeType: f.scopeType,
          scopeVal: f.scopeVal,
          scopeLabel: sm.label,
          scopeShort: f.scopeType === "default" ? "null (áp cho mọi ngữ cảnh)" : `${sm.short} = "${f.scopeVal}"`,
          scopeColor: sm.color,
          scopeBg: sm.bg,
          priority: CFG_PRIORITY[f.scopeType],
          value: f.value,
          validChip: {
            label: val.ok ? (val.warn ? "Cảnh báo" : "Hợp lệ") : "Lỗi",
            bg: val.ok ? (val.warn ? "#FBEFC7" : "#DCF3E7") : "#FBE3E3",
            fg: val.ok ? (val.warn ? "#9A6B00" : "#0B7349") : "#B23B3B",
          },
          valMsg: val.msg,
          matched: isMatched,
          canRemove: !!f.added,
        };
      })
      .sort((a, b) => b.priority - a.priority);

    // Resolution winner logic
    const matchedList = currentSlot.fragments.filter(matchesContext).sort((a, b) => CFG_PRIORITY[b.scopeType] - CFG_PRIORITY[a.scopeType]);
    const winner = matchedList[0] || null;
    const winSm = winner ? CFG_SCOPE_META[winner.scopeType] : null;

    const resolution = winner
      ? {
          value: winner.value,
          scopeLabel: winSm!.label,
          scopeColor: winSm!.color,
          scopeBg: winSm!.bg,
          reason:
            winner.scopeType === "default"
              ? "Không có fragment scope nào khớp ngữ cảnh → dùng giá trị mặc định"
              : `${winSm!.short} = "${winner.scopeVal}" khớp & có ưu tiên cao nhất (${CFG_PRIORITY[winner.scopeType]})`,
          priority: CFG_PRIORITY[winner.scopeType],
        }
      : {
          value: "— chưa cấu hình —",
          scopeLabel: "Trống",
          scopeColor: "#B23B3B",
          scopeBg: "#FBE3E3",
          reason: "Answer Slot bắt buộc nhưng chưa có fragment nào khớp",
          priority: 0,
        };

    // Explain stack rows (ordered by priority)
    const explain = currentSlot.fragments
      .map((f) => {
        const sm = CFG_SCOPE_META[f.scopeType];
        const isMatched = matchesContext(f);
        const isWin = winner ? f.id === winner.id : false;
        return {
          label: f.scopeType === "default" ? "Mặc định" : `${sm.label}: ${f.scopeVal}`,
          value: f.value,
          priority: CFG_PRIORITY[f.scopeType],
          matched: isMatched,
          isWin,
          rowBg: isWin ? "#ECF6F1" : "#fff",
          markColor: isWin ? "#0E8C5A" : isMatched ? "#C2D0C8" : "#E6ECE8",
          mark: isWin ? "★" : isMatched ? "✓" : "·",
        };
      })
      .sort((a, b) => b.priority - a.priority);

    // Missing slots across the config
    const missingReqSlots = processedSlots
      .filter((s) => s.required && !s.filled)
      .map((s) => ({ code: s.code, name: s.name }));

    // Global constraints warnings/errors
    const constraintIssues: Array<{
      slotName: string;
      scope: string;
      value: string;
      msg: string;
      ok: boolean;
      warn: boolean;
      slotCode: string;
      icon: string;
      iconBg: string;
    }> = [];

    processedSlots.forEach((s) => {
      s.fragments.forEach((f) => {
        const val = validateFragment(s.code, f.value);
        if (!val.ok || val.warn) {
          const sm = CFG_SCOPE_META[f.scopeType];
          constraintIssues.push({
            slotName: s.name,
            slotCode: s.code,
            scope: f.scopeType === "default" ? "Mặc định" : `${sm.label} · ${f.scopeVal}`,
            value: f.value,
            msg: val.msg,
            ok: val.ok,
            warn: !!val.warn,
            icon: val.ok ? "!" : "✕",
            iconBg: val.ok ? "#D9893B" : "#B23B3B",
          });
        }
      });
    });

    const errCount = constraintIssues.filter((i) => !i.ok).length;
    const warnCount = constraintIssues.filter((i) => i.ok && i.warn).length;

    const constraintVerdict =
      errCount > 0
        ? { label: `✕ ${errCount} vi phạm ràng buộc Attribute ${warnCount ? `· ${warnCount} cảnh báo` : ""}`, bg: "#FBE3E3", fg: "#B23B3B" }
        : warnCount > 0
        ? { label: `⚠ ${warnCount} cảnh báo ràng buộc — nên rà soát`, bg: "#FBEFC7", fg: "#9A6B00" }
        : { label: "✓ Mọi fragment đạt ràng buộc Attribute", bg: "#DCF3E7", fg: "#0B7349" };

    const reqVerdict =
      missingReqSlots.length > 0
        ? { label: `Còn ${missingReqSlots.length} Answer Slot bắt buộc chưa điền`, bg: "#FBEFC7", fg: "#9A6B00" }
        : { label: `Đã điền đủ ${totalReq} Answer Slot bắt buộc`, bg: "#DCF3E7", fg: "#0B7349" };

    return {
      sidebar,
      completeness: { pct: completenessPct, reqFilled: reqFilledCount, totalReq },
      currentSlot,
      fragRows,
      resolution,
      explain,
      missingReqSlots,
      reqVerdict,
      constraintIssues,
      constraintVerdict,
    };
  }, [config, selectedSlotCode, ctxSegment, ctxPlace, ctxTime]);

  if (!config || !computedState) {
    return <div style={{ padding: 24 }}>Đang tải cấu hình...</div>;
  }

  const { sidebar, completeness, currentSlot, fragRows, resolution, explain, missingReqSlots, reqVerdict, constraintIssues, constraintVerdict } = computedState;

  const defaultFrag = currentSlot.fragments.find((f) => f.scopeType === "default");
  const inheritValue = defaultFrag ? defaultFrag.value : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", animation: "fadeUp .3s ease" }}>
      {/* header */}
      <div
        style={{
          flex: "none",
          background: "#fff",
          borderBottom: "1px solid #E6ECE8",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <button
          onClick={() => onNavigate("config")}
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            border: "1px solid #E6ECE8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#41524A",
            background: "#fff",
            cursor: "pointer",
            flex: "none",
          }}
        >
          <ArrowLeft size={17} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Config · {config.name}</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11.5,
                color: "#8A998F",
                background: "#F1F5F2",
                padding: "2px 7px",
                borderRadius: 6,
              }}
            >
              {config.id}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 10px",
                borderRadius: 99,
                fontSize: 11.5,
                fontWeight: 700,
                background: "#E1ECFB",
                color: "#1F5FAF",
              }}
            >
              ● {config.status === "review" ? "Chờ duyệt" : config.status}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "#8A998F", marginTop: 3, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.3,
                color: "#A7B5AC",
                background: "#F1F5F2",
                padding: "2px 7px",
                borderRadius: 6,
              }}
            >
              ĐẦU VÀO
            </span>{" "}
            Kế thừa từ Template <b style={{ color: "#0B7349", fontWeight: 600 }}>{config.templateId} · {config.templateName}</b>
          </div>
        </div>

        {/* Completeness Ring */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F4F7F5", border: "1px solid #E6ECE8", borderRadius: 9, padding: "6px 12px" }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              flex: "none",
              background: `conic-gradient(#0E8C5A ${completeness.pct}%, #E6ECE8 0)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#122019", lineHeight: 1 }}>{completeness.pct}%</div>
            <div style={{ fontSize: 10.5, color: "#8A998F" }}>
              {completeness.reqFilled}/{completeness.totalReq} slot bắt buộc
            </div>
          </div>
        </div>

        <button
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#41524A",
            border: "1px solid #E6ECE8",
            borderRadius: 9,
            padding: "9px 15px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#fff",
            cursor: "pointer",
          }}
        >
          <History size={15} /> Phiên bản
        </button>
        <button
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#41524A",
            border: "1px solid #E6ECE8",
            borderRadius: 9,
            padding: "9px 15px",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Lưu nháp
        </button>
        <button
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            background: "#0E8C5A",
            borderRadius: 9,
            padding: "9px 17px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            border: "none",
            boxShadow: "0 2px 8px rgba(14,140,90,.3)",
            cursor: "pointer",
          }}
        >
          <Send size={15} /> Trình duyệt
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* LEFT SIDEBAR: Slot list */}
        <div style={{ width: 280, flex: "none", background: "#fff", borderRight: "1px solid #E6ECE8", overflowY: "auto", padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: "#8A998F", marginBottom: 11 }}>
            ANSWER SLOT THEO BLOCK
          </div>
          {sidebar.map((g) => (
            <div key={g.block} style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#243A30",
                  padding: "8px 10px",
                  background: "#F4F7F5",
                  borderRadius: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{g.block}</span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#5E6F66" }}>{g.count}</span>
              </div>
              {g.slots.map((s) => (
                <div
                  key={s.code}
                  onClick={() => setSelectedSlotCode(s.code)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    borderRadius: 8,
                    marginTop: 2,
                    cursor: "pointer",
                    background: s.isSelected ? "#ECF6F1" : "transparent",
                    border: `1px solid ${s.isSelected ? "#CDE9DA" : "transparent"}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: s.isSelected ? 600 : 500,
                      color: s.isSelected ? "#0B7349" : s.status === "empty" ? "#B23B3B" : "#41524A",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.name}
                  </span>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      flex: "none",
                      background: s.status === "filled" ? "#0E8C5A" : s.status === "empty" ? "#E0A0A0" : "#D7E1DB",
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* CENTER PANE: Selected Slot Details & Fragments */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px", background: "#F4F7F5", minWidth: 0 }}>
          {/* Top verdict cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            {/* Required slots verdict */}
            <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, overflow: "hidden" }}>
              <div
                style={{
                  padding: "11px 15px",
                  background: missingReqSlots.length > 0 ? "#FFFBF0" : "#DCF3E7",
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: missingReqSlots.length > 0 ? "#9A6B00" : "#0B7349",
                }}
              >
                Completeness Checklist
              </div>
              <div style={{ padding: "12px 15px" }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#243A30", marginBottom: 9 }}>{reqVerdict.label}</div>
                {missingReqSlots.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {missingReqSlots.map((m) => (
                      <button
                        key={m.code}
                        onClick={() => setSelectedSlotCode(m.code)}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#9A6B00",
                          background: "#FBEFC7",
                          borderRadius: 7,
                          padding: "4px 10px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {m.name} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Constraints validation verdict */}
            <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, overflow: "hidden" }}>
              <div
                style={{
                  padding: "11px 15px",
                  background: constraintVerdict.bg,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: constraintVerdict.fg,
                }}
              >
                Ràng buộc Attribute
              </div>
              <div style={{ padding: "12px 15px" }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#243A30", marginBottom: 9 }}>{constraintVerdict.label}</div>
                {constraintIssues.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, maxH: 100, overflowY: "auto" }}>
                    {constraintIssues.slice(0, 3).map((i) => (
                      <div
                        key={i.slotCode + i.scope}
                        onClick={() => setSelectedSlotCode(i.slotCode)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                          padding: "7px 9px",
                          border: "1px solid #EEF2EF",
                          borderRadius: 8,
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 5,
                            flex: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 800,
                            color: "#fff",
                            background: i.iconBg,
                          }}
                        >
                          {i.icon}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: "#243A30", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {i.slotName} · {i.scope}
                          </div>
                          <div style={{ fontSize: 10.5, color: "#A7B5AC" }}>{i.msg}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current slot description card */}
          <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, padding: "18px 20px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#122019" }}>{currentSlot.name}</span>
                  {currentSlot.required && (
                    <span style={{ fontSize: 10.5, fontWeight: 700, background: "#FBEFC7", color: "#8A6300", padding: "2px 8px", borderRadius: 99 }}>
                      Bắt buộc
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#1F5FAF",
                      background: "#E5EEF9",
                      padding: "3px 9px",
                      borderRadius: 7,
                    }}
                  >
                    <Tag size={12} /> Attribute · {currentSlot.attr}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#2F73C4", background: "#E5EEF9", padding: "3px 9px", borderRadius: 7 }}>
                    {currentSlot.dataType}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#9A6B00", background: "#FBEFC7", padding: "3px 9px", borderRadius: 7 }}>
                    Ràng buộc: {currentSlot.constraint}
                  </span>
                </div>
                {inheritValue && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 9,
                      fontSize: 11,
                      color: "#5E6F66",
                      background: "#F4F7F5",
                      border: "1px dashed #C7D5CC",
                      padding: "4px 10px",
                      borderRadius: 7,
                    }}
                  >
                    Kế thừa giá trị khung từ Template: <b style={{ color: "#0B7349", fontWeight: 600 }}>{inheritValue}</b>
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right", flex: "none" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0B7349" }}>{currentSlot.fragments.length}</div>
                <div style={{ fontSize: 10.5, color: "#A7B5AC", fontWeight: 600 }}>FRAGMENT</div>
              </div>
            </div>
          </div>

          {/* Add Fragment Form */}
          <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, padding: "16px 18px", marginBottom: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#122019", marginBottom: 11 }}>Thêm Config Fragment</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "#5E6F66", marginBottom: 7 }}>Loại Selector Scope</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 13 }}>
              {(["default", "people", "place", "time"] as const).map((t) => {
                const active = draftScopeType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setDraftScopeType(t)}
                    style={{
                      padding: "7px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: active ? 700 : 500,
                      color: active ? "#fff" : "#41524A",
                      background: active ? "#0E8C5A" : "#F1F5F2",
                      border: active ? "none" : "1px solid #E6ECE8",
                      cursor: "pointer",
                    }}
                  >
                    {CFG_SCOPE_META[t].label}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              {draftScopeType !== "default" && (
                <div style={{ flex: 1.2 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#5E6F66", display: "block", marginbottom: 5 }}>Giá trị Scope</label>
                  <input
                    value={draftScopeVal}
                    onChange={(e) => setDraftScopeVal(e.target.value)}
                    placeholder={
                      draftScopeType === "people"
                        ? "VD: Loyalty, VIP"
                        : draftScopeType === "place"
                        ? "VD: HCM, HN"
                        : "VD: Khuyến mãi Tết"
                    }
                    style={{ border: "1px solid #E0E7E2", borderRadius: 8, padding: "9px 11px", fontSize: 13, width: "100%", outline: "none" }}
                  />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#5E6F66", display: "block", marginbottom: 5 }}>Giá trị gán</label>
                <input
                  value={draftValue}
                  onChange={(e) => setDraftValue(e.target.value)}
                  placeholder="VD: 1.2%/tháng, 80%..."
                  style={{ border: "1px solid #E0E7E2", borderRadius: 8, padding: "9px 11px", fontSize: 13, width: "100%", outline: "none" }}
                />
              </div>
              <button
                onClick={handleAddFragment}
                style={{
                  flex: "none",
                  background: "#0E8C5A",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "10px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Plus size={14} /> Thêm
              </button>
            </div>
          </div>

          {/* Fragments Table */}
          <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, padding: "6px 18px 14px" }}>
            <div style={{ display: "table", borderCollapse: "collapse", width: "100%" }}>
              <div style={{ display: "table-header-group" }}>
                <div style={{ display: "table-row" }}>
                  <div style={{ display: "table-cell", textAlign: "center", fontSize: 11, fontWeight: 700, color: "#8A998F", letterSpacing: 0.4, padding: "12px 8px", borderBottom: "1px solid #EEF2EF", width: 60 }}>
                    ƯU TIÊN
                  </div>
                  <div style={{ display: "table-cell", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8A998F", letterSpacing: 0.4, padding: "12px 10px", borderBottom: "1px solid #EEF2EF" }}>
                    SELECTOR SCOPE
                  </div>
                  <div style={{ display: "table-cell", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8A998F", letterSpacing: 0.4, padding: "12px 10px", borderBottom: "1px solid #EEF2EF" }}>
                    GIÁ TRỊ
                  </div>
                  <div style={{ display: "table-cell", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8A998F", letterSpacing: 0.4, padding: "12px 10px", borderBottom: "1px solid #EEF2EF", width: 130 }}>
                    RÀNG BUỘC
                  </div>
                  <div style={{ display: "table-cell", borderBottom: "1px solid #EEF2EF", width: 38 }}></div>
                </div>
              </div>
              <div style={{ display: "table-row-group" }}>
                {fragRows.map((f) => (
                  <div key={f.id} style={{ display: "table-row", borderBottom: "1px solid #F1F5F2" }}>
                    <div style={{ display: "table-cell", padding: "13px 8px", textAlign: "center", verticalAlign: "middle" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 8, background: "#F1F5F2", fontSize: 12.5, fontWeight: 800, color: "#5E6F66" }}>
                        {f.priority}
                      </span>
                    </div>
                    <div style={{ display: "table-cell", padding: "13px 10px", verticalAlign: "middle" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: f.scopeColor, background: f.scopeBg, padding: "3px 9px", borderRadius: 7 }}>
                        {f.scopeLabel}
                      </span>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8A998F", marginTop: 4 }}>{f.scopeShort}</div>
                    </div>
                    <div style={{ display: "table-cell", padding: "13px 10px", fontSize: 13, fontWeight: 700, color: "#0B7349", verticalAlign: "middle" }}>
                      {f.value}
                    </div>
                    <div style={{ display: "table-cell", padding: "13px 10px", verticalAlign: "middle" }}>
                      <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, background: f.validChip.bg, color: f.validChip.fg, padding: "3px 9px", borderRadius: 99 }}>
                        {f.validChip.label}
                      </span>
                      <div style={{ fontSize: 10.5, color: "#A7B5AC", marginTop: 3 }}>{f.valMsg}</div>
                    </div>
                    <div style={{ display: "table-cell", padding: "13px 6px", textAlign: "center", verticalAlign: "middle" }}>
                      {f.canRemove && (
                        <button
                          onClick={() => handleRemoveFragment(f.id)}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 7,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#C2A0A0",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: Resolution & Context preview */}
        <div style={{ width: 330, flex: "none", background: "#fff", borderLeft: "1px solid #E6ECE8", overflowY: "auto", minHeight: 0 }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #EEF2EF" }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#122019" }}>Xem trước Resolution</div>
            <div style={{ fontSize: 11.5, color: "#8A998F", marginTop: 3 }}>
              Chọn ngữ cảnh để xem giá trị Answer Slot được resolve theo Selector Scope
            </div>
          </div>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #EEF2EF", display: "flex", flexDirection: "column", gap: 13 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#1F5FAF", display: "block", marginBottom: 6 }}>
                PEOPLE · Borrower Segment
              </label>
              <select
                value={ctxSegment}
                onChange={(e) => setCtxSegment(e.target.value)}
                style={{ width: "100%", border: "1px solid #E0E7E2", borderRadius: 8, padding: "9px 11px", fontSize: 13, outline: "none", background: "#fff" }}
              >
                <option value="Standard">Standard</option>
                <option value="Loyalty">Loyalty</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#0B7349", display: "block", marginBottom: 6 }}>
                PLACE · Khu vực
              </label>
              <select
                value={ctxPlace}
                onChange={(e) => setCtxPlace(e.target.value)}
                style={{ width: "100%", border: "1px solid #E0E7E2", borderRadius: 8, padding: "9px 11px", fontSize: 13, outline: "none", background: "#fff" }}
              >
                <option value="HCM">HCM</option>
                <option value="HN">HN</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#9A6B00", display: "block", marginBottom: 6 }}>
                TIME · Thời điểm hiệu lực
              </label>
              <select
                value={ctxTime}
                onChange={(e) => setCtxTime(e.target.value)}
                style={{ width: "100%", border: "1px solid #E0E7E2", borderRadius: 8, padding: "9px 11px", fontSize: 13, outline: "none", background: "#fff" }}
              >
                <option value="Hiện tại">Hiện tại</option>
                <option value="Khuyến mãi Tết">Khuyến mãi Tết</option>
              </select>
            </div>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: "#8A998F", marginBottom: 10 }}>
              GIÁ TRỊ RESOLVE
            </div>
            <div style={{ border: "1.5px solid #CDE9DA", borderRadius: 12, padding: 16, background: "#F4FBF7", marginBottom: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0B7349", letterSpacing: -0.5 }}>{resolution.value}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 9 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: resolution.scopeColor, background: resolution.scopeBg, padding: "3px 9px", borderRadius: 7 }}>
                  Thắng: {resolution.scopeLabel}
                </span>
                <span style={{ fontSize: 11, color: "#8A998F" }}>ưu tiên {resolution.priority}</span>
              </div>
              <div style={{ fontSize: 11.5, color: "#5E6F66", marginTop: 10, lineHeight: 1.5 }}>{resolution.reason}</div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: "#8A998F", margin: "16px 0 9px" }}>
              CÁCH RESOLVE (★ = thắng)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {explain.map((e, idx) => (
                <div
                  key={e.label + idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 11px",
                    border: "1px solid #EEF2EF",
                    borderRadius: 9,
                    background: e.rowBg,
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      flex: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#fff",
                      background: e.markColor,
                    }}
                  >
                    {e.mark}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#243A30", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {e.label}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0B7349", flex: "none" }}>{e.value}</span>
                  <span style={{ fontSize: 10, color: "#A7B5AC", flex: "none" }}>p{e.priority}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate("simulation")}
              style={{
                marginTop: 16,
                width: "100%",
                border: "1.5px solid #0E8C5A",
                color: "#0B7349",
                borderRadius: 9,
                padding: 11,
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Mô phỏng với cấu hình này <ArrowRight size={14} />
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  History,
  Eye,
  Send,
  Search,
  GripVertical,
  Blocks as BlocksIcon,
  Tag,
  Trash2,
  Plus,
  X,
  LayoutGrid,
} from "lucide-react";
import { BLOCKS, OTS, OT_BLOCK_MATRIX, COVER_COLS } from "../mockData";
import type { AppView } from "../../../app/navigation";
import type { CoverageRow, CoverageVerdict } from "../types";

interface BuilderPageProps {
  entity: "pattern" | "template";
  onNavigate: (view: AppView) => void;
}

export function BuilderPage({ entity, onNavigate }: BuilderPageProps) {
  // Tabs for left palette: 'block' | 'ot'
  const [paletteTab, setPaletteTab] = useState<"block" | "ot">("block");
  // Search query for block palette
  const [paletteQuery, setPaletteQuery] = useState("");
  // Selected Obligation Types (array of OT IDs)
  const [selectedOT, setSelectedOT] = useState<string[]>(["OT_PLEDGE_INSTALLMENT"]);
  // Canvas: list of block IDs currently in the canvas
  const [canvas, setCanvas] = useState<string[]>([
    "BLK_COUNTERPARTY",
    "BLK_INTEREST",
    "BLK_COLLATERAL",
    "BLK_REPAYMENT",
    "BLK_PENALTY",
  ]);
  // Selected block ID (for inspection panel)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>("BLK_INTEREST");
  // Dragged block ID (for HTML5 drag-and-drop)
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dropActive, setDropActive] = useState(false);

  const isT = entity === "template";
  const builderTitle = isT ? "Vay hạn mức cầm cố · KH cá nhân" : "Khuôn vay tiêu dùng có hạn mức";
  const builderCode = isT ? "TPL-003" : "PT-002";
  const builderEntityLabel = isT ? "Product Template" : "Product Pattern";

  // Palette blocks filtered by query
  const filteredBlocks = useMemo(() => {
    const q = paletteQuery.toLowerCase();
    return BLOCKS.filter((b) => !q || b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q));
  }, [paletteQuery]);

  // Handle adding block to canvas
  const addBlock = (id: string) => {
    if (!canvas.includes(id)) {
      setCanvas((prev) => [...prev, id]);
      setSelectedBlockId(id);
    } else {
      setSelectedBlockId(id);
    }
  };

  // Handle removing block from canvas
  const removeBlock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCanvas((prev) => {
      const next = prev.filter((x) => x !== id);
      if (selectedBlockId === id) {
        setSelectedBlockId(next[next.length - 1] || null);
      }
      return next;
    });
  };

  // Toggle OT
  const toggleOT = (id: string) => {
    setSelectedOT((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Drag and drop handlers
  const handleDragStart = (id: string) => {
    setDraggedBlockId(id);
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dropActive) setDropActive(true);
  };

  const handleCanvasDragLeave = () => {
    if (dropActive) setDropActive(false);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropActive(false);
    if (draggedBlockId) {
      addBlock(draggedBlockId);
      setDraggedBlockId(null);
    }
  };

  // Calculate block coverage according to assigned OTs
  const blockCoverage = useMemo(() => {
    const rank = { no: 0, pos: 1, req: 2 };
    const rows: CoverageRow[] = COVER_COLS.map((c, ci) => {
      let agg: "req" | "pos" | "no" = "no";
      selectedOT.forEach((otId) => {
        const row = OT_BLOCK_MATRIX[otId];
        if (row) {
          const itemVal = row[ci] as "req" | "pos" | "no";
          if (rank[itemVal] > rank[agg]) {
            agg = itemVal;
          }
        }
      });

      const inCanvas = canvas.includes(c.blockId);
      let status: "covered" | "missing" | "covered-opt" | "suggest" | "na" = "na";
      if (agg === "req") status = inCanvas ? "covered" : "missing";
      else if (agg === "pos") status = inCanvas ? "covered-opt" : "suggest";
      else status = "na";

      const M = {
        covered: { label: "Bắt buộc · đã có", bg: "#DCF3E7", fg: "#0B7349", dot: "#0E8C5A", mark: "✓" },
        missing: { label: "Bắt buộc · THIẾU", bg: "#FBE3E3", fg: "#B23B3B", dot: "#B23B3B", mark: "!" },
        "covered-opt": { label: "Tùy chọn · đã có", bg: "#E5EEF9", fg: "#2F73C4", dot: "#2F73C4", mark: "✓" },
        suggest: { label: "Tùy chọn", bg: "#F1F5F2", fg: "#8A998F", dot: "#C2D0C8", mark: "+" },
        na: { label: "Không áp dụng", bg: "#F4F7F5", fg: "#B8C5BD", dot: "#E0E7E2", mark: "–" },
      }[status];

      return {
        key: c.key,
        label: c.label,
        blockId: c.blockId,
        status,
        agg,
        inCanvas,
        chipLabel: M.label,
        chipBg: M.bg,
        chipFg: M.fg,
        dot: M.dot,
        mark: M.mark,
        showAdd: status === "missing" || status === "suggest",
      };
    }).filter((r) => r.status !== "na");

    const missing = rows.filter((r) => r.status === "missing");
    const reqTotal = rows.filter((r) => r.agg === "req").length;
    const reqCovered = rows.filter((r) => r.agg === "req" && r.inCanvas).length;

    const verdict: CoverageVerdict =
      selectedOT.length === 0
        ? { label: "Chưa gán Obligation Type — gán trước để kiểm tra độ phủ", bg: "#FEF3D6", fg: "#9A6B00", ok: false }
        : missing.length > 0
        ? { label: `⚠ Thiếu ${missing.length} Block bắt buộc theo ma trận`, bg: "#FBE3E3", fg: "#B23B3B", ok: false }
        : { label: "✓ Đủ Block bắt buộc theo ma trận Obligation Type × Block", bg: "#DCF3E7", fg: "#0B7349", ok: true };

    return { rows, missing, reqTotal, reqCovered, verdict, pctLabel: `${reqCovered}/${reqTotal}` };
  }, [selectedOT, canvas]);

  // Selected block detail (for inspector)
  const selectedBlock = useMemo(() => {
    return BLOCKS.find((b) => b.id === selectedBlockId) || null;
  }, [selectedBlockId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", animation: "fadeUp .3s ease" }}>
      {/* builder sub-header */}
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
          onClick={() => onNavigate(isT ? "template" : "pattern")}
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
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#122019" }}>{builderTitle}</span>
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
              {builderCode}
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
                background: "#FEF3D6",
                color: "#9A6B00",
              }}
            >
              ● Bản nháp
            </span>
          </div>
          <div style={{ fontSize: 12, color: "#8A998F", marginTop: 3 }}>
            {builderEntityLabel} ·{" "}
            <button
              style={{
                fontSize: 12,
                color: "#0E8C5A",
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: 2,
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              phiên bản v0.3
            </button>{" "}
            · từ Product Intent{" "}
            <b style={{ color: "#0B7349", fontWeight: 600 }}>PI-003 · Cho vay tiêu dùng có hạn mức</b>
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
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#fff",
            cursor: "pointer",
          }}
        >
          <Eye size={15} /> Xem trước
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
          <Send size={15} /> Gửi duyệt
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* LEFT PALETTE */}
        <div
          style={{
            width: 288,
            flex: "none",
            background: "#fff",
            borderRight: "1px solid #E6ECE8",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <div style={{ padding: "14px 16px 0", flex: "none" }}>
            <div style={{ display: "flex", background: "#F1F5F2", borderRadius: 9, padding: 3, marginBottom: 13 }}>
              <button
                onClick={() => setPaletteTab("block")}
                style={{
                  flex: 1,
                  border: "none",
                  borderRadius: 7,
                  padding: "7px 0",
                  fontSize: 12.5,
                  fontWeight: paletteTab === "block" ? 700 : 500,
                  background: paletteTab === "block" ? "#fff" : "transparent",
                  color: paletteTab === "block" ? "#0B3B2E" : "#5E6F66",
                  boxShadow: paletteTab === "block" ? "0 1px 3px rgba(0,0,0,.08)" : "none",
                  cursor: "pointer",
                }}
              >
                Block
              </button>
              <button
                onClick={() => setPaletteTab("ot")}
                style={{
                  flex: 1,
                  border: "none",
                  borderRadius: 7,
                  padding: "7px 0",
                  fontSize: 12.5,
                  fontWeight: paletteTab === "ot" ? 700 : 500,
                  background: paletteTab === "ot" ? "#fff" : "transparent",
                  color: paletteTab === "ot" ? "#0B3B2E" : "#5E6F66",
                  boxShadow: paletteTab === "ot" ? "0 1px 3px rgba(0,0,0,.08)" : "none",
                  cursor: "pointer",
                }}
              >
                Obligation Type
              </button>
            </div>
          </div>

          {/* Block palette */}
          {paletteTab === "block" && (
            <>
              <div style={{ padding: "0 16px 6px", flex: "none" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#F4F7F5",
                    border: "1px solid #E6ECE8",
                    borderRadius: 8,
                    padding: "7px 10px",
                  }}
                >
                  <Search size={16} color="#8A998F" style={{ display: "flex", flex: "none" }} />
                  <input
                    value={paletteQuery}
                    onChange={(e) => setPaletteQuery(e.target.value)}
                    placeholder="Tìm block…"
                    style={{ border: "none", background: "none", outline: "none", fontSize: 12.5, width: "100%" }}
                  />
                </div>
                <div style={{ fontSize: 11, color: "#A7B5AC", margin: "11px 2px 6px", fontWeight: 600, letterSpacing: 0.3 }}>
                  KÉO BLOCK VÀO CẤU TRÚC →
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredBlocks.map((b) => {
                  const inC = canvas.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      draggable
                      onDragStart={() => handleDragStart(b.id)}
                      onClick={() => addBlock(b.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 10px",
                        border: `1px solid ${inC ? "#CDE9DA" : "#E6ECE8"}`,
                        borderRadius: 10,
                        background: inC ? "#F4FBF7" : "#fff",
                        cursor: "grab",
                      }}
                    >
                      <span style={{ display: "flex", color: "#A7B5AC", flex: "none", cursor: "grab" }}>
                        <GripVertical size={14} />
                      </span>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: "#ECF6F1",
                          color: "#0B7349",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flex: "none",
                        }}
                      >
                        <BlocksIcon size={16} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#243A30", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {b.name}
                        </div>
                        <div style={{ fontSize: 10.5, color: "#A7B5AC", marginTop: 1 }}>
                          {b.group} · {b.slots.length} slot
                        </div>
                      </div>
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 7,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 700,
                          flex: "none",
                          background: inC ? "#DCF3E7" : "#F1F5F2",
                          color: inC ? "#0B7349" : "#5E6F66",
                        }}
                      >
                        {inC ? "✓" : "+"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* OT palette */}
          {paletteTab === "ot" && (
            <>
              <div style={{ padding: "0 16px 10px", flex: "none" }}>
                <div style={{ fontSize: 11, color: "#A7B5AC", margin: "4px 2px 0", fontWeight: 600, letterSpacing: 0.3 }}>
                  GÁN OBLIGATION TYPE VÀO KHUÔN
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 9 }}>
                {OTS.map((o) => {
                  const on = selectedOT.includes(o.id);
                  return (
                    <div
                      key={o.id}
                      onClick={() => toggleOT(o.id)}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        padding: 12,
                        border: `1px solid ${on ? "#9ED9BC" : "#E6ECE8"}`,
                        borderRadius: 11,
                        background: on ? "#F4FBF7" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#243A30" }}>{o.name}</div>
                        <div style={{ fontSize: 10.5, color: "#8A998F", marginTop: 3, display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{o.code}</span>
                        </div>
                        <div style={{ marginTop: 7 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 600, color: "#9A6B00", background: "#FBEFC7", padding: "2px 8px", borderRadius: 99 }}>
                            Archetype: {o.archetype}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 7,
                          flex: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          border: `1.5px solid ${on ? "#0E8C5A" : "#D7E1DB"}`,
                          background: on ? "#0E8C5A" : "#fff",
                          color: "#fff",
                        }}
                      >
                        {on ? "✓" : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* CENTER CANVAS */}
        <div
          onDragOver={handleCanvasDragOver}
          onDragLeave={handleCanvasDragLeave}
          onDrop={handleCanvasDrop}
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
            padding: "22px 26px",
            background: dropActive ? "#ECFBF3" : "#F4F7F5",
            transition: "background .2s",
          }}
        >
          {/* assigned OT zone */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: "#8A998F", marginBottom: 9 }}>
              OBLIGATION TYPE ĐÃ GÁN
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {OTS.filter((o) => selectedOT.includes(o.id)).map((o) => (
                <div
                  key={o.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "#fff",
                    border: "1px solid #B7E6CE",
                    borderRadius: 10,
                    padding: "9px 11px 9px 13px",
                    boxShadow: "0 1px 2px rgba(11,59,46,.04)",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0E8C5A", flex: "none" }} />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "#243A30" }}>{o.name}</div>
                    <div style={{ fontSize: 10.5, color: "#8A998F", marginTop: 1 }}>
                      {o.role} · {o.archetype}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleOT(o.id)}
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
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setPaletteTab("ot")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  border: "1.5px dashed #C2D0C8",
                  borderRadius: 10,
                  padding: "9px 14px",
                  color: "#5E6F66",
                  fontSize: 12.5,
                  fontWeight: 600,
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <Plus size={15} /> Gán thêm
              </button>
            </div>
          </div>

          {/* block coverage vs OT×Block matrix */}
          <div style={{ marginBottom: 20, background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 16px",
                background: blockCoverage.verdict.bg,
              }}
            >
              <LayoutGrid size={15} color={blockCoverage.verdict.fg} style={{ display: "flex", flex: "none" }} />
              <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: blockCoverage.verdict.fg }}>
                {blockCoverage.verdict.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: blockCoverage.verdict.fg,
                  background: "rgba(255,255,255,.5)",
                  padding: "2px 9px",
                  borderRadius: 99,
                }}
              >
                Bắt buộc {blockCoverage.pctLabel}
              </span>
            </div>
            <div style={{ padding: "8px 16px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
              {blockCoverage.rows.map((c) => (
                <div
                  key={c.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    padding: "9px 11px",
                    border: "1px solid #EEF2EF",
                    borderRadius: 9,
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
                      background: c.dot,
                    }}
                  >
                    {c.mark}
                  </span>
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: "#243A30" }}>{c.label}</span>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: c.chipFg,
                      background: c.chipBg,
                      padding: "3px 9px",
                      borderRadius: 99,
                    }}
                  >
                    {c.chipLabel}
                  </span>
                  {c.showAdd && (
                    <button
                      onClick={() => addBlock(c.blockId)}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#0B7349",
                        background: "#DCF3E7",
                        borderRadius: 7,
                        padding: "5px 11px",
                        border: "none",
                        cursor: "pointer",
                        flex: "none",
                      }}
                    >
                      + Thêm Block
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* structure canvas */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: "#8A998F" }}>
              CẤU TRÚC BLOCK · {canvas.length} block
            </div>
            <div style={{ fontSize: 11.5, color: "#A7B5AC" }}>Kéo để sắp xếp · click để xem chi tiết</div>
          </div>
          <div
            style={{
              border: "2px dashed #CDE9DA",
              borderRadius: 13,
              padding: 16,
              background: "#fff",
              minHeight: 120,
            }}
          >
            {canvas.map((blockId) => {
              const b = BLOCKS.find((x) => x.id === blockId);
              if (!b) return null;
              const seld = selectedBlockId === b.id;
              const reqd = b.slots.some((s) => s.req);
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBlockId(b.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "13px 14px",
                    borderRadius: 12,
                    background: "#fff",
                    border: `1.5px solid ${seld ? "#0E8C5A" : "#E6ECE8"}`,
                    boxShadow: seld ? "0 4px 14px rgba(14,140,90,.14)" : "0 1px 2px rgba(11,59,46,.04)",
                    cursor: "pointer",
                    marginBottom: 10,
                  }}
                >
                  <span style={{ display: "flex", color: "#C2D0C8", flex: "none", cursor: "grab" }}>
                    <GripVertical size={14} />
                  </span>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: seld ? "#0E8C5A" : "#ECF6F1",
                      color: seld ? "#fff" : "#0B7349",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "none",
                    }}
                  >
                    <BlocksIcon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "#243A30" }}>{b.name}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#A7B5AC" }}>{b.code}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "#8A998F", marginTop: 3 }}>
                      {b.slots.length} answer slot · {b.slots.slice(0, 2).map((s) => s.name).join(", ")}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      padding: "3px 9px",
                      borderRadius: 99,
                      flex: "none",
                      background: reqd ? "#FBEFC7" : "#EEF1EF",
                      color: reqd ? "#8A6300" : "#5E6F66",
                    }}
                  >
                    {reqd ? "Bắt buộc" : "Tùy chọn"}
                  </span>
                  <button
                    onClick={(e) => removeBlock(b.id, e)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#C2A0A0",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      flex: "none",
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                padding: 16,
                border: "1.5px dashed #C7D5CC",
                borderRadius: 11,
                color: "#A7B5AC",
                fontSize: 12.5,
                fontWeight: 500,
                marginTop: 2,
              }}
            >
              <Plus size={15} /> Chọn block từ thư viện bên trái để lắp ráp cấu trúc
            </div>
          </div>
        </div>

        {/* RIGHT PROPERTIES */}
        <div
          style={{
            width: 340,
            flex: "none",
            background: "#fff",
            borderLeft: "1px solid #E6ECE8",
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          {selectedBlock ? (
            <>
              <div style={{ padding: "18px 20px", borderBottom: "1px solid #EEF2EF" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: "#8A998F", marginBottom: 8 }}>
                  THUỘC TÍNH BLOCK
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "#ECF6F1",
                      color: "#0B7349",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "none",
                    }}
                  >
                    <BlocksIcon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: "#122019" }}>{selectedBlock.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8A998F", marginTop: 2 }}>
                      {selectedBlock.code}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "#8A998F" }}>Nhóm nghiệp vụ</span>
                    <span style={{ fontWeight: 600, color: "#243A30" }}>{selectedBlock.group}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "#8A998F" }}>Chi phối bởi Obligation Element</span>
                    <span style={{ fontWeight: 600, color: "#0B7349", textAlign: "right", maxWidth: 170 }}>
                      {selectedBlock.gov}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#122019" }}>Answer Slots</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#0B7349",
                      background: "#DCF3E7",
                      padding: "2px 9px",
                      borderRadius: 99,
                    }}
                  >
                    {selectedBlock.slots.length} slot
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {selectedBlock.slots.map((s) => (
                    <div key={s.code} style={{ border: "1px solid #EEF2EF", borderRadius: 10, padding: "11px 12px", background: "#FBFDFC" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#243A30" }}>{s.name}</span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 99,
                            background: s.req ? "#FBEFC7" : "#EEF1EF",
                            color: s.req ? "#8A6300" : "#5E6F66",
                          }}
                        >
                          {s.req ? "Bắt buộc" : "Tùy chọn"}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10.5, fontWeight: 600, color: "#2F73C4", background: "#E5EEF9", padding: "2px 8px", borderRadius: 6 }}>
                          {s.type}
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#A7B5AC" }}>{s.code}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: "#5E6F66", marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#A7B5AC" }}>Mặc định</span>
                        <span style={{ fontWeight: 500, textAlign: "right" }}>{s.def}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#8A998F", marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#A7B5AC" }}>Ràng buộc</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9A6B00" }}>{s.rule}</span>
                      </div>
                      <div style={{ marginTop: 9, paddingTop: 9, borderTop: "1px dashed #E6ECE8", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ display: "flex", color: "#1F5FAF", flex: "none" }}>
                          <Tag size={14} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.3, color: "#A7B5AC" }}>
                            ĐỊNH NGHĨA BỞI ATTRIBUTE
                          </div>
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: "#1F5FAF", marginTop: 1 }}>{s.name}</div>
                        </div>
                        <button
                          style={{
                            fontSize: 10.5,
                            fontWeight: 600,
                            color: "#1F5FAF",
                            background: "#E5EEF9",
                            padding: "3px 9px",
                            borderRadius: 7,
                            border: "none",
                            cursor: "pointer",
                            flex: "none",
                          }}
                        >
                          Mở →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  style={{
                    marginTop: 13,
                    width: "100%",
                    border: "1.5px dashed #C2D0C8",
                    borderRadius: 9,
                    padding: 10,
                    color: "#5E6F66",
                    fontSize: 12.5,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <Plus size={15} /> Thêm Answer Slot
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: "60px 30px", textAlign: "center", color: "#A7B5AC" }}>
              <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
                <BlocksIcon size={34} color="#C7D5CC" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#5E6F66" }}>Chọn một block</div>
              <div style={{ fontSize: 12, marginTop: 5 }}>Click vào block trong cấu trúc để xem &amp; chỉnh answer slot</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

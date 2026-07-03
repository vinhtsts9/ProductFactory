import { useState } from "react";
import { LayoutTemplate, Lock, Search } from "lucide-react";
import { useTemplates } from "../hooks";
import type { ProductStatus, Template } from "../types";

const statusConfig: Record<ProductStatus, { label: string; bg: string; fg: string }> = {
  draft: { label: "Bản nháp", bg: "#F1F5F2", fg: "#5E6F66" },
  review: { label: "Đang duyệt", bg: "#FEF3D6", fg: "#9A6B00" },
  approved: { label: "Đã duyệt", bg: "#DCF3E7", fg: "#0B7349" },
  published: { label: "Đã xuất bản", bg: "#E5EEF9", fg: "#2F73C4" },
  retired: { label: "Ngưng", bg: "#FBE3E3", fg: "#B23B3B" },
};

export function TemplatePage() {
  const { data, isLoading, error } = useTemplates();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ProductStatus | "all">("all");

  if (isLoading) return <div style={{ padding: 24 }}>Đang tải...</div>;
  if (error || !data) return <div style={{ padding: 24 }}>Không tải được dữ liệu.</div>;

  const items = data.items.filter((item) => {
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = data.items.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div style={{ padding: "24px 26px", maxWidth: 1500, animation: "fadeUp .3s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#122019" }}>Product Template</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#5E6F66" }}>
          Khung sản phẩm — thiết lập giá trị khung và khoá block từ pattern
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        {(["draft", "review", "approved", "published"] as ProductStatus[]).map((s) => {
          const cfg = statusConfig[s];
          return (
            <div
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                background: filterStatus === s ? cfg.bg : "#fff",
                border: `1px solid ${filterStatus === s ? cfg.fg + "40" : "#E6ECE8"}`,
                cursor: "pointer",
                transition: "all .15s",
                minWidth: 100,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: cfg.fg }}>{statusCounts[s] || 0}</div>
              <div style={{ fontSize: 11.5, color: cfg.fg, fontWeight: 500, marginTop: 2 }}>{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
          background: "#fff",
          border: "1px solid #E6ECE8",
          borderRadius: 9,
          padding: "8px 14px",
        }}
      >
        <Search size={16} color="#8A998F" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc mã template..."
          style={{ border: "none", outline: "none", background: "none", fontSize: 13, flex: 1, color: "#122019" }}
        />
        <span style={{ fontSize: 11, color: "#8A998F" }}>{items.length} / {data.total} kết quả</span>
      </div>

      {/* Table */}
      <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, overflow: "hidden" }}>
        <table>
          <thead>
            <tr style={{ borderBottom: "2px solid #E6ECE8" }}>
              {["Mã", "Tên", "Pattern", "Audience", "Frames", "Locked Blocks", "Trạng thái"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#5E6F66",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <TemplateRow key={item.id} item={item} />
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#8A998F", fontSize: 13 }}>
                  Không tìm thấy Template nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function TemplateRow({ item }: { item: Template }) {
  const cfg = statusConfig[item.status];

  return (
    <tr style={{ borderBottom: "1px solid #F1F5F2" }}>
      <td style={{ padding: "13px 16px" }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "#0E8C5A",
            fontWeight: 600,
            background: "#DCF3E7",
            padding: "2px 8px",
            borderRadius: 5,
          }}
        >
          {item.id}
        </span>
      </td>
      <td style={{ padding: "13px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "#FBEFC7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
            }}
          >
            <LayoutTemplate size={14} color="#8A6300" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#122019" }}>{item.name}</div>
            <div style={{ fontSize: 11, color: "#8A998F", marginTop: 1 }}>Audience: {item.audience}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: "13px 16px" }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#8A998F",
            background: "#F1F5F2",
            padding: "2px 7px",
            borderRadius: 4,
          }}
        >
          {item.patternId}
        </span>
      </td>
      <td style={{ padding: "13px 16px" }}>
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 500,
            color: "#41524A",
            background: "#F1F5F2",
            padding: "2px 8px",
            borderRadius: 5,
          }}
        >
          {item.audience}
        </span>
      </td>
      <td style={{ padding: "13px 16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {item.frames.slice(0, 2).map((frame) => (
            <span key={frame.slotCode} style={{ fontSize: 11, color: "#41524A" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#5E6F66" }}>{frame.slotCode}</span>:{" "}
              <b style={{ fontWeight: 600 }}>{frame.defaultValue}</b>
            </span>
          ))}
          {item.frames.length > 2 && (
            <span style={{ fontSize: 10, color: "#8A998F" }}>+{item.frames.length - 2} khác</span>
          )}
        </div>
      </td>
      <td style={{ padding: "13px 16px" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {item.lockedBlockIds.length === 0 ? (
            <span style={{ fontSize: 11, color: "#8A998F", fontStyle: "italic" }}>Không khoá</span>
          ) : (
            item.lockedBlockIds.map((blockId) => (
              <span
                key={blockId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 10,
                  background: "#FEF3D6",
                  color: "#9A6B00",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                <Lock size={9} />
                {blockId.replace("BLK_", "")}
              </span>
            ))
          )}
        </div>
      </td>
      <td style={{ padding: "13px 16px" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 99,
            background: cfg.bg,
            color: cfg.fg,
          }}
        >
          {cfg.label}
        </span>
      </td>
    </tr>
  );
}

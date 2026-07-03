import { useState } from "react";
import { Plus, Route, Search } from "lucide-react";
import { useProductIntents } from "../hooks";
import type { ProductIntent, ProductStatus } from "../types";
import { ProductIntentWizard } from "./ProductIntentWizard";

const statusConfig: Record<ProductStatus, { label: string; bg: string; fg: string }> = {
  draft: { label: "Bản nháp", bg: "#F1F5F2", fg: "#5E6F66" },
  review: { label: "Đang duyệt", bg: "#FEF3D6", fg: "#9A6B00" },
  approved: { label: "Đã duyệt", bg: "#DCF3E7", fg: "#0B7349" },
  published: { label: "Đã xuất bản", bg: "#E5EEF9", fg: "#2F73C4" },
  retired: { label: "Ngưng", bg: "#FBE3E3", fg: "#B23B3B" },
};

export function ProductIntentPage() {
  const { data, isLoading, error } = useProductIntents();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ProductStatus | "all">("all");
  const [wizardOpen, setWizardOpen] = useState(false);

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#122019" }}>Product Intent</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#5E6F66" }}>
            Ý định sản phẩm — cụ thể hoá Business Intent thành thiết kế sản phẩm
          </p>
        </div>
        <button
          onClick={() => setWizardOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "linear-gradient(135deg,#14B870,#0E8C5A)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            padding: "9px 18px",
            borderRadius: 9,
            boxShadow: "0 2px 8px rgba(14,140,90,.3)",
          }}
        >
          <Plus size={16} />
          Tạo Product Intent
        </button>
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
          placeholder="Tìm theo tên hoặc mã..."
          style={{ border: "none", outline: "none", background: "none", fontSize: 13, flex: 1, color: "#122019" }}
        />
        <span style={{ fontSize: 11, color: "#8A998F" }}>{items.length} / {data.total} kết quả</span>
      </div>

      {/* Table */}
      <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, overflow: "hidden" }}>
        <table>
          <thead>
            <tr style={{ borderBottom: "2px solid #E6ECE8" }}>
              {["Mã", "Tên", "Business Intent", "Archetype", "Elements", "Trạng thái"].map((h) => (
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
              <IntentRow key={item.id} item={item} />
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#8A998F", fontSize: 13 }}>
                  Không tìm thấy Product Intent nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {wizardOpen && <ProductIntentWizard onClose={() => setWizardOpen(false)} />}
    </div>
  );
}

function IntentRow({ item }: { item: ProductIntent }) {
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
              background: "#E5EEF9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
            }}
          >
            <Route size={14} color="#2F73C4" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#122019" }}>{item.name}</span>
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
          {item.businessIntentId}
        </span>
      </td>
      <td style={{ padding: "13px 16px" }}>
        <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#5E6F66" }}>
          {item.archetype.replace("FOA_", "")}
        </span>
      </td>
      <td style={{ padding: "13px 16px" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {item.elementCodes.slice(0, 3).map((code) => (
            <span
              key={code}
              style={{
                fontSize: 10,
                background: "#F1F5F2",
                color: "#41524A",
                padding: "2px 6px",
                borderRadius: 4,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {code.replace(/_/g, " ").toLowerCase().slice(0, 18)}
            </span>
          ))}
          {item.elementCodes.length > 3 && (
            <span style={{ fontSize: 10, color: "#8A998F" }}>+{item.elementCodes.length - 3}</span>
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

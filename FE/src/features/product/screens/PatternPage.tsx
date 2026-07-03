import { useState } from "react";
import { Blocks, GitBranch, Search } from "lucide-react";
import { usePatterns } from "../hooks";
import type { Pattern, ProductStatus } from "../types";

const statusConfig: Record<ProductStatus, { label: string; bg: string; fg: string }> = {
  draft: { label: "Bản nháp", bg: "#F1F5F2", fg: "#5E6F66" },
  review: { label: "Đang duyệt", bg: "#FEF3D6", fg: "#9A6B00" },
  approved: { label: "Đã duyệt", bg: "#DCF3E7", fg: "#0B7349" },
  published: { label: "Đã xuất bản", bg: "#E5EEF9", fg: "#2F73C4" },
  retired: { label: "Ngưng", bg: "#FBE3E3", fg: "#B23B3B" },
};

export function PatternPage() {
  const { data, isLoading, error } = usePatterns();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ProductStatus | "all">("all");

  if (isLoading) return <div style={{ padding: 24 }}>Đang tải...</div>;
  if (error || !data) return <div style={{ padding: 24 }}>Không tải được dữ liệu.</div>;

  const items = data.items.filter((item) => {
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase());
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
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#122019" }}>Product Pattern</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#5E6F66" }}>
          Khuôn sản phẩm — tổ hợp block nghiệp vụ và obligation type
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
          placeholder="Tìm theo tên hoặc mã pattern..."
          style={{ border: "none", outline: "none", background: "none", fontSize: 13, flex: 1, color: "#122019" }}
        />
        <span style={{ fontSize: 11, color: "#8A998F" }}>{items.length} / {data.total} kết quả</span>
      </div>

      {/* Cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360, 1fr))", gap: 16 }}>
        {items.map((item) => (
          <PatternCard key={item.id} item={item} />
        ))}
      </div>
      {items.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "#8A998F", fontSize: 13 }}>
          Không tìm thấy Pattern nào
        </div>
      )}
    </div>
  );
}

function PatternCard({ item }: { item: Pattern }) {
  const cfg = statusConfig[item.status];
  const requiredBlocks = item.blocks.filter((b) => b.required).length;
  const optionalBlocks = item.blocks.length - requiredBlocks;

  return (
    <section
      style={{
        background: "#fff",
        border: "1px solid #E6ECE8",
        borderRadius: 10,
        padding: "18px 20px",
        transition: "box-shadow .15s",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "linear-gradient(135deg, #DCF3E7, #B7E6CE)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
            }}
          >
            <GitBranch size={17} color="#0B7349" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#122019" }}>{item.name}</div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10.5,
                color: "#8A998F",
                marginTop: 2,
              }}
            >
              {item.code}
            </div>
          </div>
        </div>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 99,
            background: cfg.bg,
            color: cfg.fg,
          }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Obligation types */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: "#8A998F", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
          Obligation Types
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {item.obligationTypeCodes.map((code) => (
            <span
              key={code}
              style={{
                fontSize: 10.5,
                fontFamily: "'JetBrains Mono', monospace",
                background: "#F1F5F2",
                color: "#41524A",
                padding: "3px 8px",
                borderRadius: 5,
              }}
            >
              {code}
            </span>
          ))}
        </div>
      </div>

      {/* Blocks summary */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 0 0",
          borderTop: "1px solid #F1F5F2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Blocks size={13} color="#0E8C5A" />
          <span style={{ fontSize: 12, color: "#41524A" }}>
            <b style={{ fontWeight: 700 }}>{item.blocks.length}</b> blocks
          </span>
        </div>
        <span style={{ fontSize: 11, color: "#8A998F" }}>
          {requiredBlocks} bắt buộc · {optionalBlocks} tuỳ chọn
        </span>
      </div>
    </section>
  );
}

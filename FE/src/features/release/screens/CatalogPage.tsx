import { useState } from "react";
import { Plus, Sparkles, BookOpen } from "lucide-react";
import { CATALOG_RAW } from "../mockData";

export function CatalogPage() {
  const [filter, setFilter] = useState<string>("All");

  const covers = [
    "linear-gradient(135deg,#0E8C5A,#0B6B45)",
    "linear-gradient(135deg,#1F8A6B,#0E5C44)",
    "linear-gradient(135deg,#E8920C,#C9740A)",
    "linear-gradient(135deg,#159B6E,#0B7349)",
    "linear-gradient(135deg,#3AA17E,#157A57)",
    "linear-gradient(135deg,#D9A406,#A87C04)",
  ];

  const statusMap: Record<string, [string, string, string]> = {
    published: ["Đã xuất bản", "#DCF3E7", "#0B7349"],
    approved: ["Đã duyệt", "#E1ECFB", "#1F5FAF"],
    review: ["Đang duyệt", "#FEF3D6", "#9A6B00"],
    draft: ["Bản nháp", "#EEF1EF", "#5E6F66"],
  };

  const filtered = CATALOG_RAW.filter((c) => filter === "All" || c.family === filter);

  // Group counts
  const allCount = CATALOG_RAW.length;
  const pledgeCount = CATALOG_RAW.filter((c) => c.family === "Cầm cố").length;
  const facilityCount = CATALOG_RAW.filter((c) => c.family === "Hạn mức").length;
  const unsecuredCount = CATALOG_RAW.filter((c) => c.family === "Tín chấp").length;

  return (
    <div style={{ padding: "24px 26px", animation: "fadeUp .3s ease" }}>
      {/* Filters and action */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setFilter("All")}
            style={{
              fontSize: 13,
              fontWeight: filter === "All" ? 600 : 500,
              color: filter === "All" ? "#fff" : "#41524A",
              background: filter === "All" ? "#0E8C5A" : "#fff",
              border: filter === "All" ? "none" : "1px solid #E6ECE8",
              padding: "8px 14px",
              borderRadius: 9,
              cursor: "pointer",
            }}
          >
            Tất cả · {allCount}
          </button>
          <button
            onClick={() => setFilter("Cầm cố")}
            style={{
              fontSize: 13,
              fontWeight: filter === "Cầm cố" ? 600 : 500,
              color: filter === "Cầm cố" ? "#fff" : "#41524A",
              background: filter === "Cầm cố" ? "#0E8C5A" : "#fff",
              border: filter === "Cầm cố" ? "none" : "1px solid #E6ECE8",
              padding: "8px 14px",
              borderRadius: 9,
              cursor: "pointer",
            }}
          >
            Cầm cố · {pledgeCount}
          </button>
          <button
            onClick={() => setFilter("Hạn mức")}
            style={{
              fontSize: 13,
              fontWeight: filter === "Hạn mức" ? 600 : 500,
              color: filter === "Hạn mức" ? "#fff" : "#41524A",
              background: filter === "Hạn mức" ? "#0E8C5A" : "#fff",
              border: filter === "Hạn mức" ? "none" : "1px solid #E6ECE8",
              padding: "8px 14px",
              borderRadius: 9,
              cursor: "pointer",
            }}
          >
            Hạn mức · {facilityCount}
          </button>
          <button
            onClick={() => setFilter("Tín chấp")}
            style={{
              fontSize: 13,
              fontWeight: filter === "Tín chấp" ? 600 : 500,
              color: filter === "Tín chấp" ? "#fff" : "#41524A",
              background: filter === "Tín chấp" ? "#0E8C5A" : "#fff",
              border: filter === "Tín chấp" ? "none" : "1px solid #E6ECE8",
              padding: "8px 14px",
              borderRadius: 9,
              cursor: "pointer",
            }}
          >
            Tín chấp · {unsecuredCount}
          </button>
        </div>
        <button
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            background: "#0E8C5A",
            borderRadius: 9,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            border: "none",
            boxShadow: "0 2px 8px rgba(14,140,90,.3)",
            cursor: "pointer",
          }}
        >
          <Plus size={15} /> Thêm Catalog Item
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
        {filtered.map((c, i) => {
          const status = statusMap[c.status] || ["Bản nháp", "#EEF1EF", "#5E6F66"];
          return (
            <div
              key={c.variant}
              style={{
                background: "#fff",
                border: "1px solid #E6ECE8",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 1px 2px rgba(11,59,46,.04)",
              }}
            >
              <div
                style={{
                  height: 104,
                  background: covers[i % covers.length],
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: 14,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontSize: "10.5px",
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: 99,
                    background: status[1],
                    color: status[2],
                  }}
                >
                  {status[0]}
                </span>
                <span style={{ position: "absolute", top: 12, left: 14, color: "rgba(255,255,255,.92)" }}>
                  <BookOpen size={20} />
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(255,255,255,.95)",
                    background: "rgba(0,0,0,.18)",
                    padding: "3px 9px",
                    borderRadius: 99,
                  }}
                >
                  {c.family}
                </span>
              </div>
              <div style={{ padding: "15px 16px" }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "#122019" }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: "#8A998F", marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>
                  {c.variant}
                </div>
                <div style={{ display: "flex", gap: 18, marginTop: 14, paddingTop: 13, borderTop: "1px solid #F1F5F2" }}>
                  <div>
                    <div style={{ fontSize: 10.5, color: "#A7B5AC", fontWeight: 600 }}>HẠN MỨC</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#243A30", marginTop: 2 }}>{c.limit}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, color: "#A7B5AC", fontWeight: 600 }}>LÃI SUẤT</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0B7349", marginTop: 2 }}>{c.rate}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 13 }}>
                  {c.channels.map((ch, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: "#5E6F66",
                        background: "#F1F5F2",
                        padding: "3px 9px",
                        borderRadius: 99,
                      }}
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

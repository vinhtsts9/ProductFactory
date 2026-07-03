import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { getConfigs } from "../api";
import type { Config } from "../types";
import type { AppView } from "../../../app/navigation";

interface ConfigListPageProps {
  onNavigate: (view: AppView) => void;
  onSelectConfig: (id: string) => void;
}

export function ConfigListPage({ onNavigate, onSelectConfig }: ConfigListPageProps) {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getConfigs().then(setConfigs);
  }, []);

  const filtered = configs.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.templateName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: Config["status"]) => {
    const configMap = {
      draft: { text: "Bản nháp", bg: "#EEF1EF", fg: "#5E6F66" },
      review: { text: "Chờ duyệt", bg: "#FEF3D6", fg: "#9A6B00" },
      approved: { text: "Đã duyệt", bg: "#E1ECFB", fg: "#1F5FAF" },
      published: { text: "Đã phát hành", bg: "#DCF3E7", fg: "#0B7349" },
    };
    const c = configMap[status] || configMap.draft;
    return (
      <span
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          padding: "3px 9px",
          borderRadius: 99,
          background: c.bg,
          color: c.fg,
          display: "inline-block",
        }}
      >
        ● {c.text}
      </span>
    );
  };

  return (
    <div style={{ padding: "22px 26px", animation: "fadeUp .3s ease" }}>
      {/* action bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1px solid #E6ECE8",
            borderRadius: 9,
            padding: "8px 12px",
            width: 320,
          }}
        >
          <Search size={16} color="#8A998F" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm Product Config…"
            style={{ border: "none", background: "none", outline: "none", fontSize: 13, color: "#122019", width: "100%" }}
          />
        </div>

        <button
          onClick={() => {
            // navigate to configForm with a default/new config ID (or select CFG-0042)
            onSelectConfig("CFG-0042");
          }}
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            background: "#0E8C5A",
            borderRadius: 9,
            padding: "9px 16px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            border: "none",
            boxShadow: "0 2px 8px rgba(14,140,90,.3)",
            cursor: "pointer",
          }}
        >
          <Plus size={15} /> Tạo Config
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 13, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FBFDFC", borderBottom: "1px solid #EEF2EF" }}>
              <th style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "12px 16px", width: 110 }}>MÃ</th>
              <th style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "12px 16px" }}>TÊN CONFIG</th>
              <th style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "12px 16px", width: 240 }}>TEMPLATE</th>
              <th style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "12px 16px", width: 100 }}>FRAGMENT</th>
              <th style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "12px 16px", width: 130 }}>TRẠNG THÁI</th>
              <th style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: "#8A998F", padding: "12px 16px", width: 140 }}>NGƯỜI DUYỆT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              // count how many slots have fragments
              const filledFragsCount = c.slots.filter((s) => s.fragments.length > 0).length;
              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectConfig(c.id)}
                  style={{
                    borderBottom: "1px solid #F1F5F2",
                    cursor: "pointer",
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: "13px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#5E6F66" }}>{c.id}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: "#122019" }}>{c.name}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#5E6F66" }}>{c.templateName}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#5E6F66", textAlign: "right", fontWeight: 600 }}>{filledFragsCount}</td>
                  <td style={{ padding: "13px 16px" }}>{getStatusBadge(c.status)}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#243A30" }}>{c.reviewer}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11.5, color: "#8A998F", marginTop: 12, paddingLeft: 4 }}>
        Hiển thị {filtered.length} trên {configs.length} Product Config
      </div>
    </div>
  );
}

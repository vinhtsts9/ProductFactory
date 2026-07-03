import { ChevronDown, ChevronRight, Plus, Search } from "lucide-react";

export type ListColumn = {
  key: string;
  label: string;
  width?: number;
};

export type ListCell = {
  text: string;
  kind?: "text" | "mono" | "chip";
  tone?: "green" | "gold" | "info" | "neutral" | "draft" | "published" | "review";
  bold?: boolean;
  dim?: boolean;
};

export type ListRow = {
  id: string;
  cells: ListCell[];
};

export type ListTab = {
  id: string;
  label: string;
  count: string;
  active?: boolean;
};

type FoundationListPageProps = {
  tabs?: ListTab[];
  searchPlaceholder: string;
  filters: string[];
  actionLabel: string;
  footerText: string;
  columns: ListColumn[];
  rows: ListRow[];
  onTabClick?: (tab: ListTab) => void;
  onRowClick?: (row: ListRow) => void;
};

const chipTone = {
  green: { bg: "#DCF3E7", fg: "#0B7349" },
  gold: { bg: "#FBEFC7", fg: "#9A6B00" },
  info: { bg: "#E5EEF9", fg: "#2F73C4" },
  neutral: { bg: "#F1F5F2", fg: "#5E6F66" },
  draft: { bg: "#F1F5F2", fg: "#8A998F" },
  published: { bg: "#DCF3E7", fg: "#0B7349" },
  review: { bg: "#FEF3D6", fg: "#9A6B00" },
};

export function FoundationListPage({
  actionLabel,
  columns,
  filters,
  footerText,
  rows,
  searchPlaceholder,
  tabs,
  onTabClick,
  onRowClick,
}: FoundationListPageProps) {
  return (
    <div style={{ padding: "22px 26px", animation: "fadeUp .3s ease" }}>
      {tabs ? (
        <div style={{ display: "flex", gap: 7, marginBottom: 16, borderBottom: "1px solid #E6ECE8" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabClick?.(tab)}
              style={{
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: tab.active ? 700 : 500,
                color: tab.active ? "#0B7349" : "#5E6F66",
                borderBottom: tab.active ? "2px solid #0E8C5A" : "2px solid transparent",
                marginBottom: -1,
                background: "transparent",
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "1px 7px",
                  borderRadius: 99,
                  marginLeft: 5,
                  background: tab.active ? "#DCF3E7" : "#F1F5F2",
                  color: tab.active ? "#0B7349" : "#8A998F",
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1px solid #E6ECE8",
            borderRadius: 9,
            padding: "8px 12px",
            width: 280,
          }}
        >
          <Search size={16} color="#A7B5AC" />
          <input
            placeholder={searchPlaceholder}
            style={{ border: "none", background: "none", outline: "none", fontSize: 13, width: "100%" }}
          />
        </div>
        {filters.map((filter) => (
          <button
            key={filter}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "#fff",
              border: "1px solid #E6ECE8",
              borderRadius: 9,
              padding: "8px 13px",
              fontSize: 12.5,
              fontWeight: 500,
              color: "#41524A",
            }}
          >
            {filter}
            <ChevronDown size={15} color="#A7B5AC" />
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#0E8C5A",
            color: "#fff",
            borderRadius: 9,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 2px 8px rgba(14,140,90,.3)",
          }}
        >
          <Plus size={15} />
          {actionLabel}
        </button>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "table", borderCollapse: "collapse", width: "100%", tableLayout: "auto" }}>
          <div style={{ display: "table-header-group" }}>
            <div style={{ display: "table-row", background: "#FBFDFC" }}>
              {columns.map((column) => (
                <div
                  key={column.key}
                  style={{
                    display: "table-cell",
                    width: column.width,
                    padding: "12px 14px",
                    borderBottom: "1px solid #EEF2EF",
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: "#8A998F",
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.label}
                </div>
              ))}
              <div style={{ display: "table-cell", width: 42, borderBottom: "1px solid #EEF2EF" }} />
            </div>
          </div>
          <div style={{ display: "table-row-group" }}>
            {rows.map((row) => (
              <div
                key={row.id}
                onClick={() => onRowClick?.(row)}
                style={{ display: "table-row", borderBottom: "1px solid #F1F5F2", cursor: onRowClick ? "pointer" : "default" }}
              >
                {row.cells.map((cell, index) => (
                  <div key={`${row.id}-${index}`} style={{ display: "table-cell", padding: "13px 14px", borderBottom: "1px solid #F1F5F2", verticalAlign: "middle" }}>
                    <Cell cell={cell} />
                  </div>
                ))}
                <div style={{ display: "table-cell", padding: "13px 12px", borderBottom: "1px solid #F1F5F2", textAlign: "center", color: "#C2D0C8" }}>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, fontSize: 12.5, color: "#8A998F" }}>
        <span>{footerText}</span>
        <div style={{ display: "flex", gap: 6 }}>
          {["‹", "1", "2", "3", "›"].map((item) => (
            <button
              key={item}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: item === "1" ? "1px solid #0E8C5A" : "1px solid #E6ECE8",
                background: item === "1" ? "#0E8C5A" : "#fff",
                color: item === "1" ? "#fff" : "#41524A",
                fontWeight: item === "1" ? 600 : 500,
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Cell({ cell }: { cell: ListCell }) {
  if (cell.kind === "chip") {
    const tone = chipTone[cell.tone ?? "neutral"];
    return (
      <span style={{ fontSize: 11.5, fontWeight: 700, color: tone.fg, background: tone.bg, padding: "3px 9px", borderRadius: 99 }}>
        {cell.text}
      </span>
    );
  }

  if (cell.kind === "mono") {
    return <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#5E6F66" }}>{cell.text}</span>;
  }

  return (
    <span
      style={{
        fontSize: 12.5,
        color: cell.dim ? "#8A998F" : cell.tone === "green" ? "#0B7349" : "#243A30",
        fontWeight: cell.bold ? 700 : 500,
      }}
    >
      {cell.text}
    </span>
  );
}

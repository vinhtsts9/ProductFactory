import { ArrowLeft, Blocks } from "lucide-react";
import { useBlockDetail } from "../hooks";

type BlockDetailPageProps = {
  code: string;
  onBack: () => void;
};

export function BlockDetailPage({ code, onBack }: BlockDetailPageProps) {
  const { data, error, isLoading } = useBlockDetail(code);

  if (isLoading) return <div style={{ padding: 24 }}>Đang tải Block...</div>;
  if (error || !data) return <div style={{ padding: 24 }}>Không tải được chi tiết Block.</div>;

  return (
    <div style={{ padding: "22px 26px", maxWidth: 1500, animation: "fadeUp .3s ease" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: "#5E6F66", marginBottom: 14 }}>
        <ArrowLeft size={16} />
        Về danh sách Block
      </button>

      <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "20px 22px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: "#DCF3E7", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <Blocks size={19} color="#0B7349" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#122019" }}>{data.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8A998F", background: "#F1F5F2", padding: "2px 8px", borderRadius: 6 }}>{data.code}</span>
              <Badge label={data.status} tone="green" />
            </div>
            <div style={{ fontSize: 12.5, color: "#5E6F66", marginTop: 7, lineHeight: 1.5, maxWidth: 820 }}>{data.description}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <Badge label={`Nhóm - ${data.group}`} tone="neutral" />
              <Badge label={`Chi phối bởi - ${data.governedBy}`} tone="info" />
              <Badge label={`${data.slots.length} Answer Slot`} tone="gold" />
            </div>
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 18 }}>
        <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "18px 20px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#122019", marginBottom: 14 }}>Answer Slot</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.slots.map((slot) => (
              <div key={slot.code} style={{ border: "1px solid #EEF2EF", borderRadius: 8, padding: "12px 13px", background: "#FBFDFC" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#243A30" }}>{slot.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#8A998F", marginTop: 4 }}>{slot.code}</div>
                  </div>
                  <Badge label={slot.required ? "Bắt buộc" : "Tùy chọn"} tone={slot.required ? "gold" : "neutral"} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  <Badge label={slot.dataType} tone="info" />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#0B7349", background: "#DCF3E7", padding: "3px 9px", borderRadius: 7 }}>{slot.attributeCode}</span>
                  {slot.defaultValue ? <span style={{ fontSize: 11, color: "#5E6F66" }}>Default: {slot.defaultValue}</span> : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "18px 20px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#122019", marginBottom: 14 }}>Đang dùng trong Pattern</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.usedByPatterns.map((pattern) => (
              <div key={pattern.code} style={{ border: "1px solid #EEF2EF", borderRadius: 8, padding: "12px 13px" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#243A30" }}>{pattern.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#8A998F", marginTop: 4 }}>{pattern.code}</div>
                <div style={{ marginTop: 8 }}>
                  <Badge label={pattern.role} tone="green" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: "green" | "info" | "neutral" | "gold" }) {
  const map = {
    green: { bg: "#DCF3E7", fg: "#0B7349" },
    info: { bg: "#E5EEF9", fg: "#2F73C4" },
    neutral: { bg: "#F1F5F2", fg: "#5E6F66" },
    gold: { bg: "#FBEFC7", fg: "#9A6B00" },
  };
  return <span style={{ fontSize: 11, fontWeight: 700, color: map[tone].fg, background: map[tone].bg, padding: "3px 10px", borderRadius: 7 }}>{label}</span>;
}

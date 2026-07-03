import { ArrowLeft, CheckCircle2, Tags } from "lucide-react";
import { useAttributeDetail } from "../hooks";

type AttributeDetailPageProps = {
  code: string;
  onBack: () => void;
};

const constraintTone = {
  regulatory: { bg: "#FBE3E3", fg: "#B23B3B" },
  range: { bg: "#E5EEF9", fg: "#2F73C4" },
  required: { bg: "#FBEFC7", fg: "#9A6B00" },
  dependency: { bg: "#DCF3E7", fg: "#0B7349" },
};

export function AttributeDetailPage({ code, onBack }: AttributeDetailPageProps) {
  const { data, error, isLoading } = useAttributeDetail(code);

  if (isLoading) return <div style={{ padding: 24 }}>Đang tải Attribute...</div>;
  if (error || !data) return <div style={{ padding: 24 }}>Không tải được chi tiết Attribute.</div>;

  return (
    <div style={{ padding: "22px 26px", maxWidth: 1500, animation: "fadeUp .3s ease" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: "#5E6F66", marginBottom: 14 }}>
        <ArrowLeft size={16} />
        Về danh sách Attribute
      </button>

      <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "20px 22px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: "#E5EEF9", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <Tags size={18} color="#1F5FAF" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#122019" }}>{data.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8A998F", background: "#F1F5F2", padding: "2px 8px", borderRadius: 6 }}>{data.code}</span>
            </div>
            <div style={{ fontSize: 12.5, color: "#5E6F66", marginTop: 7, lineHeight: 1.5, maxWidth: 820 }}>{data.description}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <Badge label={`Data Type - ${data.dataType}`} tone="info" />
              <Badge label={`Group - ${data.group}`} tone="neutral" />
              <Badge label={`Domain - ${data.domain}`} tone="neutral" />
              <Badge label={data.required ? "Bắt buộc" : "Tùy chọn"} tone={data.required ? "gold" : "neutral"} />
            </div>
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "18px 20px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#122019", marginBottom: 14 }}>Ràng buộc</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.constraints.map((constraint) => {
              const tone = constraintTone[constraint.kind];
              return (
                <div key={`${constraint.kind}-${constraint.type}`} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                  <span style={{ width: 24, height: 24, borderRadius: 7, background: tone.bg, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                    <CheckCircle2 size={14} color={tone.fg} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#243A30" }}>{constraint.type}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: tone.bg, color: tone.fg }}>{constraint.kind}</span>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#0B7349", marginTop: 4 }}>{constraint.rule}</div>
                    {constraint.note ? <div style={{ fontSize: 11, color: "#8A998F", marginTop: 3 }}>{constraint.note}</div> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "18px 20px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#122019", marginBottom: 14 }}>Giá trị theo Selector Scope</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {data.scopeValues.map((scope) => (
              <div key={scope.scope} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid #EEF2EF", borderRadius: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#0B7349", background: "#DCF3E7", padding: "2px 8px", borderRadius: 99 }}>{scope.priority}</span>
                <span style={{ flex: 1, fontSize: 12.5, color: "#41524A" }}>{scope.scope}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#122019", fontWeight: 700 }}>{scope.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section style={{ marginTop: 18, background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "18px 20px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#122019", marginBottom: 14 }}>Đang dùng trong Answer Slot</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
          {data.usageBlocks.map((usage) => (
            <div key={`${usage.blockCode}-${usage.slotName}`} style={{ border: "1px solid #EEF2EF", borderRadius: 8, padding: "12px 13px", background: "#FBFDFC" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#243A30" }}>{usage.blockName}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#8A998F", marginTop: 4 }}>{usage.blockCode}</div>
              <div style={{ fontSize: 11.5, color: "#5E6F66", marginTop: 8 }}>{usage.slotName}</div>
              <div style={{ marginTop: 8 }}>
                <Badge label={usage.required ? "Bắt buộc" : "Tùy chọn"} tone={usage.required ? "gold" : "neutral"} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: "info" | "neutral" | "gold" }) {
  const map = {
    info: { bg: "#E5EEF9", fg: "#2F73C4" },
    neutral: { bg: "#F1F5F2", fg: "#5E6F66" },
    gold: { bg: "#FBEFC7", fg: "#9A6B00" },
  };
  return <span style={{ fontSize: 11, fontWeight: 700, color: map[tone].fg, background: map[tone].bg, padding: "3px 10px", borderRadius: 7 }}>{label}</span>;
}

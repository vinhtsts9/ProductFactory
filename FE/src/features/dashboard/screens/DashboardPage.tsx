import { ChevronRight } from "lucide-react";
import { useDashboardData } from "../hooks";
import type { Tone } from "../types";

const toneStyles: Record<Tone, { bg: string; fg: string; tagBg: string; tagFg: string }> = {
  green: { bg: "#DCF3E7", fg: "#0B7349", tagBg: "#DCF3E7", tagFg: "#0B7349" },
  gold: { bg: "#FBEFC7", fg: "#8A6300", tagBg: "#FBEFC7", tagFg: "#9A6B00" },
  review: { bg: "#FEF3D6", fg: "#9A6B00", tagBg: "#FEF3D6", tagFg: "#9A6B00" },
  neutral: { bg: "#EEF1EF", fg: "#41524A", tagBg: "#F1F5F2", tagFg: "#5E6F66" },
  info: { bg: "#E5EEF9", fg: "#2F73C4", tagBg: "#E5EEF9", tagFg: "#2F73C4" },
  danger: { bg: "#FBE3E3", fg: "#B23B3B", tagBg: "#FBE3E3", tagFg: "#B23B3B" },
};

export function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <div style={{ padding: 24 }}>Đang tải...</div>;
  }

  if (error || !data) {
    return <div style={{ padding: 24 }}>Không tải được dữ liệu dashboard.</div>;
  }

  return (
    <div style={{ padding: "24px 26px", maxWidth: 1500, animation: "fadeUp .3s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 16, marginBottom: 20 }}>
        {data.kpis.map((kpi) => {
          const Icon = kpi.icon;
          const tone = toneStyles[kpi.tone];
          const positive = kpi.tone === "green";

          return (
            <section
              key={kpi.id}
              style={{
                background: "#fff",
                border: "1px solid #E6ECE8",
                borderRadius: 8,
                padding: "17px 18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: tone.bg,
                    color: tone.fg,
                  }}
                >
                  <Icon size={19} color={tone.fg} />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: positive ? "#0B7349" : "#8A998F",
                    background: positive ? "#DCF3E7" : "#F1F5F2",
                    padding: "3px 8px",
                    borderRadius: 99,
                  }}
                >
                  {kpi.delta}
                </span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#122019", letterSpacing: -1, lineHeight: 1 }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: 12.5, color: "#5E6F66", fontWeight: 500, marginTop: 6 }}>{kpi.label}</div>
            </section>
          );
        })}
      </div>

      <section
        style={{
          background: "#fff",
          border: "1px solid #E6ECE8",
          borderRadius: 8,
          padding: "20px 22px",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#122019" }}>Pipeline sản phẩm</div>
            <div style={{ fontSize: 12, color: "#8A998F", marginTop: 2 }}>
              {"Luồng từ định hướng đến sản phẩm trên kệ - Intent -> Pattern -> Template -> Config -> Variant -> Catalog"}
            </div>
          </div>
          <button style={{ fontSize: 12.5, color: "#0E8C5A", fontWeight: 600, display: "flex", alignItems: "center", gap: 5, background: "transparent" }}>
            Xem chi tiết <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {data.pipeline.map((step, index) => (
            <div key={step.id} style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ height: 88, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 10 }}>
                  <div
                    style={{
                      width: 62,
                      borderRadius: "9px 9px 0 0",
                      background: step.color,
                      height: step.barHeight,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      paddingTop: 8,
                      transition: "height .4s",
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 800, color: step.darkText ? "#06371F" : "#fff" }}>{step.count}</span>
                  </div>
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "#41524A" }}>{step.label}</div>
                <div style={{ fontSize: 10.5, color: "#A7B5AC", marginTop: 1 }}>{step.sub}</div>
              </div>
              {index < data.pipeline.length - 1 ? (
                <ChevronRight size={16} color="#C2D0C8" style={{ margin: "0 -4px 26px", flex: "none" }} />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "20px 22px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#122019", marginBottom: 4 }}>Hoạt động gần đây</div>
          <div style={{ fontSize: 12, color: "#8A998F", marginBottom: 16 }}>Nhật ký maker-checker và vòng đời thực thể</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {data.activities.map((activity) => {
              const Icon = activity.icon;
              const tone = toneStyles[activity.tone];

              return (
                <div key={activity.id} style={{ display: "flex", gap: 13, padding: "11px 0", borderBottom: "1px solid #F1F5F2" }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      flex: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: tone.bg,
                      color: tone.fg,
                    }}
                  >
                    <Icon size={15} color={tone.fg} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "#243A30", lineHeight: 1.4 }}>
                      <b style={{ fontWeight: 600 }}>{activity.actor}</b> {activity.action}{" "}
                      <b style={{ fontWeight: 600, color: "#0B7349" }}>{activity.target}</b>
                    </div>
                    <div style={{ fontSize: 11, color: "#A7B5AC", marginTop: 3, display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{activity.time}</span>
                      <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#CDD9D2" }} />
                      <span>{activity.channel}</span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      padding: "3px 9px",
                      borderRadius: 99,
                      height: "fit-content",
                      background: tone.tagBg,
                      color: tone.tagFg,
                    }}
                  >
                    {activity.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#122019", marginBottom: 16 }}>Phân bổ theo Obligation Family</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {data.families.map((family) => (
                <div key={family.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 500, color: "#41524A" }}>{family.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#122019" }}>{family.count}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 99, background: "#F1F5F2", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 99, width: family.pct, background: family.color }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#122019", marginBottom: 16 }}>Trạng thái vòng đời</div>
            <div style={{ display: "flex", height: 14, borderRadius: 99, overflow: "hidden", marginBottom: 14 }}>
              {data.statusBars.map((status) => (
                <div key={status.label} style={{ width: status.pct, background: status.color }} />
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              {data.statusBars.map((status) => (
                <div key={status.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: status.color, flex: "none" }} />
                  <span style={{ fontSize: 12, color: "#5E6F66", flex: 1 }}>{status.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#122019" }}>{status.count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

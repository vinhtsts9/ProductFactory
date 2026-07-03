import { Check, ChevronRight, Network } from "lucide-react";
import { useOntologyOverview } from "../hooks";

export function OntologyPage() {
  const { data, isLoading, error } = useOntologyOverview();

  if (isLoading) return <div style={{ padding: 24 }}>Đang tải ontology...</div>;
  if (error || !data) return <div style={{ padding: 24 }}>Không tải được dữ liệu ontology.</div>;

  return (
    <div style={{ padding: "22px 26px", maxWidth: 1500, animation: "fadeUp .3s ease" }}>
      <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "20px 22px", marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#122019", marginBottom: 3 }}>Mối quan hệ 4 khái niệm nền tảng</div>
        <div style={{ fontSize: 12.5, color: "#8A998F", marginBottom: 18 }}>
          Cách Product Factory mô hình hóa nghĩa vụ tài chính: từ chiều phân loại đến phần tử, tổ hợp thành loại, rồi gom theo họ.
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          {data.concepts.map((concept) => (
            <div key={concept.label} style={{ flex: 1, display: "flex", alignItems: "stretch", minWidth: 0 }}>
              <div style={{ flex: 1, border: `1.5px solid ${concept.color}`, borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div style={{ padding: "11px 14px", background: concept.bg }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: concept.color, lineHeight: 1.15 }}>{concept.label}</div>
                  <div style={{ fontSize: 11, color: concept.color, opacity: 0.85, fontWeight: 600, marginTop: 2 }}>{concept.vi}</div>
                </div>
                <div style={{ padding: "11px 14px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 9 }}>
                  <div style={{ fontSize: 11.5, color: "#5E6F66", lineHeight: 1.45 }}>{concept.desc}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: concept.color, background: concept.bg, alignSelf: "flex-start", padding: "2px 9px", borderRadius: 99 }}>{concept.count}</div>
                </div>
              </div>
              {concept.rel ? (
                <div style={{ flex: "none", width: 74, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: "0 2px" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#8A998F" }}>{concept.rel.label}</div>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <div style={{ height: 2, background: "#D7E1DB", flex: 1 }} />
                    <ChevronRight size={15} color="#A7B5AC" style={{ flex: "none", marginLeft: -2 }} />
                  </div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: "#0B7349", fontFamily: "'JetBrains Mono', monospace" }}>{concept.rel.card}</div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "268px 1fr", gap: 20, marginBottom: 20 }}>
        <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "16px 16px 8px", alignSelf: "start" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: "#8A998F", marginBottom: 12 }}>CHỌN OBLIGATION TYPE</div>
          {data.typeGroups.map((group) => (
            <div key={group.famName} style={{ marginBottom: 13 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: group.famColor, flex: "none" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#5E6F66", letterSpacing: 0.3 }}>{group.famName}</span>
              </div>
              {group.items.map((item) => (
                <button key={item.code} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 8, marginBottom: 4, border: `1.5px solid ${item.active ? group.famColor : "#EEF2EF"}`, background: item.active ? "#F4FBF7" : "#fff" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: group.famColor, flex: "none" }} />
                  <span style={{ fontSize: 12.5, fontWeight: item.active ? 700 : 500, color: item.active ? "#0B3B2E" : "#41524A" }}>{item.name}</span>
                </button>
              ))}
            </div>
          ))}
        </section>

        <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "20px 22px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16.5, fontWeight: 700, color: "#122019" }}>{data.currentType.name}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8A998F", background: "#F1F5F2", padding: "2px 8px", borderRadius: 6 }}>{data.currentType.code}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "#8A998F", marginTop: 5 }}>
                Obligation Type = tổ hợp <b style={{ color: "#0B7349", fontWeight: 600 }}>1 Obligation Element cho mỗi Element Type</b>. Phần tử Nature mang cờ <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#0B7349" }}>is_identify</span> để suy ra Family.
              </div>
            </div>
            <div style={{ flex: "none", textAlign: "right" }}>
              <div style={{ fontSize: 10.5, color: "#A7B5AC", fontWeight: 700, letterSpacing: 0.3 }}>THUỘC HỌ</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 5, padding: "5px 12px", borderRadius: 99, background: "#F4FBF7" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: data.currentType.famColor }} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: data.currentType.famColor }}>{data.currentType.famName}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginTop: 16 }}>
            {data.decomposition.map((row) => (
              <div key={row.etName} style={{ border: `1.5px solid ${row.identify ? "#9ED9BC" : "#EEF2EF"}`, background: row.identify ? "#F4FBF7" : "#fff", borderRadius: 8, padding: "13px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, color: "#8A998F", textTransform: "uppercase" }}>{row.etName}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: row.identify ? "#0E8C5A" : "#EEF1EF", color: row.identify ? "#fff" : "#5E6F66" }}>{row.identify ? "is_identify" : "thuộc tính"}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#243A30", lineHeight: 1.25 }}>{row.elName}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#A7B5AC", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.elCode}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <Network size={18} color="#0B7349" />
          <div style={{ fontSize: 15, fontWeight: 700, color: "#122019" }}>Từ vựng: Element Type phân loại các Obligation Element</div>
        </div>
        <div style={{ fontSize: 12.5, color: "#8A998F", marginBottom: 18 }}>Mỗi Element Type là một chiều phân loại chứa nhiều Element khả dĩ. View này đang mở nhóm định danh Nature để đối chiếu với Obligation Type hiện tại.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {data.vocab.map((item) => (
            <div key={item.code}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 14px", borderRadius: 8, border: `1.5px solid ${item.open ? "#0E8C5A" : "#E6ECE8"}`, background: item.open ? "#F4FBF7" : "#fff" }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, background: item.identify ? "#DCF3E7" : "#E5EEF9", color: item.identify ? "#0B7349" : "#2F73C4" }}>{item.short.charAt(0)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#243A30" }}>{item.name}</span>
                    {item.identify ? <span style={{ fontSize: 9.5, fontWeight: 700, color: "#0B7349", background: "#DCF3E7", padding: "2px 8px", borderRadius: 99 }}>ĐỊNH DANH</span> : null}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#8A998F", marginTop: 2 }}>{item.desc}</div>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#5E6F66", background: "#F1F5F2", padding: "3px 10px", borderRadius: 99, flex: "none" }}>{item.elements.length} phần tử</span>
              </div>
              {item.open ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 9, padding: "12px 4px 4px" }}>
                  {item.elements.map((element) => (
                    <div key={element.code} style={{ border: `1px solid ${element.current ? "#9ED9BC" : "#EEF2EF"}`, background: element.current ? "#F4FBF7" : "#FBFDFC", borderRadius: 8, padding: "11px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#243A30", lineHeight: 1.2 }}>{element.name}</span>
                        {element.current ? <Check size={14} color="#0E8C5A" style={{ flex: "none" }} /> : null}
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#A7B5AC", marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{element.code}</div>
                      <div style={{ fontSize: 10.5, color: "#8A998F", marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#C2D0C8" }} />
                        {element.usedBy} dùng
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

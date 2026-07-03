import { useState } from "react";
import { X } from "lucide-react";
import { useCreateBusinessIntent } from "../hooks";
import type { BusinessIntentKpi } from "../types";

type Step = 0 | 1 | 2;

const stepLabels = ["Thông tin cơ bản", "KPI mục tiêu", "Phân khúc khách hàng"];

export function BusinessIntentWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>(0);
  const mutation = useCreateBusinessIntent();

  const [name, setName] = useState("");
  const [owner, setOwner] = useState("Product");
  const [period, setPeriod] = useState("2025");
  const [objective, setObjective] = useState("");
  const [kpis, setKpis] = useState<BusinessIntentKpi[]>([{ metric: "", target: "", unit: "" }]);
  const [income, setIncome] = useState("");
  const [ageMin, setAgeMin] = useState("20");
  const [ageMax, setAgeMax] = useState("55");
  const [regions, setRegions] = useState("");

  const canNext = step === 0 ? name.trim().length > 0 : step === 1 ? kpis[0].metric.trim().length > 0 : true;

  function handleSubmit() {
    mutation.mutate(
      {
        name,
        owner,
        period,
        objective,
        kpis,
        archetype: "FOA_TERM_LOAN",
        segment: {
          income,
          ageRange: [Number(ageMin), Number(ageMax)],
          groups: [],
          regions: regions
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean),
        },
      },
      { onSuccess: () => onClose() },
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeUp .2s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 20px 60px rgba(0,0,0,.2)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 22px",
            borderBottom: "1px solid #E6ECE8",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#122019" }}>Tạo Business Intent</div>
            <div style={{ fontSize: 12, color: "#8A998F", marginTop: 2 }}>
              Bước {step + 1} / 3 — {stepLabels[step]}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", color: "#8A998F", padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: 4, padding: "0 22px", marginTop: 16 }}>
          {stepLabels.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 99,
                background: i <= step ? "#0E8C5A" : "#E6ECE8",
                transition: "background .2s",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: "20px 22px", minHeight: 240 }}>
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Tên Business Intent *" value={name} onChange={setName} placeholder="VD: Mở rộng tín dụng cầm cố 2025" />
              <div style={{ display: "flex", gap: 12 }}>
                <Field label="Owner" value={owner} onChange={setOwner} placeholder="Product" />
                <Field label="Giai đoạn" value={period} onChange={setPeriod} placeholder="2025" />
              </div>
              <Field label="Mục tiêu" value={objective} onChange={setObjective} placeholder="Mô tả ngắn mục tiêu kinh doanh..." />
            </div>
          )}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 13, color: "#41524A", fontWeight: 500, marginBottom: 4 }}>
                KPI mục tiêu (ít nhất 1)
              </div>
              {kpis.map((kpi, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                  <Field label="Metric" value={kpi.metric} onChange={(v) => { const next = [...kpis]; next[i] = { ...kpi, metric: v }; setKpis(next); }} placeholder="Disbursement" />
                  <Field label="Target" value={kpi.target} onChange={(v) => { const next = [...kpis]; next[i] = { ...kpi, target: v }; setKpis(next); }} placeholder="1200" />
                  <Field label="Đơn vị" value={kpi.unit} onChange={(v) => { const next = [...kpis]; next[i] = { ...kpi, unit: v }; setKpis(next); }} placeholder="tỷ VND/năm" />
                </div>
              ))}
              <button
                onClick={() => setKpis([...kpis, { metric: "", target: "", unit: "" }])}
                style={{ fontSize: 12, color: "#0E8C5A", fontWeight: 600, background: "none", textAlign: "left", padding: 0 }}
              >
                + Thêm KPI
              </button>
            </div>
          )}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Thu nhập tối thiểu (VND)" value={income} onChange={setIncome} placeholder="5000000" />
              <div style={{ display: "flex", gap: 12 }}>
                <Field label="Tuổi tối thiểu" value={ageMin} onChange={setAgeMin} placeholder="20" />
                <Field label="Tuổi tối đa" value={ageMax} onChange={setAgeMax} placeholder="55" />
              </div>
              <Field label="Khu vực (cách dấu phẩy)" value={regions} onChange={setRegions} placeholder="HCM, Hà Nội, Đà Nẵng" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 22px", borderTop: "1px solid #E6ECE8" }}>
          <button
            onClick={() => (step > 0 ? setStep((step - 1) as Step) : onClose())}
            style={{ fontSize: 13, fontWeight: 600, color: "#5E6F66", background: "#F1F5F2", padding: "9px 18px", borderRadius: 8 }}
          >
            {step === 0 ? "Huỷ" : "Quay lại"}
          </button>
          <button
            onClick={() => (step < 2 ? setStep((step + 1) as Step) : handleSubmit())}
            disabled={!canNext || mutation.isPending}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              background: canNext ? "linear-gradient(135deg,#14B870,#0E8C5A)" : "#CDD9D2",
              padding: "9px 22px",
              borderRadius: 8,
              boxShadow: canNext ? "0 2px 8px rgba(14,140,90,.3)" : "none",
              opacity: mutation.isPending ? 0.7 : 1,
            }}
          >
            {step < 2 ? "Tiếp theo" : mutation.isPending ? "Đang tạo..." : "Tạo Business Intent"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: "#5E6F66", marginBottom: 5 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "9px 12px",
          borderRadius: 8,
          border: "1px solid #E6ECE8",
          fontSize: 13,
          color: "#122019",
          outline: "none",
          background: "#FAFCFB",
        }}
      />
    </div>
  );
}

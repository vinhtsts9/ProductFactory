import { useState } from "react";
import { X } from "lucide-react";
import { useBusinessIntents, useCreateProductIntent } from "../hooks";

const availableElements = [
  "TERM_LOAN_OBLIGATION",
  "ASSET_PLEDGE",
  "PAYMENT_MULTISTEP_INSTALLMENT",
  "EVENT_LENDER_DISBURSEMENT",
  "PRINCIPAL_NO_INCREASE_MULTI_DECREASE",
  "CALENDAR_HAS_CYCLE_HAS_DEADLINE",
];

export function ProductIntentWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<0 | 1>(0);
  const mutation = useCreateProductIntent();
  const { data: biData } = useBusinessIntents();

  const [name, setName] = useState("");
  const [businessIntentId, setBusinessIntentId] = useState("");
  const [selectedElements, setSelectedElements] = useState<string[]>([]);

  const canNext = step === 0 ? name.trim().length > 0 && businessIntentId.length > 0 : selectedElements.length > 0;

  function handleSubmit() {
    mutation.mutate(
      {
        name,
        businessIntentId,
        archetype: "FOA_TERM_LOAN",
        elementCodes: selectedElements,
      },
      { onSuccess: () => onClose() },
    );
  }

  function toggleElement(code: string) {
    setSelectedElements((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
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
          width: 520,
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
            <div style={{ fontSize: 16, fontWeight: 700, color: "#122019" }}>Tạo Product Intent</div>
            <div style={{ fontSize: 12, color: "#8A998F", marginTop: 2 }}>
              Bước {step + 1} / 2 — {step === 0 ? "Chọn Business Intent" : "Chọn Elements"}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", color: "#8A998F", padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: 4, padding: "0 22px", marginTop: 16 }}>
          {[0, 1].map((i) => (
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
        <div style={{ padding: "20px 22px", minHeight: 260 }}>
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "#5E6F66", marginBottom: 5 }}>Tên Product Intent *</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Vay cầm cố linh hoạt"
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
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "#5E6F66", marginBottom: 5 }}>Business Intent *</div>
                <select
                  value={businessIntentId}
                  onChange={(e) => setBusinessIntentId(e.target.value)}
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
                >
                  <option value="">-- Chọn Business Intent --</option>
                  {biData?.items.map((bi) => (
                    <option key={bi.id} value={bi.id}>
                      {bi.id} — {bi.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, color: "#41524A", fontWeight: 500, marginBottom: 4 }}>
                Chọn Obligation Elements
              </div>
              {availableElements.map((code) => {
                const selected = selectedElements.includes(code);
                return (
                  <div
                    key={code}
                    onClick={() => toggleElement(code)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: `1px solid ${selected ? "#0E8C5A" : "#E6ECE8"}`,
                      background: selected ? "#DCF3E7" : "#fff",
                      cursor: "pointer",
                      transition: "all .15s",
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: `2px solid ${selected ? "#0E8C5A" : "#CDD9D2"}`,
                        background: selected ? "#0E8C5A" : "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: "none",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {selected ? "✓" : ""}
                    </div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        color: selected ? "#0B7349" : "#41524A",
                        fontWeight: selected ? 600 : 400,
                      }}
                    >
                      {code}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 22px", borderTop: "1px solid #E6ECE8" }}>
          <button
            onClick={() => (step > 0 ? setStep(0) : onClose())}
            style={{ fontSize: 13, fontWeight: 600, color: "#5E6F66", background: "#F1F5F2", padding: "9px 18px", borderRadius: 8 }}
          >
            {step === 0 ? "Huỷ" : "Quay lại"}
          </button>
          <button
            onClick={() => (step === 0 ? setStep(1) : handleSubmit())}
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
            {step === 0 ? "Tiếp theo" : mutation.isPending ? "Đang tạo..." : "Tạo Product Intent"}
          </button>
        </div>
      </div>
    </div>
  );
}

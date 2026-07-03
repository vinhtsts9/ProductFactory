import type { Config, ConfigSlot, ConfigFragment } from "./types";

const F = (scopeType: "default" | "people" | "place" | "time", scopeVal: string, value: string, extra?: Partial<ConfigFragment>): ConfigFragment => {
  return {
    id: `${scopeType}:${scopeVal || "def"}:${Date.now() + Math.random()}`,
    scopeType,
    scopeVal: scopeVal || "",
    value,
    ...extra,
  };
};

export const INITIAL_SLOTS: ConfigSlot[] = [
  { code: "lender_party", name: "Lender Party", block: "Bên tham gia", attr: "lender_party", dataType: "Ref", required: true, constraint: "is_identify = true", fragments: [F("default", "", "F88 (Cho vay)")] },
  { code: "borrower_type", name: "Borrower Party Type", block: "Bên tham gia", attr: "borrower_type", dataType: "Enum", required: true, constraint: "Cá nhân / Doanh nghiệp", fragments: [F("default", "", "Cá nhân")] },
  { code: "beneficiary", name: "Beneficiary Party", block: "Bên tham gia", attr: "beneficiary", dataType: "Ref", required: false, constraint: "tùy chọn", fragments: [] },
  { code: "limit_amount", name: "Hạn mức cấp", block: "Hạn mức", attr: "limit_amount", dataType: "Money", required: true, constraint: "3.000.000đ – 2 tỷ", fragments: [F("default", "", "3.000.000đ – 50.000.000đ"), F("place", "HCM, HN", "tối đa 60.000.000đ")] },
  { code: "base_rate", name: "Base Rate (Lãi suất cơ sở)", block: "Lãi suất", attr: "base_rate", dataType: "Percent", required: true, constraint: "≤ 1,65%/tháng (trần NHNN)", fragments: [F("default", "", "1,5%/tháng"), F("people", "Loyalty", "1,0%/tháng"), F("people", "VIP", "1,2%/tháng"), F("place", "HCM, HN", "1,4%/tháng", { note: "Gần trần", warn: true }), F("time", "Khuyến mãi Tết", "0,9%/tháng")] },
  { code: "rate_type", name: "Rate Type", block: "Lãi suất", attr: "rate_type", dataType: "Enum", required: true, constraint: "Cố định / Thả nổi", fragments: [] },
  { code: "asset_type", name: "Asset Type", block: "Tài sản đảm bảo", attr: "asset_type", dataType: "Enum", required: true, constraint: "TwoWheels / Car / Gold…", fragments: [F("default", "", "Xe máy (TwoWheels)")] },
  { code: "ltv", name: "LTV tối đa", block: "Tài sản đảm bảo", attr: "ltv", dataType: "Percent", required: true, constraint: "≤ 80%", fragments: [F("default", "", "80%"), F("place", "HCM, HN", "75%")] },
  { code: "repay_method", name: "Repayment Method", block: "Trả nợ", attr: "repay_method", dataType: "Enum", required: true, constraint: "Trả góp / Bullet", fragments: [F("default", "", "Trả góp nhiều kỳ")] },
  { code: "installment_count", name: "Số kỳ", block: "Trả nợ", attr: "installment_count", dataType: "Integer", required: true, constraint: "1 – 18", fragments: [F("default", "", "1 – 18 kỳ")] },
  { code: "schedule", name: "Lịch trả", block: "Trả nợ", attr: "schedule", dataType: "Enum", required: true, constraint: "Hàng tháng / Quý", fragments: [] },
  { code: "penalty_rate", name: "Penalty Rate", block: "Phạt & Quá hạn", attr: "penalty_rate", dataType: "Percent", required: true, constraint: "≤ 150% lãi", fragments: [F("default", "", "150% lãi suất trong hạn")] },
];

export const INITIAL_CONFIGS: Config[] = [
  { id: "CFG-0042", name: "Vay nhanh Xe máy 18 tháng", templateId: "TPL-003", templateName: "TPL Vay hạn mức cầm cố · KH cá nhân", status: "review", reviewer: "Trần Lan", slots: JSON.parse(JSON.stringify(INITIAL_SLOTS)) },
  { id: "CFG-0041", name: "Vay ô tô hạn mức HCM", templateId: "TPL-003", templateName: "TPL Vay hạn mức cầm cố · KH cá nhân", status: "approved", reviewer: "Lê Minh", slots: JSON.parse(JSON.stringify(INITIAL_SLOTS)) },
  { id: "CFG-0040", name: "Vay xe máy KH thân thiết", templateId: "TPL-003", templateName: "TPL Vay cầm cố trả góp · cá nhân", status: "published", reviewer: "Lê Minh", slots: JSON.parse(JSON.stringify(INITIAL_SLOTS)) },
  { id: "CFG-0039", name: "Vay Bullet vàng 3 tháng", templateId: "TPL-005", templateName: "TPL Vay Bullet cầm cố · cá nhân", status: "approved", reviewer: "Trần Lan", slots: JSON.parse(JSON.stringify(INITIAL_SLOTS)) },
  { id: "CFG-0038", name: "Vay tín chấp lương GV", templateId: "TPL-006", templateName: "TPL Vay tín chấp lương · cá nhân", status: "draft", reviewer: "—", slots: JSON.parse(JSON.stringify(INITIAL_SLOTS)) },
  { id: "CFG-0037", name: "Vay cầm cố DN nhỏ", templateId: "TPL-004", templateName: "TPL Vay cầm cố trả góp · DN", status: "review", reviewer: "Phạm An", slots: JSON.parse(JSON.stringify(INITIAL_SLOTS)) },
];

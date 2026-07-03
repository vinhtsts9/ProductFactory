import type { BlockList } from "./types";
import type { BlockDetail } from "./types";

export const blockList: BlockList = {
  searchPlaceholder: "Tìm Block...",
  filters: ["Nhóm nghiệp vụ", "Trạng thái"],
  actionLabel: "Tạo Block",
  footerText: "Hiển thị 1-8 trên 26 Block",
  columns: [
    { key: "code", label: "Mã", width: 190 },
    { key: "name", label: "Tên Block" },
    { key: "group", label: "Nhóm", width: 140 },
    { key: "slots", label: "Answer Slot", width: 120 },
    { key: "governedBy", label: "Chi phối bởi", width: 210 },
    { key: "status", label: "Trạng thái", width: 120 },
  ],
  rows: [
    ["BLOCK_PARTY", "Bên tham gia", "Party", "4 slot", "TERM_LOAN_OBLIGATION"],
    ["BLOCK_INTEREST", "Lãi suất", "Pricing", "5 slot", "PRINCIPAL_NO_INCREASE"],
    ["BLOCK_LIMIT", "Hạn mức", "Limit", "3 slot", "FACILITY_OBLIGATION"],
    ["BLOCK_COLLATERAL", "Tài sản đảm bảo", "Collateral", "6 slot", "ASSET_PLEDGE"],
    ["BLOCK_REPAYMENT", "Lịch trả nợ", "Repayment", "5 slot", "PAYMENT_MULTISTEP"],
    ["BLOCK_FEE", "Phí", "Pricing", "4 slot", "TERM_LOAN_OBLIGATION"],
    ["BLOCK_PENALTY", "Phạt quá hạn", "Penalty", "3 slot", "PAYMENT_MULTISTEP"],
    ["BLOCK_CHANNEL", "Kênh phân phối", "Distribution", "3 slot", "TERM_LOAN_OBLIGATION"],
  ].map(([code, name, group, slots, governedBy]) => ({
    id: code,
    cells: [
      { text: code, kind: "mono" },
      { text: name, bold: true },
      { text: group, kind: "chip", tone: "neutral" },
      { text: slots },
      { text: governedBy, kind: "mono" },
      { text: "Đã xuất bản", kind: "chip", tone: "published" },
    ],
  })),
};

export const blockDetails: Record<string, BlockDetail> = {
  BLOCK_INTEREST: {
    code: "BLOCK_INTEREST",
    name: "Lãi suất",
    group: "Pricing",
    governedBy: "PRINCIPAL_NO_INCREASE",
    status: "published",
    description: "Gom các Answer Slot liên quan đến lãi suất, cách tính lãi và giới hạn trần pháp lý.",
    slots: [
      { code: "slot_base_rate", name: "Lãi suất cơ sở", attributeCode: "base_rate", dataType: "Percent", required: true, defaultValue: "1,45%/tháng" },
      { code: "slot_rate_type", name: "Loại lãi suất", attributeCode: "rate_type", dataType: "Enum", required: true, defaultValue: "Cố định" },
      { code: "slot_penalty_rate", name: "Lãi suất phạt", attributeCode: "penalty_rate", dataType: "Percent", required: false },
    ],
    usedByPatterns: [
      { code: "PT-001", name: "Khuôn vay cầm cố trả góp", role: "required" },
      { code: "PT-002", name: "Khuôn vay tiêu dùng có hạn mức", role: "required" },
    ],
  },
  BLOCK_LIMIT: {
    code: "BLOCK_LIMIT",
    name: "Hạn mức",
    group: "Limit",
    governedBy: "FACILITY_OBLIGATION",
    status: "published",
    description: "Gom các Answer Slot quy định hạn mức, capacity và cách sử dụng hạn mức.",
    slots: [
      { code: "slot_limit_amount", name: "Hạn mức cấp", attributeCode: "limit_amount", dataType: "Money", required: true, defaultValue: "50.000.000đ" },
      { code: "slot_limit_capacity", name: "Capacity", attributeCode: "capacity_range", dataType: "Range", required: true },
      { code: "slot_drawdown_count", name: "Số lần rút vốn", attributeCode: "drawdown_count", dataType: "Integer", required: false },
    ],
    usedByPatterns: [{ code: "PT-002", name: "Khuôn vay tiêu dùng có hạn mức", role: "required" }],
  },
};

import type { AttributeList } from "./types";
import type { AttributeDetail } from "./types";

export const attributeList: AttributeList = {
  tabs: [
    { id: "attribute", label: "Attribute", count: "64", active: true },
    { id: "group", label: "Attribute Group", count: "12" },
    { id: "datatype", label: "Data Type", count: "9" },
  ],
  searchPlaceholder: "Tìm trong từ điển thuộc tính...",
  filters: ["Trạng thái"],
  actionLabel: "Thêm Attribute",
  footerText: "Từ điển thuộc tính (Attribute Dictionary)",
  columns: [
    { key: "code", label: "Mã", width: 160 },
    { key: "name", label: "Attribute" },
    { key: "dataType", label: "Data Type", width: 120 },
    { key: "slot", label: "Dùng trong Answer Slot", width: 250 },
    { key: "constraint", label: "Ràng buộc", width: 170 },
    { key: "required", label: "Bắt buộc", width: 110 },
  ],
  rows: [
    ["base_rate", "Lãi suất cơ sở", "Percent", "Block Lãi suất", "<= trần NHNN", "Bắt buộc"],
    ["limit_amount", "Hạn mức cấp", "Money", "Block Hạn mức", "3tr - 2 tỷ VND", "Bắt buộc"],
    ["ltv", "Tỷ lệ cho vay (LTV)", "Percent", "Block Tài sản ĐB", "0 - 80%", "Bắt buộc"],
    ["installment_count", "Số kỳ trả góp", "Integer", "Block Lịch trả nợ", "1 - 18", "Bắt buộc"],
    ["asset_type", "Loại tài sản", "Enum", "Block Tài sản ĐB", "Xe máy, Ô tô, Vàng", "Bắt buộc"],
    ["penalty_rate", "Lãi suất phạt", "Percent", "Block Phạt", "<= 150% lãi", "Tùy chọn"],
    ["borrower_type", "Loại bên vay", "Enum", "Block Bên tham gia", "Cá nhân / DN", "Bắt buộc"],
    ["repay_method", "Phương thức trả nợ", "Enum", "Block Lịch trả nợ", "Trả góp / Bullet", "Bắt buộc"],
  ].map(([code, name, dataType, slot, constraint, required]) => ({
    id: code,
    cells: [
      { text: code, kind: "mono" },
      { text: name, bold: true },
      { text: dataType, kind: "chip", tone: "info" },
      { text: slot, dim: true },
      { text: constraint, dim: true },
      { text: required, kind: "chip", tone: required === "Bắt buộc" ? "gold" : "draft" },
    ],
  })),
};

export const attributeDetails: Record<string, AttributeDetail> = {
  base_rate: {
    code: "base_rate",
    name: "Base Rate - Lãi suất cơ sở",
    dataType: "Percent",
    group: "Pricing",
    domain: "Pricing",
    required: true,
    description:
      "Lãi suất danh nghĩa theo tháng, là cơ sở để tính lãi trên dư nợ. Có thể thay đổi theo phân khúc khách hàng, vùng hoặc thời điểm.",
    constraints: [
      { kind: "regulatory", type: "Trần pháp lý", rule: "<= 1,65%/tháng", note: "Chặn cứng khi nhập Fragment." },
      { kind: "range", type: "Miền giá trị", rule: "0,3% - 1,65%/tháng", note: "Số thực, 2 chữ số thập phân." },
      { kind: "required", type: "Bắt buộc", rule: "Phải có ít nhất 1 Fragment mặc định." },
      { kind: "dependency", type: "Phụ thuộc", rule: "Nếu Rate Type = Thả nổi thì cần Reference Index." },
    ],
    usageBlocks: [
      { blockCode: "BLOCK_INTEREST", blockName: "Lãi suất", slotName: "Lãi suất cơ sở", required: true },
      { blockCode: "BLOCK_FEE", blockName: "Phí", slotName: "Cơ sở tính phí", required: false },
    ],
    scopeValues: [
      { scope: "Mặc định", value: "1,45%/tháng", priority: "P0" },
      { scope: "KH thân thiết", value: "1,10%/tháng", priority: "P1" },
      { scope: "Hồ Chí Minh", value: "1,35%/tháng", priority: "P2" },
    ],
  },
  limit_amount: {
    code: "limit_amount",
    name: "Hạn mức cấp",
    dataType: "Money",
    group: "Limit",
    domain: "Product",
    required: true,
    description: "Giá trị hạn mức hoặc khoản vay tối đa được cấp cho khách hàng trong một cấu hình sản phẩm.",
    constraints: [
      { kind: "range", type: "Miền giá trị", rule: "3.000.000đ - 2.000.000.000đ" },
      { kind: "required", type: "Bắt buộc", rule: "Không được trống khi submit Config." },
    ],
    usageBlocks: [{ blockCode: "BLOCK_LIMIT", blockName: "Hạn mức", slotName: "Hạn mức cấp", required: true }],
    scopeValues: [
      { scope: "Mặc định", value: "50.000.000đ", priority: "P0" },
      { scope: "Ô tô", value: "2.000.000.000đ", priority: "P1" },
    ],
  },
};

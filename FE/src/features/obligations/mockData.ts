import type { ObligationLibraryList, ObligationTab } from "./types";

const tabs = (active: ObligationTab) => [
  { id: "otype", label: "Obligation Type", count: "14", active: active === "otype" },
  { id: "oelement", label: "Obligation Element", count: "25", active: active === "oelement" },
  { id: "oetype", label: "Element Type", count: "10", active: active === "oetype" },
];

export function obligationLibraryList(active: ObligationTab): ObligationLibraryList {
  if (active === "oelement") {
    return {
      tabs: tabs(active),
      searchPlaceholder: "Tìm trong thư viện nghĩa vụ...",
      filters: ["Trạng thái"],
      actionLabel: "Thêm mục",
      footerText: "Thư viện Obligation Element",
      columns: [
        { key: "code", label: "Mã", width: 360 },
        { key: "name", label: "Obligation Element" },
        { key: "elementType", label: "Element Type", width: 210 },
        { key: "identify", label: "Is Identify", width: 120 },
        { key: "status", label: "Trạng thái", width: 120 },
      ],
      rows: [
        ["TERM_LOAN_OBLIGATION", "Nợ 1 chiều (đi vay)", "Obligation Nature", "true", "published"],
        ["FACILITY_OBLIGATION", "Cấp hạn mức", "Obligation Nature", "true", "published"],
        ["PRINCIPAL_NO_INCREASE_MULTI_DECREASE", "Gốc không tăng, giảm dần", "Value Structure", "false", "published"],
        ["EVENT_LENDER_DISBURSEMENT", "Kích hoạt khi giải ngân", "Activation Logic", "false", "published"],
        ["PAYMENT_MULTISTEP_INSTALLMENT", "Trả góp nhiều kỳ", "Fulfillment Logic", "false", "published"],
        ["ASSET_PLEDGE", "Tài sản, cầm cố", "Recovery Anchor", "false", "published"],
        ["CALENDAR_HAS_CYCLE_HAS_DEADLINE", "Có chu kỳ, có hạn chót", "Time Structure", "false", "published"],
      ].map(([code, name, elementType, identify, status]) => ({
        id: code,
        cells: [
          { text: code, kind: "mono" },
          { text: name, bold: true },
          { text: elementType, kind: "chip", tone: "neutral" },
          { text: identify, kind: "chip", tone: identify === "true" ? "published" : "draft" },
          { text: statusLabel(status), kind: "chip", tone: statusTone(status) },
        ],
      })),
    };
  }

  if (active === "oetype") {
    return {
      tabs: tabs(active),
      searchPlaceholder: "Tìm trong thư viện nghĩa vụ...",
      filters: ["Trạng thái"],
      actionLabel: "Thêm mục",
      footerText: "Thư viện Obligation Element Type",
      columns: [
        { key: "code", label: "Mã", width: 210 },
        { key: "name", label: "Element Type" },
        { key: "desc", label: "Mô tả" },
        { key: "count", label: "Số Element", width: 120 },
      ],
      rows: [
        ["OET_NATURE", "Obligation Nature", "Bản chất nghĩa vụ (định danh)", "4"],
        ["OET_VALUE", "Obligation Value Structure", "Cấu trúc thay đổi giá trị nghĩa vụ", "5"],
        ["OET_ACTIVATION", "Activation Logic", "Logic kích hoạt nghĩa vụ", "3"],
        ["OET_FULFILLMENT", "Fulfillment Logic", "Cách thực thi/trả nghĩa vụ", "4"],
        ["OET_RECOVERY", "Recovery Anchor", "Phương án thu hồi", "2"],
        ["OET_TIME", "Time Structure", "Cấu trúc thời gian", "3"],
        ["OET_LIFECYCLE", "Lifecycle & State Machine", "Vòng đời và máy trạng thái", "2"],
      ].map(([code, name, desc, count]) => ({
        id: code,
        cells: [
          { text: code, kind: "mono" },
          { text: name, bold: true },
          { text: desc, dim: true },
          { text: count },
        ],
      })),
    };
  }

  return {
    tabs: tabs(active),
    searchPlaceholder: "Tìm trong thư viện nghĩa vụ...",
    filters: ["Trạng thái"],
    actionLabel: "Thêm mục",
    footerText: "Thư viện Obligation Type",
    columns: [
      { key: "code", label: "Mã", width: 230 },
      { key: "name", label: "Obligation Type" },
      { key: "archetype", label: "Archetype", width: 150 },
      { key: "family", label: "Family", width: 190 },
      { key: "element", label: "Element", width: 110 },
      { key: "status", label: "Trạng thái", width: 120 },
    ],
    rows: [
      ["OT_PLEDGE_INSTALLMENT", "Vay cầm cố trả góp", "Term Loan", "Loan Obligation", "7", "published"],
      ["OT_PLEDGE_BULLET", "Vay cầm cố trả 1 lần (Bullet)", "Term Loan", "Loan Obligation", "7", "published"],
      ["OT_FACILITY", "Vay hạn mức (Facility)", "Revolving", "Facility", "7", "published"],
      ["OT_UNSECURED", "Vay tín chấp trả góp", "Term Loan", "Loan Obligation", "6", "approved"],
      ["OT_AUTO_PLEDGE", "Vay cầm cố ô tô", "Term Loan", "Loan Obligation", "7", "published"],
      ["OT_GOLD_BULLET", "Vay cầm cố vàng Bullet", "Term Loan", "Loan Obligation", "6", "review"],
    ].map(([code, name, archetype, family, element, status]) => ({
      id: code,
      cells: [
        { text: code, kind: "mono" },
        { text: name, bold: true },
        { text: archetype, kind: "chip", tone: archetype === "Revolving" ? "gold" : "info" },
        { text: family, dim: true },
        { text: element },
        { text: statusLabel(status), kind: "chip", tone: statusTone(status) },
      ],
    })),
  };
}

function statusLabel(status: string) {
  return (
    {
      published: "Đã xuất bản",
      approved: "Đã duyệt",
      review: "Đang duyệt",
      draft: "Bản nháp",
    }[status] ?? status
  );
}

function statusTone(status: string) {
  if (status === "published" || status === "approved") return "published";
  if (status === "review") return "review";
  return "draft";
}

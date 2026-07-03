import type { OntologyOverview } from "./types";

export const ontologyOverview: OntologyOverview = {
  concepts: [
    {
      label: "Obligation Element Type",
      vi: "Loại phần tử",
      desc: "6 chiều phân loại nghĩa vụ: Nature, Value, Activation, Fulfillment, Recovery, Time.",
      count: "6 loại",
      color: "#2F73C4",
      bg: "#E5EEF9",
      rel: { label: "phân loại", card: "1 : N" },
    },
    {
      label: "Obligation Element",
      vi: "Phần tử nghĩa vụ",
      desc: "Giá trị cụ thể trong một Element Type. Phần tử Nature có cờ is_identify.",
      count: "17 phần tử",
      color: "#9A6B00",
      bg: "#FBEFC7",
      rel: { label: "cấu thành", card: "N : 1" },
    },
    {
      label: "Obligation Type",
      vi: "Loại nghĩa vụ",
      desc: "Tổ hợp một phần tử cho mỗi Element Type để tạo khuôn nghĩa vụ.",
      count: "5 loại",
      color: "#0B7349",
      bg: "#DCF3E7",
      rel: { label: "gom nhóm", card: "N : 1" },
    },
    {
      label: "Obligation Type Family",
      vi: "Họ nghĩa vụ",
      desc: "Nhóm các Obligation Type cùng bản chất, suy từ Obligation Nature.",
      count: "3 họ",
      color: "#5E6F66",
      bg: "#EEF1EF",
    },
  ],
  typeGroups: [
    {
      famName: "Loan Obligation",
      famColor: "#0E8C5A",
      items: [
        { code: "OT_PLEDGE_INSTALLMENT", name: "Vay cầm cố trả góp", active: true },
        { code: "OT_PLEDGE_BULLET", name: "Vay cầm cố trả 1 lần" },
        { code: "OT_UNSECURED", name: "Vay tín chấp trả góp" },
      ],
    },
    {
      famName: "Facility",
      famColor: "#C9740A",
      items: [{ code: "OT_FACILITY", name: "Vay hạn mức Facility" }],
    },
    {
      famName: "Conditional",
      famColor: "#157A57",
      items: [{ code: "OT_GUARANTEE", name: "Bảo lãnh có điều kiện" }],
    },
  ],
  currentType: {
    code: "OT_PLEDGE_INSTALLMENT",
    name: "Vay cầm cố trả góp",
    famName: "Loan Obligation",
    famColor: "#0E8C5A",
  },
  decomposition: [
    {
      etName: "Obligation Nature",
      elName: "Nợ 1 chiều (đi vay)",
      elCode: "TERM_LOAN_OBLIGATION",
      identify: true,
    },
    {
      etName: "Value Structure",
      elName: "Gốc không tăng, giảm dần",
      elCode: "PRINCIPAL_NO_INCREASE_MULTI_DECREASE",
    },
    {
      etName: "Activation Logic",
      elName: "Kích hoạt khi giải ngân",
      elCode: "EVENT_LENDER_DISBURSEMENT",
    },
    {
      etName: "Fulfillment Logic",
      elName: "Trả góp nhiều kỳ",
      elCode: "PAYMENT_MULTISTEP_INSTALLMENT",
    },
    {
      etName: "Recovery Anchor",
      elName: "Tài sản, cầm cố",
      elCode: "ASSET_PLEDGE",
    },
    {
      etName: "Time Structure",
      elName: "Có chu kỳ, có hạn chót",
      elCode: "CALENDAR_HAS_CYCLE_HAS_DEADLINE",
    },
  ],
  vocab: [
    {
      code: "OET_NATURE",
      name: "Obligation Nature",
      short: "Bản chất",
      desc: "Định danh bản chất nghĩa vụ, quyết định Family.",
      identify: true,
      open: true,
      elements: [
        { code: "TERM_LOAN_OBLIGATION", name: "Nợ 1 chiều (đi vay)", usedBy: "3 type", current: true },
        { code: "FACILITY_OBLIGATION", name: "Cấp hạn mức", usedBy: "1 type" },
        { code: "CONDITIONAL_OBLIGATION", name: "Nghĩa vụ có điều kiện", usedBy: "1 type" },
      ],
    },
    {
      code: "OET_VALUE",
      name: "Value Structure",
      short: "Giá trị",
      desc: "Cách giá trị hoặc dư nợ thay đổi theo thời gian.",
      elements: [
        { code: "PRINCIPAL_NO_INCREASE_MULTI_DECREASE", name: "Gốc không tăng, giảm dần", usedBy: "3 type", current: true },
        { code: "LIMIT_MULTI_INC_DEC_HAS_CAPACITY", name: "Hạn mức tăng/giảm có capacity", usedBy: "1 type" },
        { code: "VALUE_BY_EVENT", name: "Giá trị theo sự kiện", usedBy: "1 type" },
      ],
    },
    {
      code: "OET_ACTIVATION",
      name: "Activation Logic",
      short: "Kích hoạt",
      desc: "Điều kiện hoặc sự kiện làm nghĩa vụ phát sinh.",
      elements: [
        { code: "EVENT_LENDER_DISBURSEMENT", name: "Kích hoạt khi giải ngân", usedBy: "3 type", current: true },
        { code: "EVENT_FACILITY_OPEN", name: "Kích hoạt khi mở hạn mức", usedBy: "1 type" },
        { code: "CONDITIONAL_TRIGGER", name: "Kích hoạt theo trigger", usedBy: "1 type" },
      ],
    },
  ],
};

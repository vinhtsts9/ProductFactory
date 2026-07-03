# Kế hoạch tách Product Factory 5.1 HTML sang FE

Quy trình chuyển đổi giữ mục tiêu dịch 1:1, nhưng thứ tự triển khai đã được chỉnh để an toàn hơn:

```txt
Giải nén source gốc
-> dựng FE shell + API boundary
-> port từng view nhỏ
-> tách data/state
-> thay mock bằng backend thật
```

## Tiến độ hiện tại

- [x] Tạo project React/Vite trong `FE/`.
- [x] Giải nén bundle gốc vào `migration/original/`.
- [x] Tạo API boundary trong `features/*/api.ts`.
- [x] Tạo shell/sidebar/topbar và route state trong `src/app`.
- [x] Tạo fallback screen cho các view chưa port.
- [x] Port Dashboard overview: KPI, pipeline, activity, family/status.
- [x] Port Ontology overview: concept chain, type decomposition, vocabulary.
- [x] Port Attribute / Block list pages.
- [x] Port Attribute detail/usage và Block detail.
- [x] Port Obligation Library tabs: Obligation Type, Obligation Element, Element Type.
- [ ] Port Product flow.
- [x] Port Builder.
- [x] Port Config / Simulation.
- [x] Port Release / Catalog.

## Pha 0 - Source of truth

- Chạy `npm run extract:bundle`.
- Đầu ra nằm trong `migration/original/`.
- Không sửa trực tiếp file trong `migration/original/`; chỉ dùng để đối chiếu pixel-perfect.

## Pha 1 - FE shell và API boundary

- `src/app` giữ layout/routing/view registry.
- `src/features/*/api.ts` là chỗ duy nhất biết endpoint.
- Component không gọi `fetch` trực tiếp.
- Các endpoint chưa có BE để comment `TODO(API Px)` theo `api_spec.md`.

## Pha 2 - Dịch từng view

Thứ tự nên làm:

1. Dashboard
2. Ontology / Attribute / Block
3. Business Intent / Product Intent
4. Pattern / Template builder
5. Config
6. Simulation
7. Review / Release / Catalog

Với mỗi view:

- Copy block DSL từ `migration/original/template.html`.
- Dịch `sc-if`, `sc-for`, mustache, inline style sang JSX.
- Tách data từ `renderVals()` vào hook riêng.
- Đưa mảng tĩnh sang `mockData.ts`.
- Bọc bằng API function trong `api.ts`.

## Pha 3 - State

- State điều hướng/view: `src/app`.
- State form/canvas builder: feature-local reducer hoặc Zustand slice.
- State server/cache: React Query.
- Giữ tên field gốc khi port logic để tránh lệch hành vi.

## Pha 4 - Thay mock bằng BE

- Giữ UI và hook không đổi.
- Chỉ thay implementation trong `features/<domain>/api.ts`.
- Nếu endpoint đổi tên, sửa ở API layer, không sửa component.

## Nguyên tắc pixel-perfect

- Giai đoạn đầu giữ inline style.
- Chỉ chuyển sang CSS Modules khi view đã chạy ổn và có ảnh đối chiếu.
- Không refactor màu/font/spacing trong lúc đang port logic.

## Lát tiếp theo

Phần Máy 1 hiện đã có nền Foundation Library: Ontology overview, Attribute, Block và Obligation Library. Lát tiếp theo toàn dự án có thể chuyển sang Máy 2 `Product Flow` hoặc Máy 3 `Builder shell`, tùy thứ tự merge.

## Chia việc nhiều máy

Kế hoạch chia cụ thể cho 3 máy nằm ở `../WORK_SPLIT_3_MACHINES.md`.

# Product Factory 5.1 FE

Thư mục này là điểm bắt đầu để tách HTML mô phỏng Product Factory 5.1 thành dự án FE thật.

## Quy trình được chốt

1. Giải nén bundle gốc bằng `npm run extract:bundle`.
2. Giữ `migration/original/template.html`, CSS, JS và asset làm nguồn đối chiếu pixel-perfect.
3. Dịch từng view từ DSL `sc-if` / `sc-for` / mustache sang JSX, không dịch toàn bộ 1 lần.
4. Tách dữ liệu theo feature hook và API boundary.
5. Trong giai đoạn chưa có BE, các hàm `features/*/api.ts` giữ chữ ký API và trả mock/MSW.
6. Khi BE sẵn sàng, chỉ thay implementation trong `features/*/api.ts` hoặc `shared/api/httpClient.ts`.

## Cấu trúc

```txt
src/
  app/              Shell, route/view registry, React Query provider
  features/         Mỗi domain có api.ts, hooks.ts, mockData.ts, screens/
  shared/api/       Http client và kiểu response chung
  shared/ui/        Component dùng chung
  mocks/            MSW handlers
  styles/           CSS global và font-face trích từ bundle
tools/              Script extract/check migration
migration/original/ Nguồn đã trích từ HTML gốc
```

## Lưu ý API

Các API trong `api_spec.md` hiện được để ở dạng placeholder có comment `TODO(API)`. Mục tiêu là FE không gọi thẳng `fetch` rải rác trong component. Component chỉ gọi hook, hook gọi `features/<domain>/api.ts`.

# Cộng tác FE Product Factory 5.1

## Cách chia việc

Mỗi người hoặc mỗi máy nên nhận một feature folder riêng để tránh conflict:

- `src/app`: shell, navigation, route registry.
- `src/features/dashboard`: Dashboard.
- `src/features/ontology`: Ontology / Element Type / Obligation Type.
- `src/features/attributes`: Attribute.
- `src/features/blocks`: Block / Answer Slot.
- `src/features/product`: Business Intent / Product Intent / Pattern / Template list.
- `src/features/builder`: Pattern / Template builder.
- `src/features/config`: Product Config.
- `src/features/simulation`: Simulation Engine.
- `src/features/release`: Review / Release / Catalog.

## Quy tắc branch

Tạo branch theo mẫu:

```txt
fe/<feature-name>
```

Ví dụ:

```txt
fe/attribute-list
fe/block-library
fe/product-flow
fe/builder-canvas
```

## Quy tắc code

- Không sửa trực tiếp `FE/migration/original`.
- Component không gọi `fetch` trực tiếp.
- API thật hoặc mock phải đi qua `features/<domain>/api.ts`.
- Dữ liệu hardcode tạm thời đặt trong `mockData.ts`.
- Mỗi view port xong phải giữ gần 1:1 với HTML gốc trước khi refactor style.

## Trước khi merge

Chạy trong thư mục `FE`:

```txt
npm run build
npm run check:api-placeholders
```

Nếu đổi endpoint hoặc response shape, cập nhật `api_spec.md` trong cùng PR.

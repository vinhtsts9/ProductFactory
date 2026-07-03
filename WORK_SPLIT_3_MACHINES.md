# Chia việc chuyển đổi FE cho 3 máy

Tài liệu này dành cho người mới tham gia dự án. Đọc từ trên xuống trước khi nhận task.

## 1. Bắt đầu đọc từ đâu?

Người mới vào dự án nên đọc theo thứ tự này:

1. `WORK_SPLIT_3_MACHINES.md`
   - Hiểu bối cảnh, mục tiêu chung, chia việc 3 máy và việc của mình.
2. `FE/MIGRATION_PLAN.md`
   - Xem tiến độ hiện tại và lát tiếp theo.
3. `CONTRIBUTING.md`
   - Xem quy tắc branch, quy tắc code, lệnh build/check trước khi merge.
4. `api_spec.md`
   - Xem API dự kiến. Backend chưa có đủ nên FE tạm mock qua `features/<domain>/api.ts`.
5. `FE/migration/original/template.html`
   - Source giao diện gốc đã extract từ `Product Factory 5.1.html`. Chỉ đọc để đối chiếu, không sửa.

## 2. Bối cảnh chung

`Product Factory 5.1.html` là file UI mô phỏng hệ thống, hiện đang hardcode dữ liệu để demo luồng nghiệp vụ.

Mục tiêu của dự án là tách file HTML này thành một dự án FE React/Vite hoàn chỉnh trong thư mục `FE/`, theo hướng:

```txt
HTML hardcode gốc
-> extract asset/template gốc
-> dựng React/Vite app
-> port từng view 1:1
-> tách data/state theo feature
-> để API boundary sẵn
-> khi có backend thì thay mock bằng API thật
```

Điểm quan trọng:

- Không cố convert toàn bộ HTML một lần.
- Port từng view nhỏ để dễ review.
- Giai đoạn đầu ưu tiên giống UI gốc hơn là refactor đẹp.
- Component không gọi `fetch` trực tiếp.
- API thật hoặc mock đều đi qua `features/<domain>/api.ts`.

## 3. Trạng thái hiện tại

Đã xong:

- Project React/Vite trong `FE/`.
- Extract bundle gốc vào `FE/migration/original/`.
- Shell/sidebar/topbar và route state trong `FE/src/app`.
- Dashboard overview.
- Ontology overview.
- API boundary cơ bản trong `features/*/api.ts`.

Chưa xong:

- Attribute / Block.
- Product flow.
- Builder.
- Config / Simulation.
- Release / Catalog.

## 4. Làm xong thì cập nhật vào đâu?

Sau khi hoàn thành một lát việc, cập nhật các nơi sau:

1. `FE/MIGRATION_PLAN.md`
   - Tick checklist phần đã xong.
   - Ghi lát tiếp theo nếu có.

2. `WORK_SPLIT_3_MACHINES.md`
   - Chỉ cập nhật nếu phạm vi chia việc thay đổi, có thêm owner mới, hoặc đổi thứ tự ưu tiên.

3. `api_spec.md`
   - Chỉ cập nhật nếu đổi endpoint, đổi request/response shape, hoặc thêm API mới.

4. `CONTRIBUTING.md`
   - Chỉ cập nhật nếu đổi quy tắc branch, build, merge, hoặc convention code.

5. Trong feature đang làm:

```txt
FE/src/features/<domain>/api.ts
FE/src/features/<domain>/hooks.ts
FE/src/features/<domain>/mockData.ts
FE/src/features/<domain>/types.ts
FE/src/features/<domain>/screens/<Page>.tsx
```

## 5. Quy tắc chung cho cả 3 máy

- Mỗi máy tự tạo branch Git của máy mình từ `main`.
- Không code trực tiếp trên `main`.
- Không dùng chung branch giữa nhiều máy.
- Không sửa `FE/migration/original`.
- Không commit `FE/node_modules` hoặc `FE/dist`.
- Không gọi `fetch` trực tiếp trong component.
- Mỗi feature nên đi theo mẫu:

```txt
features/<domain>/api.ts
features/<domain>/hooks.ts
features/<domain>/mockData.ts
features/<domain>/types.ts
features/<domain>/screens/<Page>.tsx
```

- Nếu thêm route/menu, sửa `FE/src/app/navigation.ts` trong PR nhỏ riêng hoặc báo trước.
- Nếu nối page mới vào app, sửa `FE/src/app/App.tsx`.
- Trước khi push branch:

```txt
cd FE
npm run build
npm run check:api-placeholders
```

## 6. Máy 1 - Foundation Library

Branch:

```txt
fe/m1-foundation-library
```

Máy 1 tự tạo branch:

```txt
git checkout main
git pull
git checkout -b fe/m1-foundation-library
```

Owner folders:

```txt
FE/src/features/attributes
FE/src/features/blocks
FE/src/features/ontology
```

Không nên sửa:

```txt
FE/src/features/product
FE/src/features/builder
FE/src/features/config
FE/src/features/simulation
```

Mục tiêu:

Máy 1 làm nền dữ liệu dùng lại cho các màn sau: Attribute, Block, Element Type, Obligation Type.

Nhiệm vụ theo thứ tự:

1. Tạo `features/attributes` gồm list page, detail/usage page, mock data, API placeholder.
2. Tạo `features/blocks` gồm list page, block detail, answer slot preview.
3. Hoàn thiện ontology còn thiếu nếu cần: Element Type list, Obligation Type list.
4. Chuẩn hóa type dùng chung cho Block, Attribute, Element Type.

API liên quan:

- `GET /api/element-types`
- `GET /api/obligation-types`
- `GET /api/blocks`
- `GET /api/attributes`
- `GET /api/attributes/:code`
- `GET /api/blocks/:code`

Definition of Done:

- Click được menu `Attribute`, `Block`, `Obligation Library` hoặc route tương ứng.
- Data nằm trong `mockData.ts`.
- Component chỉ gọi hook.
- Build pass.
- Cập nhật `FE/MIGRATION_PLAN.md`.

## 7. Máy 2 - Product Flow

Branch:

```txt
fe/m2-product-flow
```

Máy 2 tự tạo branch:

```txt
git checkout main
git pull
git checkout -b fe/m2-product-flow
```

Owner folders:

```txt
FE/src/features/product
```

Có thể tạo thêm nếu muốn tách rõ:

```txt
FE/src/features/business-intent
FE/src/features/product-intent
```

Không nên sửa:

```txt
FE/src/features/builder
FE/src/features/config
FE/src/features/simulation
FE/src/features/attributes
FE/src/features/blocks
```

Mục tiêu:

Máy 2 port luồng sản phẩm từ Business Intent đến Pattern/Template list. Đây là phần nối từ ý định kinh doanh sang khuôn sản phẩm.

Nhiệm vụ theo thứ tự:

1. Port Business Intent list.
2. Port Product Intent list.
3. Port Pattern list.
4. Port Template list.
5. Tạo wizard tối giản cho Business Intent / Product Intent nếu scope cho phép.
6. Đưa mock data vào đúng domain và giữ API placeholder.

API liên quan:

- `GET /api/business-intents`
- `POST /api/business-intents`
- `GET /api/product-intents`
- `POST /api/product-intents`
- `GET /api/patterns`
- `GET /api/templates`

Definition of Done:

- Các menu `Business Intent`, `Product Intent`, `Product Pattern`, `Product Template` không còn placeholder.
- List/table render được bằng mock.
- Action tạo mới có thể mở form/wizard mock hoặc placeholder có cấu trúc.
- Build pass.
- Cập nhật `FE/MIGRATION_PLAN.md`.

## 8. Máy 3 - Builder, Config, Simulation, Release

Branch:

```txt
fe/m3-builder-simulation
```

Máy 3 tự tạo branch:

```txt
git checkout main
git pull
git checkout -b fe/m3-builder-simulation
```

Owner folders:

```txt
FE/src/features/builder
FE/src/features/config
FE/src/features/simulation
FE/src/features/release
```

Không nên sửa:

```txt
FE/src/features/attributes
FE/src/features/blocks
FE/src/features/product
```

Mục tiêu:

Máy 3 làm các màn thao tác sâu: dựng Pattern/Template, cấu hình Product Config, chạy Simulation và phát hành Catalog.

Nhiệm vụ theo thứ tự:

1. Tạo builder shell: palette, canvas, selected block panel.
2. Tạo config list và config form.
3. Port Simulation overview: input panel, KPI result, schedule preview.
4. Tạo Release / Catalog page sau khi Config mock ổn.

API liên quan:

- `GET /api/configs`
- `GET /api/configs/:id`
- `POST /api/configs`
- `GET /api/simulations/catalog`
- `POST /api/simulations/run`
- `GET /api/releases`
- `POST /api/releases`
- `GET /api/catalog`

Definition of Done:

- Menu `Product Config`, `Simulation Engine`, `Quy trình phát hành`, `Product Catalog` có page thật hoặc shell đầy đủ.
- Builder có layout 3 vùng: palette, canvas, inspector.
- Simulation có mock result ổn định.
- Build pass.
- Cập nhật `FE/MIGRATION_PLAN.md`.

## 9. Thứ tự merge đề xuất

1. Merge Máy 1 trước nếu có type nền cho Attribute/Block.
2. Merge Máy 2 sau khi list product flow chạy được.
3. Merge Máy 3 theo từng lát nhỏ: builder shell trước, config sau, simulation sau.

Không nên merge một PR quá lớn. Mỗi PR nên tương ứng một lát:

- `attributes-list`
- `blocks-list`
- `business-intent-list`
- `product-intent-list`
- `builder-shell`
- `config-list`
- `simulation-overview`

## 10. File chung cần cẩn thận

Các file sau dễ conflict:

```txt
FE/src/app/App.tsx
FE/src/app/navigation.ts
FE/MIGRATION_PLAN.md
api_spec.md
```

Quy tắc: nếu phải sửa file chung, làm PR nhỏ và merge sớm.

## 11. Quy trình làm việc cho mỗi máy

```txt
git checkout main
git pull
git checkout -b fe/<machine>-<feature>
cd FE
npm install
npm run dev
```

Ví dụ:

```txt
git checkout -b fe/m1-foundation-library
git checkout -b fe/m2-product-flow
git checkout -b fe/m3-builder-simulation
```

Khi làm xong:

```txt
cd FE
npm run build
npm run check:api-placeholders
cd ..
git status
git add .
git commit -m "<short feature summary>"
git push -u origin fe/<machine>-<feature>
```

Sau đó mở Pull Request vào `main`.

# Product Factory 5.1 - API Spec MVP

Tai lieu nay duoc viet dua tren `api_analysis.md`, sap xep theo dung thu tu uu tien P0 -> P4 va chon cach trien khai don gian truoc. Pham vi MVP: khong gom User/Auth, khong workflow phuc tap, khong audit nang cao. Backend chi can cung cap du lieu that thay cho mock/hardcode hien tai.

## Nguyen tac chung

### Base URL

```txt
/api
```

### Response chuan

Danh sach:

```json
{
  "items": [],
  "total": 0
}
```

Chi tiet:

```json
{
  "id": "string",
  "code": "string",
  "name": "string"
}
```

Loi:

```json
{
  "message": "Not found",
  "status": 404
}
```

### Quy uoc MVP

- Dung REST don gian: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- `POST` tra ve `201 Created` va object vua tao.
- `PUT` update toan bo object theo payload gui len.
- `PATCH /:id/status` chi doi trang thai.
- Pagination optional cho MVP. Neu lam ngay thi dung `?page=1&pageSize=20`.
- Search/filter optional, nhung nen nhan query param de FE khong phai doi lai sau.
- Cac field dem nhu `typeCount`, `elementCount`, `variantCount` co the tinh o backend hoac cache.

---

## P0 - Nen tang du lieu

P0 la nhom can lam dau tien. Cac API nay thay the truc tiep `mockOntology`, `mockAttributes`, `mockBlocks` va cac list hardcode nen nen uu tien seed data vao database truoc, sau do CRUD co ban.

### 1. Obligation Element Type

Quan ly 6 chieu phan loai nghia vu.

#### Endpoints

| Method | Path                       | Muc dich               |
| ------ | -------------------------- | ---------------------- |
| `GET`  | `/api/element-types`       | Danh sach element type |
| `GET`  | `/api/element-types/:code` | Chi tiet element type  |
| `POST` | `/api/element-types`       | Tao moi                |
| `PUT`  | `/api/element-types/:code` | Cap nhat               |

#### ElementType

```json
{
  "code": "OET_NATURE",
  "name": "Obligation Nature",
  "short": "Ban chat",
  "description": "Dinh danh ban chat nghia vu",
  "identify": true,
  "elementCount": 3
}
```

### 2. Obligation Element

Quan ly cac phan tu cu the thuoc tung element type.

#### Endpoints

| Method | Path                                   | Muc dich                 |
| ------ | -------------------------------------- | ------------------------ |
| `GET`  | `/api/elements?elementType=OET_NATURE` | Danh sach element        |
| `GET`  | `/api/elements/:code`                  | Chi tiet element         |
| `POST` | `/api/elements`                        | Tao moi                  |
| `PUT`  | `/api/elements/:code`                  | Cap nhat                 |
| `GET`  | `/api/elements/:code/usage`            | So noi dang dung element |

#### Element

```json
{
  "code": "TERM_LOAN_OBLIGATION",
  "name": "No 1 chieu di vay",
  "elementType": "OET_NATURE",
  "description": "",
  "usedByTypeCount": 3
}
```

### 3. Obligation Type Family

Quan ly family cua obligation type.

#### Endpoints

| Method | Path                  | Muc dich                             |
| ------ | --------------------- | ------------------------------------ |
| `GET`  | `/api/families`       | Danh sach family                     |
| `GET`  | `/api/families/:code` | Chi tiet family kem obligation types |
| `POST` | `/api/families`       | Tao moi                              |
| `PUT`  | `/api/families/:code` | Cap nhat                             |

#### Family

```json
{
  "code": "FAM_LOAN",
  "name": "Loan Obligation",
  "archetype": "Term Loan",
  "color": "#0E8C5A",
  "typeCount": 3
}
```

### 4. Obligation Type

To hop element thanh khuon nghia vu.

#### Endpoints

| Method  | Path                                                     | Muc dich                           |
| ------- | -------------------------------------------------------- | ---------------------------------- |
| `GET`   | `/api/obligation-types?family=FAM_LOAN&status=published` | Danh sach obligation type          |
| `GET`   | `/api/obligation-types/:code`                            | Chi tiet obligation type           |
| `POST`  | `/api/obligation-types`                                  | Tao moi                            |
| `PUT`   | `/api/obligation-types/:code`                            | Cap nhat                           |
| `PATCH` | `/api/obligation-types/:code/status`                     | Doi trang thai                     |
| `GET`   | `/api/obligation-types/:code/decomposition`              | Tach composition theo element type |

#### ObligationType

```json
{
  "code": "OT_PLEDGE_INSTALLMENT",
  "name": "Vay cam co tra gop",
  "family": "FAM_LOAN",
  "archetype": "Term Loan",
  "role": "Primary",
  "products": 8,
  "status": "published",
  "composition": {
    "OET_NATURE": "TERM_LOAN_OBLIGATION",
    "OET_VALUE": "PRINCIPAL_NO_INCREASE_MULTI_DECREASE",
    "OET_ACTIVATION": "EVENT_LENDER_DISBURSEMENT",
    "OET_FULFILLMENT": "PAYMENT_MULTISTEP_INSTALLMENT",
    "OET_RECOVERY": "ASSET_PLEDGE",
    "OET_TIME": "CALENDAR_HAS_CYCLE_HAS_DEADLINE"
  }
}
```

### 5. Financial Obligation Archetype

Quan ly cac khuon nghia vu goc.

#### Endpoints

| Method | Path                    | Muc dich            |
| ------ | ----------------------- | ------------------- |
| `GET`  | `/api/archetypes`       | Danh sach archetype |
| `GET`  | `/api/archetypes/:code` | Chi tiet archetype  |
| `POST` | `/api/archetypes`       | Tao moi             |
| `PUT`  | `/api/archetypes/:code` | Cap nhat            |

#### Archetype

```json
{
  "code": "FOA_TERM_LOAN",
  "name": "Term Loan",
  "description": "",
  "nature": "TERM_LOAN_OBLIGATION",
  "valueStructure": "PRINCIPAL_NO_INCREASE_MULTI_DECREASE",
  "elementCodes": ["TERM_LOAN_OBLIGATION"],
  "typeCodes": ["OT_PLEDGE_INSTALLMENT"]
}
```

### 6. Attribute Dictionary

Tu dien thuoc tinh dung cho slot, template, config, simulation.

#### Endpoints

| Method | Path                                                           | Muc dich                |
| ------ | -------------------------------------------------------------- | ----------------------- |
| `GET`  | `/api/attributes?dataType=Percent&group=Pricing&required=true` | Danh sach attribute     |
| `GET`  | `/api/attributes/:code`                                        | Chi tiet attribute      |
| `POST` | `/api/attributes`                                              | Tao moi                 |
| `PUT`  | `/api/attributes/:code`                                        | Cap nhat                |
| `GET`  | `/api/attributes/:code/where-used`                             | Noi dang dung attribute |
| `GET`  | `/api/attribute-groups`                                        | Danh sach group         |
| `GET`  | `/api/data-types`                                              | Danh sach data type     |

#### Attribute

```json
{
  "code": "base_rate",
  "name": "Lai suat co so",
  "dataType": "Percent",
  "group": "Pricing",
  "domain": "Pricing",
  "required": true,
  "defaultValue": "1.5%/month",
  "constraints": [
    {
      "kind": "range",
      "rule": "0.3% - 1.65%",
      "note": ""
    }
  ],
  "scopeValues": [
    {
      "scope": "Default",
      "type": "default",
      "value": "1.5%/month"
    }
  ],
  "whereUsed": [
    {
      "block": "Interest",
      "slot": "Base Rate",
      "templates": 5,
      "configs": 34,
      "variants": 21
    }
  ]
}
```

### 7. Block & Answer Slot

Quan ly block nghiep vu va answer slot.

#### Endpoints

| Method   | Path                              | Muc dich                 |
| -------- | --------------------------------- | ------------------------ |
| `GET`    | `/api/blocks?group=VanHanh`       | Danh sach block          |
| `GET`    | `/api/blocks/:id`                 | Chi tiet block kem slots |
| `POST`   | `/api/blocks`                     | Tao block                |
| `PUT`    | `/api/blocks/:id`                 | Cap nhat block           |
| `POST`   | `/api/blocks/:id/slots`           | Them slot                |
| `PUT`    | `/api/blocks/:id/slots/:slotCode` | Cap nhat slot            |
| `DELETE` | `/api/blocks/:id/slots/:slotCode` | Xoa slot                 |

#### Block

```json
{
  "id": "BLK_INTEREST",
  "code": "BLOCK_INTEREST",
  "name": "Interest",
  "group": "Operations",
  "governedBy": "TERM_LOAN_OBLIGATION",
  "slots": [
    {
      "code": "base_rate",
      "name": "Base Rate",
      "type": "Percent",
      "required": true,
      "defaultValue": "1.5%/month",
      "rule": "<= regulatory cap",
      "attributeCode": "base_rate"
    }
  ]
}
```

---

## P1 - Pipeline san pham

P1 la luong chinh tu intent den catalog. MVP nen lam CRUD va status truoc, chua can approval workflow phuc tap.

### 8. Business Intent

#### Endpoints

| Method  | Path                                               | Muc dich       |
| ------- | -------------------------------------------------- | -------------- |
| `GET`   | `/api/business-intents?status=draft&owner=Product` | Danh sach      |
| `GET`   | `/api/business-intents/:id`                        | Chi tiet       |
| `POST`  | `/api/business-intents`                            | Tao tu wizard  |
| `PUT`   | `/api/business-intents/:id`                        | Cap nhat       |
| `PATCH` | `/api/business-intents/:id/status`                 | Doi trang thai |

#### BusinessIntent

```json
{
  "id": "BI-001",
  "name": "Mo rong tin dung 2025",
  "owner": "Product",
  "period": "2025",
  "objective": "",
  "kpis": [
    {
      "metric": "Disbursement",
      "target": "1200",
      "unit": "billion VND/year"
    }
  ],
  "archetype": "FOA_TERM_LOAN",
  "segment": {
    "income": "5000000",
    "ageRange": [20, 55],
    "groups": ["Worker"],
    "regions": ["HCM"]
  },
  "status": "draft"
}
```

### 9. Product Intent

#### Endpoints

| Method  | Path                                                        | Muc dich       |
| ------- | ----------------------------------------------------------- | -------------- |
| `GET`   | `/api/product-intents?archetype=FOA_TERM_LOAN&status=draft` | Danh sach      |
| `GET`   | `/api/product-intents/:id`                                  | Chi tiet       |
| `POST`  | `/api/product-intents`                                      | Tao moi        |
| `PUT`   | `/api/product-intents/:id`                                  | Cap nhat       |
| `PATCH` | `/api/product-intents/:id/status`                           | Doi trang thai |

#### ProductIntent

```json
{
  "id": "PI-001",
  "businessIntentId": "BI-001",
  "name": "Vay cam co linh hoat",
  "archetype": "FOA_TERM_LOAN",
  "elementCodes": ["TERM_LOAN_OBLIGATION", "ASSET_PLEDGE"],
  "status": "draft"
}
```

### 10. Product Pattern

#### Endpoints

| Method  | Path                                                              | Muc dich                   |
| ------- | ----------------------------------------------------------------- | -------------------------- |
| `GET`   | `/api/patterns?obligationType=OT_PLEDGE_INSTALLMENT&status=draft` | Danh sach                  |
| `GET`   | `/api/patterns/:id`                                               | Chi tiet                   |
| `POST`  | `/api/patterns`                                                   | Tao moi                    |
| `PUT`   | `/api/patterns/:id`                                               | Cap nhat                   |
| `PATCH` | `/api/patterns/:id/status`                                        | Doi trang thai             |
| `PUT`   | `/api/patterns/:id/blocks`                                        | Cap nhat block tren canvas |
| `PUT`   | `/api/patterns/:id/obligation-types`                              | Gan obligation type        |
| `GET`   | `/api/patterns/:id/coverage`                                      | Lay coverage matrix        |

#### Pattern

```json
{
  "id": "PAT-001",
  "code": "PAT_PLEDGE_INSTALLMENT",
  "name": "Pledge Installment Pattern",
  "obligationTypeCodes": ["OT_PLEDGE_INSTALLMENT"],
  "blocks": [
    {
      "blockId": "BLK_INTEREST",
      "order": 1,
      "required": true
    }
  ],
  "status": "draft"
}
```

### 11. Product Template

#### Endpoints

| Method  | Path                                          | Muc dich             |
| ------- | --------------------------------------------- | -------------------- |
| `GET`   | `/api/templates?pattern=PAT-001&status=draft` | Danh sach            |
| `GET`   | `/api/templates/:id`                          | Chi tiet             |
| `POST`  | `/api/templates`                              | Tao moi              |
| `PUT`   | `/api/templates/:id`                          | Cap nhat             |
| `PATCH` | `/api/templates/:id/status`                   | Doi trang thai       |
| `PUT`   | `/api/templates/:id/frames`                   | Cap nhat frame value |
| `PUT`   | `/api/templates/:id/locks`                    | Khoa/mo khoa block   |

#### Template

```json
{
  "id": "TPL-001",
  "name": "Template cam co tieu chuan",
  "patternId": "PAT-001",
  "audience": "Mass",
  "lockedBlockIds": ["BLK_INTEREST"],
  "frames": [
    {
      "slotCode": "base_rate",
      "min": "0.3%/month",
      "max": "1.65%/month",
      "defaultValue": "1.5%/month"
    }
  ],
  "status": "draft"
}
```

### 12. Product Config

#### Endpoints

| Method   | Path                                         | Muc dich                     |
| -------- | -------------------------------------------- | ---------------------------- |
| `GET`    | `/api/configs?template=TPL-001&status=draft` | Danh sach                    |
| `GET`    | `/api/configs/:id`                           | Chi tiet                     |
| `POST`   | `/api/configs`                               | Tao moi                      |
| `PUT`    | `/api/configs/:id`                           | Cap nhat                     |
| `PATCH`  | `/api/configs/:id/status`                    | Doi trang thai               |
| `GET`    | `/api/configs/:id/slots`                     | Lay slots theo block         |
| `GET`    | `/api/configs/:id/slots/:slotCode/fragments` | Lay fragments cua slot       |
| `POST`   | `/api/configs/:id/slots/:slotCode/fragments` | Them fragment                |
| `DELETE` | `/api/configs/:id/fragments/:fragmentId`     | Xoa fragment                 |
| `POST`   | `/api/configs/:id/resolve`                   | Resolve gia tri theo context |
| `GET`    | `/api/configs/:id/completeness`              | Kiem tra do hoan thien       |
| `GET`    | `/api/configs/:id/constraints`               | Kiem tra rang buoc           |

#### Config

```json
{
  "id": "CFG-001",
  "name": "Config cam co loyalty",
  "templateId": "TPL-001",
  "fragments": [
    {
      "id": "FRG-001",
      "slotCode": "base_rate",
      "scope": {
        "type": "default",
        "label": "Default"
      },
      "value": "1.5%/month",
      "priority": 1
    }
  ],
  "status": "draft"
}
```

#### Resolve request/response

```json
{
  "slotCode": "base_rate",
  "context": {
    "segment": "Loyalty",
    "place": "HCM",
    "time": "Current"
  }
}
```

```json
{
  "resolvedValue": "1.0%/month",
  "winningScope": {
    "type": "people",
    "label": "Segment = Loyalty"
  },
  "priority": 2,
  "reason": "Matched highest priority fragment",
  "allCandidates": [
    {
      "scopeLabel": "Default",
      "value": "1.5%/month",
      "priority": 1
    }
  ]
}
```

### 13. Product Variant

#### Endpoints

| Method  | Path                                                         | Muc dich           |
| ------- | ------------------------------------------------------------ | ------------------ |
| `GET`   | `/api/variants?family=FAM_LOAN&channel=Branch&status=active` | Danh sach          |
| `GET`   | `/api/variants/:id`                                          | Chi tiet           |
| `POST`  | `/api/variants`                                              | Dong goi tu config |
| `PUT`   | `/api/variants/:id`                                          | Cap nhat           |
| `PATCH` | `/api/variants/:id/status`                                   | Publish/retire     |

#### Variant

```json
{
  "id": "VAR-001",
  "name": "Variant cam co loyalty",
  "configId": "CFG-001",
  "family": "FAM_LOAN",
  "channels": ["Branch", "Digital"],
  "status": "active"
}
```

### 14. Product Catalog

#### Endpoints

| Method  | Path                                         | Muc dich                  |
| ------- | -------------------------------------------- | ------------------------- |
| `GET`   | `/api/catalog?family=FAM_LOAN&status=active` | Danh sach                 |
| `GET`   | `/api/catalog/:id`                           | Chi tiet                  |
| `POST`  | `/api/catalog`                               | Them san pham len catalog |
| `PUT`   | `/api/catalog/:id`                           | Cap nhat                  |
| `PATCH` | `/api/catalog/:id/status`                    | Doi trang thai            |

#### CatalogItem

```json
{
  "id": "CAT-001",
  "variantId": "VAR-001",
  "name": "Vay cam co loyalty",
  "family": "FAM_LOAN",
  "limit": "100000000",
  "rate": "1.5%/month",
  "channels": ["Branch", "Digital"],
  "status": "active"
}
```

---

## P2 - Quan tri nghiep vu va vong doi

P2 co the lam song song voi P1 sau khi P0 da co data. MVP nen lam metadata don gian, chua can engine version diff phuc tap.

### 15. Lifecycle & State Machine

| Method | Path                  | Muc dich                    |
| ------ | --------------------- | --------------------------- |
| `GET`  | `/api/lifecycles`     | Danh sach lifecycle         |
| `GET`  | `/api/lifecycles/:id` | Chi tiet states/transitions |
| `POST` | `/api/lifecycles`     | Tao moi                     |
| `PUT`  | `/api/lifecycles/:id` | Cap nhat                    |

```json
{
  "id": "LC_PRODUCT",
  "name": "Product Lifecycle",
  "states": ["draft", "review", "approved", "published", "retired"],
  "transitions": [
    {
      "from": "draft",
      "to": "review",
      "action": "submit"
    }
  ]
}
```

### 16. Domain

| Method | Path               | Muc dich         |
| ------ | ------------------ | ---------------- |
| `GET`  | `/api/domains`     | Danh sach domain |
| `GET`  | `/api/domains/:id` | Chi tiet         |
| `POST` | `/api/domains`     | Tao moi          |
| `PUT`  | `/api/domains/:id` | Cap nhat         |

```json
{
  "id": "DOM_PRICING",
  "name": "Pricing",
  "description": "",
  "owner": "Product"
}
```

### 17. Constraint Matrix

| Method | Path                        | Muc dich              |
| ------ | --------------------------- | --------------------- |
| `GET`  | `/api/matrices`             | Danh sach matrix type |
| `GET`  | `/api/matrices/:type`       | Lay matrix            |
| `PUT`  | `/api/matrices/:type/cells` | Cap nhat nhieu cell   |

```json
{
  "type": "archetype_element",
  "rows": [
    {
      "id": "FOA_TERM_LOAN",
      "label": "Term Loan"
    }
  ],
  "columns": [
    {
      "id": "TERM_LOAN_OBLIGATION",
      "label": "Term Loan Obligation"
    }
  ],
  "cells": [
    {
      "rowId": "FOA_TERM_LOAN",
      "columnId": "TERM_LOAN_OBLIGATION",
      "value": "required"
    }
  ]
}
```

Allowed cell value:

```txt
required | optional | not_applicable
```

### 18. Version History

De don gian, endpoint version dung path rieng thay vi path dong `/api/:entityType/...` de backend de route.

| Method | Path                                                 | Muc dich             |
| ------ | ---------------------------------------------------- | -------------------- |
| `GET`  | `/api/versions?entityType=template&entityId=TPL-001` | Danh sach version    |
| `GET`  | `/api/versions/:id`                                  | Chi tiet version     |
| `POST` | `/api/versions`                                      | Tao snapshot version |
| `POST` | `/api/versions/:id/restore`                          | Restore version      |
| `POST` | `/api/versions/compare`                              | So sanh 2 version    |

```json
{
  "id": "VER-001",
  "entityType": "template",
  "entityId": "TPL-001",
  "version": 1,
  "note": "Initial version",
  "changes": [],
  "author": "System",
  "createdAt": "2026-07-03T00:00:00.000Z"
}
```

---

## P3 - Cong cu nang cao

P3 nen lam sau P1. Hai API nay co logic tinh toan, nen MVP lam input/output on dinh truoc, toi uu thuat toan sau.

### 19. Simulation Engine

| Method | Path                         | Muc dich         |
| ------ | ---------------------------- | ---------------- |
| `POST` | `/api/simulation/run`        | Chay mo phong    |
| `GET`  | `/api/simulation/variants`   | Variant kha dung |
| `GET`  | `/api/simulation/segments`   | Segment kha dung |
| `POST` | `/api/simulation/export/csv` | Export CSV       |
| `POST` | `/api/simulation/pin`        | Ghim kich ban    |
| `POST` | `/api/simulation/compare`    | So sanh kich ban |

Endpoint `export/pdf` co the de sau neu backend chua co render PDF.

```json
{
  "variant": "VAR-001",
  "amount": 30000000,
  "months": 18,
  "rate": 1.5,
  "assetValue": 45000000,
  "segment": "standard",
  "startDate": "2026-07-15",
  "fees": {
    "appraisalFee": 500000,
    "periodicFeePct": 0.15
  },
  "scenarios": {
    "penalty": {
      "enabled": true,
      "period": 6,
      "days": 10
    },
    "prepay": {
      "enabled": true,
      "period": 9,
      "amount": 8000000
    },
    "grace": {
      "enabled": true,
      "months": 2
    },
    "earlySettlement": {
      "enabled": false,
      "period": 12,
      "penaltyPct": 2
    }
  }
}
```

```json
{
  "summary": {
    "totalPayment": 0,
    "totalInterest": 0,
    "totalFee": 0
  },
  "schedule": [
    {
      "period": 1,
      "dueDate": "2026-08-15",
      "principal": 0,
      "interest": 0,
      "fee": 0,
      "total": 0,
      "remainingPrincipal": 0
    }
  ]
}
```

### 20. Release Process

| Method  | Path                                          | Muc dich          |
| ------- | --------------------------------------------- | ----------------- |
| `GET`   | `/api/releases`                               | Danh sach release |
| `GET`   | `/api/releases/:id`                           | Chi tiet          |
| `POST`  | `/api/releases`                               | Tao release       |
| `PATCH` | `/api/releases/:id/steps/:stepIndex/complete` | Hoan thanh step   |
| `PATCH` | `/api/releases/:id/steps/:stepIndex/reopen`   | Mo lai step       |
| `GET`   | `/api/releases/:id/swimlane`                  | Du lieu swimlane  |

```json
{
  "id": "REL-001",
  "name": "Release VAR-001",
  "variantId": "VAR-001",
  "progress": 25,
  "steps": [
    {
      "index": 1,
      "name": "Business approval",
      "completed": true,
      "completedAt": "2026-07-03T00:00:00.000Z"
    }
  ],
  "status": "active"
}
```

---

## P4 - Dashboard va bao cao

P4 chi tong hop du lieu. Nen trien khai cuoi cung, hoac tra fake/calculated data tam thoi neu FE dashboard can demo som.

### 21. Dashboard KPIs

| Method | Path                  | Muc dich  |
| ------ | --------------------- | --------- |
| `GET`  | `/api/dashboard/kpis` | KPI cards |

```json
{
  "items": [
    {
      "key": "activeProducts",
      "label": "Active products",
      "value": "18",
      "delta": "+2",
      "tone": "green"
    }
  ]
}
```

### 22. Dashboard Pipeline

| Method | Path                      | Muc dich                 |
| ------ | ------------------------- | ------------------------ |
| `GET`  | `/api/dashboard/pipeline` | Dem entity theo pipeline |

```json
{
  "items": [
    {
      "key": "intent",
      "label": "Intent",
      "count": 7
    }
  ]
}
```

### 23. Dashboard Activities

| Method | Path                                                           | Muc dich            |
| ------ | -------------------------------------------------------------- | ------------------- |
| `GET`  | `/api/activities?actor=System&type=publish&page=1&pageSize=20` | Danh sach activity  |
| `GET`  | `/api/dashboard/recent-activities`                             | 6 activity gan nhat |

```json
{
  "id": "ACT-001",
  "actor": "System",
  "type": "publish",
  "entityType": "variant",
  "entityId": "VAR-001",
  "message": "Published variant",
  "createdAt": "2026-07-03T00:00:00.000Z"
}
```

### 24. Dashboard Distribution

| Method | Path                                 | Muc dich            |
| ------ | ------------------------------------ | ------------------- |
| `GET`  | `/api/dashboard/family-distribution` | Phan bo theo family |
| `GET`  | `/api/dashboard/status-distribution` | Phan bo theo status |

```json
{
  "items": [
    {
      "key": "FAM_LOAN",
      "label": "Loan Obligation",
      "count": 18
    }
  ]
}
```

### 25. Navigation Counts

| Method | Path          | Muc dich          |
| ------ | ------------- | ----------------- |
| `GET`  | `/api/counts` | Count cho sidebar |

```json
{
  "businessIntent": 7,
  "productIntent": 12,
  "pattern": 8,
  "template": 15,
  "config": 34,
  "variant": 21,
  "catalog": 18,
  "obligation": 47,
  "attribute": 64,
  "block": 26,
  "matrix": 9,
  "lifecycle": 6,
  "domain": 5,
  "archetype": 3
}
```

### 26. Search

| Method | Path                 | Muc dich               |
| ------ | -------------------- | ---------------------- |
| `GET`  | `/api/search?q=loan` | Tim kiem toan he thong |

```json
{
  "items": [
    {
      "entityType": "variant",
      "entityId": "VAR-001",
      "code": "VAR-001",
      "name": "Variant cam co loyalty",
      "description": "",
      "status": "active"
    }
  ],
  "total": 1
}
```

---

## Thu tu trien khai de don gian nhat

1. Seed P0 data: `element-types`, `elements`, `families`, `obligation-types`, `archetypes`, `attributes`, `blocks`.
2. Lam `GET` list/detail cho toan bo P0.
3. Lam `POST/PUT/PATCH` P0 sau khi FE can man hinh quan tri.
4. Lam P1 theo pipeline: `business-intents` -> `product-intents` -> `patterns` -> `templates` -> `configs` -> `variants` -> `catalog`.
5. Chi lam `configs/:id/resolve` sau khi `configs` va fragments da co du lieu that.
6. Lam P2 metadata: `lifecycles`, `domains`, `matrices`, `versions`.
7. Lam P3 `simulation/run` sau cung trong nhom logic tinh toan.
8. Lam P4 dashboard/counts/search khi cac bang chinh da co du lieu.

## Endpoint MVP toi thieu cho FE chay voi data that

Neu can cat scope hon nua, chi can lam truoc cac endpoint sau:

```txt
GET /api/element-types
GET /api/elements
GET /api/families
GET /api/obligation-types
GET /api/archetypes
GET /api/attributes
GET /api/blocks
GET /api/business-intents
GET /api/product-intents
GET /api/patterns
GET /api/templates
GET /api/configs
GET /api/variants
GET /api/catalog
GET /api/counts
GET /api/dashboard/kpis
```

Sau khi cac list tren thay duoc mock data, moi mo rong tiep detail/create/update.

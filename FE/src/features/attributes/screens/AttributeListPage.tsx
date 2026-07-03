import { useState } from "react";
import { FoundationListPage } from "../../../shared/ui/FoundationListPage";
import { useAttributeList } from "../hooks";
import { AttributeDetailPage } from "./AttributeDetailPage";

export function AttributeListPage() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const { data, error, isLoading } = useAttributeList();

  if (selectedCode) {
    return <AttributeDetailPage code={selectedCode} onBack={() => setSelectedCode(null)} />;
  }

  if (isLoading) return <div style={{ padding: 24 }}>Đang tải Attribute...</div>;
  if (error || !data) return <div style={{ padding: 24 }}>Không tải được danh sách Attribute.</div>;

  return <FoundationListPage {...data} onRowClick={(row) => setSelectedCode(row.id)} />;
}

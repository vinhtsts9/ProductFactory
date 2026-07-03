import { useState } from "react";
import { FoundationListPage } from "../../../shared/ui/FoundationListPage";
import { useBlockList } from "../hooks";
import { BlockDetailPage } from "./BlockDetailPage";

export function BlockListPage() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const { data, error, isLoading } = useBlockList();

  if (selectedCode) {
    return <BlockDetailPage code={selectedCode} onBack={() => setSelectedCode(null)} />;
  }

  if (isLoading) return <div style={{ padding: 24 }}>Đang tải Block...</div>;
  if (error || !data) return <div style={{ padding: 24 }}>Không tải được danh sách Block.</div>;

  return <FoundationListPage {...data} onRowClick={(row) => setSelectedCode(row.id)} />;
}

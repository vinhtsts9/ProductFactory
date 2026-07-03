import { useState } from "react";
import { FoundationListPage, type ListTab } from "../../../shared/ui/FoundationListPage";
import { useObligationLibrary } from "../hooks";
import type { ObligationTab } from "../types";

export function ObligationLibraryPage() {
  const [tab, setTab] = useState<ObligationTab>("otype");
  const { data, error, isLoading } = useObligationLibrary(tab);

  if (isLoading) return <div style={{ padding: 24 }}>Đang tải Obligation Library...</div>;
  if (error || !data) return <div style={{ padding: 24 }}>Không tải được Obligation Library.</div>;

  return <FoundationListPage {...data} onTabClick={(nextTab: ListTab) => setTab(nextTab.id as ObligationTab)} />;
}

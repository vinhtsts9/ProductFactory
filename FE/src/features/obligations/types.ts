import type { ListColumn, ListRow, ListTab } from "../../shared/ui/FoundationListPage";

export type ObligationTab = "otype" | "oelement" | "oetype";

export type ObligationLibraryList = {
  tabs: ListTab[];
  searchPlaceholder: string;
  filters: string[];
  actionLabel: string;
  footerText: string;
  columns: ListColumn[];
  rows: ListRow[];
};

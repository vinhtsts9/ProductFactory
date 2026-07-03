export interface ReleaseStep {
  title: string;
  role: string;
  icon: string;
  desc: string;
  goLabel: string;
  go: () => void;
  input: string;
  output: string;
  checklist: string[];
  tip: string;
}

export interface CatalogItem {
  name: string;
  variant: string;
  family: string;
  limit: string;
  rate: string;
  channels: string[];
  cover: string;
  coverIcon: React.ReactNode;
  statusLabel: string;
  statusChipStyle: React.CSSProperties;
}

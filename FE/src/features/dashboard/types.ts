import type { LucideIcon } from "lucide-react";

export type Tone = "green" | "gold" | "review" | "neutral" | "info" | "danger";

export type DashboardKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  tone: Tone;
  icon: LucideIcon;
};

export type PipelineStep = {
  id: string;
  label: string;
  count: string;
  sub: string;
  barHeight: number;
  color: string;
  darkText?: boolean;
};

export type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  channel: string;
  tag: string;
  tone: Tone;
  icon: LucideIcon;
};

export type FamilyDistribution = {
  name: string;
  count: string;
  pct: string;
  color: string;
};

export type StatusBar = {
  label: string;
  count: string;
  pct: string;
  color: string;
};

export type DashboardOverview = {
  kpis: DashboardKpi[];
  pipeline: PipelineStep[];
  activities: ActivityItem[];
  families: FamilyDistribution[];
  statusBars: StatusBar[];
};

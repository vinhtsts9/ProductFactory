import {
  Activity,
  BarChart3,
  Blocks,
  BookOpen,
  Boxes,
  CircleDollarSign,
  FileCog,
  GitBranch,
  LayoutTemplate,
  Library,
  ListChecks,
  Network,
  Rocket,
  Route,
  Shapes,
  Tags,
  Target,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type AppView =
  | "dashboard"
  | "businessintent"
  | "intent"
  | "pattern"
  | "template"
  | "config"
  | "variant"
  | "catalog"
  | "obligation"
  | "ontology"
  | "sysmap"
  | "archetype"
  | "attribute"
  | "block"
  | "matrix"
  | "lifecycle"
  | "domain"
  | "release"
  | "simulation"
  | "activity";

export type NavItem = {
  id: AppView;
  label: string;
  count?: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [{ id: "dashboard", label: "Bảng điều khiển", icon: BarChart3 }],
  },
  {
    label: "Pipeline sản phẩm",
    items: [
      { id: "businessintent", label: "Business Intent", icon: Target, count: "7" },
      { id: "intent", label: "Product Intent", icon: Route, count: "12" },
      { id: "pattern", label: "Product Pattern", icon: GitBranch, count: "8" },
      { id: "template", label: "Product Template", icon: LayoutTemplate, count: "15" },
      { id: "config", label: "Product Config", icon: FileCog, count: "34" },
      { id: "variant", label: "Product Variant", icon: Boxes, count: "21" },
      { id: "catalog", label: "Product Catalog", icon: Library, count: "18" },
    ],
  },
  {
    label: "Thư viện nền tảng",
    items: [
      { id: "obligation", label: "Obligation Library", icon: BookOpen, count: "47" },
      { id: "ontology", label: "Sơ đồ Ontology", icon: Network },
      { id: "sysmap", label: "Sơ đồ quan hệ tổng thể", icon: Workflow },
      { id: "archetype", label: "Financial Obligation Archetype", icon: Shapes, count: "3" },
      { id: "attribute", label: "Attribute", icon: Tags, count: "64" },
      { id: "block", label: "Block & Answer Slot", icon: Blocks, count: "26" },
      { id: "matrix", label: "Ma trận ràng buộc", icon: ListChecks, count: "9" },
      { id: "lifecycle", label: "Lifecycle & State", icon: CircleDollarSign, count: "6" },
      { id: "domain", label: "Domain", icon: Boxes, count: "5" },
    ],
  },
  {
    label: "Công cụ",
    items: [
      { id: "release", label: "Quy trình phát hành", icon: Rocket },
      { id: "simulation", label: "Simulation Engine", icon: Zap },
    ],
  },
  {
    label: "Hệ thống",
    items: [{ id: "activity", label: "Nhật ký hoạt động", icon: Activity }],
  },
];

export const viewMeta: Record<AppView, { title: string; crumb: string }> = {
  dashboard: { title: "Bảng điều khiển", crumb: "Tổng quan" },
  businessintent: { title: "Business Intent", crumb: "Pipeline" },
  intent: { title: "Product Intent", crumb: "Pipeline" },
  pattern: { title: "Product Pattern", crumb: "Pipeline" },
  template: { title: "Product Template", crumb: "Pipeline" },
  config: { title: "Product Config", crumb: "Pipeline" },
  variant: { title: "Product Variant", crumb: "Pipeline" },
  catalog: { title: "Product Catalog", crumb: "Pipeline" },
  obligation: { title: "Obligation Library", crumb: "Thư viện" },
  ontology: { title: "Sơ đồ Ontology nghĩa vụ", crumb: "Thư viện" },
  sysmap: { title: "Sơ đồ quan hệ tổng thể", crumb: "Tổng quan" },
  archetype: { title: "Financial Obligation Archetype", crumb: "Thư viện" },
  attribute: { title: "Attribute", crumb: "Thư viện" },
  block: { title: "Block & Answer Slot", crumb: "Thư viện" },
  matrix: { title: "Ma trận ràng buộc", crumb: "Thư viện" },
  lifecycle: { title: "Lifecycle & State Machine", crumb: "Thư viện" },
  domain: { title: "Domain", crumb: "Thư viện" },
  release: { title: "Quy trình phát hành sản phẩm", crumb: "Công cụ" },
  simulation: { title: "Simulation Engine", crumb: "Công cụ" },
  activity: { title: "Nhật ký hoạt động", crumb: "Hệ thống" },
};

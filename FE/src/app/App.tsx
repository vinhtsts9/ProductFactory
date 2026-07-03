import { useState } from "react";
import { DashboardPage } from "../features/dashboard/screens/DashboardPage";
import { OntologyPage } from "../features/ontology/screens/OntologyPage";
import { BuilderPage } from "../features/builder/screens/BuilderPage";
import { ConfigListPage } from "../features/config/screens/ConfigListPage";
import { ConfigFormPage } from "../features/config/screens/ConfigFormPage";
import { SimulationPage } from "../features/simulation/screens/SimulationPage";
import { ReleasePage } from "../features/release/screens/ReleasePage";
import { CatalogPage } from "../features/release/screens/CatalogPage";
import type { AppView } from "./navigation";
import { Shell } from "./Shell";

export function App() {
  const [view, setView] = useState<AppView>("dashboard");
  const [builderEntity, setBuilderEntity] = useState<"pattern" | "template">("pattern");
  const [selectedConfigId, setSelectedConfigId] = useState<string>("CFG-0042");

  return (
    <Shell activeView={view} onNavigate={setView}>
      {view === "dashboard" ? (
        <DashboardPage />
      ) : view === "ontology" ? (
        <OntologyPage />
      ) : view === "builder" ? (
        <BuilderPage entity={builderEntity} onNavigate={setView} />
      ) : view === "pattern" ? (
        <BuilderPage entity="pattern" onNavigate={setView} />
      ) : view === "template" ? (
        <BuilderPage entity="template" onNavigate={setView} />
      ) : view === "config" ? (
        <ConfigListPage
          onNavigate={setView}
          onSelectConfig={(id) => {
            setSelectedConfigId(id);
            setView("configForm");
          }}
        />
      ) : view === "configForm" ? (
        <ConfigFormPage configId={selectedConfigId} onNavigate={setView} />
      ) : view === "simulation" ? (
        <SimulationPage onNavigate={setView} />
      ) : view === "release" ? (
        <ReleasePage onNavigate={setView} />
      ) : view === "catalog" ? (
        <CatalogPage />
      ) : (
        <PendingView view={view} />
      )}
    </Shell>
  );
}

function PendingView({ view }: { view: AppView }) {
  return (
    <div style={{ padding: "24px 26px", maxWidth: 1100, animation: "fadeUp .3s ease" }}>
      <section style={{ background: "#fff", border: "1px solid #E6ECE8", borderRadius: 8, padding: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#0B7349", textTransform: "uppercase" }}>
          Chờ port view
        </div>
        <h1 style={{ margin: "8px 0 8px", fontSize: 20 }}>View `{view}` đã có route</h1>
        <p style={{ margin: 0, color: "#5E6F66", fontSize: 13.5, lineHeight: 1.6 }}>
          Lát tiếp theo sẽ copy block tương ứng từ `migration/original/template.html`, tách dữ liệu sang
          `mockData.ts`, rồi nối qua hook/API layer.
        </p>
      </section>
    </div>
  );
}

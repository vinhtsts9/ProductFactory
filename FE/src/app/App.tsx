import { useState } from "react";
import { DashboardPage } from "../features/dashboard/screens/DashboardPage";
import { OntologyPage } from "../features/ontology/screens/OntologyPage";
import type { AppView } from "./navigation";
import { Shell } from "./Shell";

export function App() {
  const [view, setView] = useState<AppView>("dashboard");

  return (
    <Shell activeView={view} onNavigate={setView}>
      {view === "dashboard" ? <DashboardPage /> : view === "ontology" ? <OntologyPage /> : <PendingView view={view} />}
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

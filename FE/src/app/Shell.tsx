import type { PropsWithChildren } from "react";
import { Bell, Search } from "lucide-react";
import { navGroups, viewMeta, type AppView } from "./navigation";

const shellStyle = {
  display: "flex",
  height: "100vh",
  width: "100%",
  overflow: "hidden",
  background: "#F4F7F5",
} satisfies React.CSSProperties;

const sidebarStyle = {
  width: 250,
  flex: "none",
  background: "linear-gradient(180deg,#0B3B2E 0%,#082A20 100%)",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
} satisfies React.CSSProperties;

type ShellProps = PropsWithChildren<{
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}>;

export function Shell({ activeView, children, onNavigate }: ShellProps) {
  const meta = viewMeta[activeView];

  return (
    <div style={shellStyle}>
      <aside style={sidebarStyle}>
        <div
          style={{
            padding: "20px 18px 16px",
            display: "flex",
            alignItems: "center",
            gap: 11,
            borderBottom: "1px solid rgba(255,255,255,.07)",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg,#14B870,#0E8C5A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
              boxShadow: "0 4px 12px rgba(14,140,90,.35)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            PF
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14.5, lineHeight: 1.1 }}>
              Product Factory
            </div>
            <div style={{ color: "#7FD8AE", fontSize: 11, fontWeight: 500, marginTop: 2 }}>
              LENDING OS
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px 20px" }}>
          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: 14 }}>
              <div
                style={{
                  color: "#5E8C76",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  padding: "8px 10px 6px",
                }}
              >
                {group.label}
              </div>
              {group.items.map((item) => {
                const active = item.id === activeView;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 10px",
                      borderRadius: 9,
                      marginBottom: 2,
                      color: active ? "#fff" : "#A9CFBE",
                      background: active ? "rgba(20,184,112,.16)" : "transparent",
                      boxShadow: active ? "inset 0 0 0 1px rgba(20,184,112,.25)" : "none",
                      transition: "background .15s",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                      <Icon size={17} color={active ? "#19C079" : "#6E977F"} />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: active ? 600 : 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.label}
                      </span>
                    </span>
                    {item.count ? (
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: "1px 7px",
                          borderRadius: 99,
                          background: active ? "rgba(20,184,112,.25)" : "rgba(255,255,255,.07)",
                          color: active ? "#9EE8C4" : "#6E977F",
                        }}
                      >
                        {item.count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div
          style={{
            padding: "12px 14px",
            borderTop: "1px solid rgba(255,255,255,.07)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#F2B705,#E8920C)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
              color: "#1a1206",
              fontWeight: 700,
              fontSize: 12.5,
            }}
          >
            PD
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                color: "#E8F3EE",
                fontSize: 12.5,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Phạm Designer
            </div>
            <div style={{ color: "#5E8C76", fontSize: 10.5 }}>Product Owner</div>
          </div>
        </div>
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100%" }}>
        <header
          style={{
            height: 60,
            flex: "none",
            background: "#fff",
            borderBottom: "1px solid #E6ECE8",
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            gap: 18,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#8A998F", fontSize: 11.5 }}>
              <span>Product Factory</span>
              <span style={{ color: "#C2D0C8" }}>/</span>
              <span style={{ color: "#0E8C5A", fontWeight: 600 }}>{meta.crumb}</span>
            </div>
            <div
              style={{
                fontSize: 16.5,
                fontWeight: 700,
                color: "#122019",
                marginTop: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {meta.title}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#F4F7F5",
              border: "1px solid #E6ECE8",
              borderRadius: 9,
              padding: "8px 12px",
              width: 300,
            }}
          >
            <Search size={16} color="#8A998F" />
            <input
              placeholder="Tìm mã, sản phẩm, obligation..."
              style={{ border: "none", background: "none", outline: "none", fontSize: 13, color: "#122019", width: "100%" }}
            />
            <span style={{ fontSize: 10.5, color: "#A7B5AC", border: "1px solid #DCE5DF", borderRadius: 5, padding: "1px 5px", fontWeight: 600 }}>
              Ctrl K
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#DCF3E7",
              border: "1px solid #B7E6CE",
              borderRadius: 8,
              padding: "6px 11px",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#0E8C5A",
                boxShadow: "0 0 0 3px rgba(14,140,90,.18)",
              }}
            />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#0B7349", letterSpacing: 0.3 }}>PROD</span>
          </div>

          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: 9,
              border: "1px solid #E6ECE8",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              color: "#41524A",
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: "absolute",
                top: 8,
                right: 9,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#E8920C",
                border: "1.5px solid #fff",
              }}
            />
          </button>
        </header>

        <main style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>{children}</main>
      </div>
    </div>
  );
}

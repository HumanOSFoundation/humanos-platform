"use client";

import dynamic from "next/dynamic";

const HumanitarianMap = dynamic(
  () => import("@/components/map/HumanitarianMap"),
  {
    ssr: false,
  }
);
const menuItems = [
  "Operations Center",
  "Humanitarian Signals",
  "Emergencies",
  "Needs",
  "Resources",
  "Organizations",
  "Logistics",
  "Traceability",
  "Reports",
];

const priorities = [
  {
    level: "CRITICAL",
    location: "Caribbean Region",
    issue: "Medical support capacity required",
    time: "Immediate attention",
    color: "#ef4444",
  },
  {
    level: "HIGH",
    location: "Central America",
    issue: "Temporary shelter gap detected",
    time: "Review within 2 hours",
    color: "#f59e0b",
  },
  {
    level: "MONITOR",
    location: "Northern South America",
    issue: "Weather conditions evolving",
    time: "Updated 8 minutes ago",
    color: "#38bdf8",
  },
];

const activity = [
  "Humanitarian signal received",
  "Organization capability updated",
  "Medical inventory verified",
  "Transportation route reviewed",
];

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#071827",
        color: "#f8fafc",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <header
        style={{
          height: "74px",
          padding: "0 28px",
          borderBottom: "1px solid #203446",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0a1d2e",
        }}
      >
        <div>
          <div
            style={{
              color: "#4fd1c5",
              fontSize: "26px",
              fontWeight: 700,
            }}
          >
            HumanOS™
          </div>

          <div
            style={{
              color: "#94a3b8",
              fontSize: "12px",
              marginTop: "4px",
              letterSpacing: "1.5px",
            }}
          >
            HUMANITARIAN OPERATIONS CENTER
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            color: "#cbd5e1",
            fontSize: "14px",
          }}
        >
          <span>System Operational</span>
          <span>Alerts 3</span>

          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "#17344b",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
            }}
          >
            RL
          </div>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "230px minmax(0, 1fr) 320px",
          minHeight: "calc(100vh - 74px)",
        }}
      >
        <aside
          style={{
            padding: "24px 18px",
            borderRight: "1px solid #203446",
            background: "#081b2b",
          }}
        >
          <p
            style={{
              color: "#64748b",
              fontSize: "11px",
              letterSpacing: "1.5px",
              margin: "0 12px 16px",
            }}
          >
            OPERATIONS
          </p>

          {menuItems.map((item, index) => (
            <div
              key={item}
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                marginBottom: "5px",
                background: index === 0 ? "#12364b" : "transparent",
                color: index === 0 ? "#4fd1c5" : "#cbd5e1",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {item}
            </div>
          ))}
        </aside>

        <section style={{ padding: "26px", minWidth: 0 }}>
          <div style={{ marginBottom: "22px" }}>
            <h1
              style={{
                fontSize: "28px",
                margin: 0,
                fontWeight: 500,
              }}
            >
              Good morning, Ricardo.
            </h1>

            <p
              style={{
                color: "#94a3b8",
                margin: "8px 0 0",
              }}
            >
              Three operations currently require attention.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "14px",
              marginBottom: "18px",
            }}
          >
            {[
              ["Active Operations", "12"],
              ["People Waiting", "4,280"],
              ["Resources Moving", "31"],
              ["Capability Gaps", "7"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  padding: "18px",
                  background: "#0d2639",
                  border: "1px solid #203b50",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "12px",
                    marginBottom: "10px",
                  }}
                >
                  {label}
                </div>

                <div
                  style={{
                    fontSize: "27px",
                    fontWeight: 600,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
<HumanitarianMap />
          <div
            style={{display: "none",
              height: "430px",
              borderRadius: "14px",
              border: "1px solid #23445a",
              background:
                "radial-gradient(circle at 48% 48%, #16435c 0%, #0c2a3e 28%, #081d2d 70%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "22px",
                top: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  letterSpacing: "1.5px",
                }}
              >
                GLOBAL OPERATING PICTURE
              </div>

              <div
                style={{
                  marginTop: "6px",
                  fontSize: "18px",
                }}
              >
                Live Humanitarian Operations
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                inset: "90px 60px 60px",
                border: "1px dashed #31536a",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: "#68869a",
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "48px" }}>◎</div>
                <div style={{ marginTop: "10px" }}>
                  Interactive global map
                </div>
                <div style={{ fontSize: "12px", marginTop: "6px" }}>
                  Signals · Operations · Resources · Capabilities
                </div>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: "47%",
                top: "42%",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: "#ef4444",
                boxShadow: "0 0 0 8px rgba(239,68,68,0.18)",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: "34%",
                top: "58%",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#f59e0b",
                boxShadow: "0 0 0 7px rgba(245,158,11,0.16)",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: "61%",
                top: "63%",
                width: "11px",
                height: "11px",
                borderRadius: "50%",
                background: "#38bdf8",
                boxShadow: "0 0 0 7px rgba(56,189,248,0.16)",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "18px",
              padding: "18px",
              borderRadius: "12px",
              border: "1px solid #203b50",
              background: "#0d2639",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                letterSpacing: "1.4px",
                marginBottom: "16px",
              }}
            >
              LIVE OPERATION FEED
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              {activity.map((item, index) => (
                <div key={item}>
                  <div
                    style={{
                      color: "#4fd1c5",
                      fontSize: "12px",
                      marginBottom: "6px",
                    }}
                  >
                    10:{12 + index * 7}
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#dbeafe",
                    }}
                  >
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside
          style={{
            padding: "26px 20px",
            borderLeft: "1px solid #203446",
            background: "#081b2b",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              letterSpacing: "1.5px",
              marginBottom: "16px",
            }}
          >
            AI OPERATIONAL PRIORITIES
          </div>

          {priorities.map((priority) => (
            <div
              key={priority.location}
              style={{
                padding: "16px",
                marginBottom: "13px",
                borderRadius: "12px",
                border: "1px solid #203b50",
                background: "#0d2639",
              }}
            >
              <div
                style={{
                  color: priority.color,
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                }}
              >
                {priority.level}
              </div>

              <div
                style={{
                  fontSize: "16px",
                  marginTop: "8px",
                  fontWeight: 600,
                }}
              >
                {priority.location}
              </div>

              <div
                style={{
                  color: "#cbd5e1",
                  fontSize: "13px",
                  marginTop: "7px",
                  lineHeight: 1.5,
                }}
              >
                {priority.issue}
              </div>

              <div
                style={{
                  color: "#64748b",
                  fontSize: "11px",
                  marginTop: "9px",
                }}
              >
                {priority.time}
              </div>
            </div>
          ))}

          <button
            type="button"
            style={{
              position: "fixed",
              right: "24px",
              bottom: "24px",
              padding: "13px 18px",
              border: "none",
              borderRadius: "28px",
              background: "#4fd1c5",
              color: "#06202a",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(79,209,197,0.25)",
            }}
          >
            Chat with HumanOS
          </button>
        </aside>
      </div>
    </main>
  );
}
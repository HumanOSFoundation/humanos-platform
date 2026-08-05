"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
type SignalSeverity = "Critical" | "High" | "Monitor";
type SignalStatus = 
"New" 
| "Under Review" 
| "Verified" 
| "Rejected"
| "Converted to Incident"

type HumanitarianSignal = {
  id: string;
  type: string;
  location: string;
  severity: SignalSeverity;
  status: SignalStatus;
  source: string;
  time: string;
  description: string;
  color: string;
};

const initialSignals: HumanitarianSignal[] = [
  {
    id: "SIG-001",
    type: "Severe Weather",
    location: "Caribbean Region",
    severity: "Critical",
    status: "New",
    source: "Weather Monitoring",
    time: "2 minutes ago",
    description:
      "Rapidly evolving weather conditions may affect coastal communities.",
    color: "#ef4444",
  },
  {
    id: "SIG-002",
    type: "Shelter Capacity",
    location: "Central America",
    severity: "High",
    status: "New",
    source: "Humanitarian Organization",
    time: "18 minutes ago",
    description:
      "Available temporary shelter capacity is below projected demand.",
    color: "#f59e0b",
  },
  {
    id: "SIG-003",
    type: "Health Monitoring",
    location: "Northern South America",
    severity: "Monitor",
    status: "Under Review",
    source: "Medical Network",
    time: "34 minutes ago",
    description:
      "Medical organizations are reporting increased demand for assistance.",
    color: "#38bdf8",
  },
];

export default function HumanitarianSignals() {
  const router = useRouter();
  const [signals, setSignals] =
    useState<HumanitarianSignal[]>(initialSignals);

  const [selectedSignalId, setSelectedSignalId] = useState(
    initialSignals[0]?.id ?? "",
  );
const [createdIncident, setCreatedIncident] = useState<string | null>(null);
  const selectedSignal = useMemo(
    () => signals.find((signal) => signal.id === selectedSignalId),
    [signals, selectedSignalId],
  );

  function updateSignalStatus(
    signalId: string,
    status: SignalStatus,
  ): void {
    setSignals((currentSignals) =>
      currentSignals.map((signal) =>
        signal.id === signalId ? { ...signal, status } : signal,
      ),
    );
  }
function convertToIncident(signalId: string): void {
  const signal = signals.find((item) => item.id === signalId);

  if (!signal) {
    return;
  }

  const incidentId = `INC-${signalId.replace("SIG-", "")}`;

  updateSignalStatus(signalId, "Converted to Incident");
  setCreatedIncident(incidentId);

  const query = new URLSearchParams({
    signal: signal.id,
    title: signal.type,
    severity: signal.severity,
    location: signal.location,
    description: signal.description,
  });

  router.push(`/incidents/${incidentId}?${query.toString()}`);
}
  return (
    <section
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: "11px",
              letterSpacing: "1.5px",
            }}
          >
            HUMANITARIAN SIGNALS
          </div>

          <div
            style={{
              color: "#f8fafc",
              fontSize: "18px",
              marginTop: "5px",
            }}
          >
            Signals Requiring Review
          </div>
        </div>

        <div
          style={{
            padding: "6px 10px",
            borderRadius: "20px",
            background: "#12364b",
            color: "#4fd1c5",
            fontSize: "12px",
          }}
        >
          {signals.length} active
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 0.8fr)",
          gap: "14px",
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: "10px" }}>
          {signals.map((signal) => {
            const isSelected = signal.id === selectedSignalId;

            return (
              <button
                key={signal.id}
                type="button"
                onClick={() => setSelectedSignalId(signal.id)}
                aria-pressed={isSelected}
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "8px minmax(0, 1fr) auto",
                  gap: "14px",
                  alignItems: "center",
                  padding: "14px",
                  borderRadius: "10px",
                  border: isSelected
                    ? "1px solid #4fd1c5"
                    : "1px solid #203b50",
                  background: isSelected ? "#0f2d42" : "#0a2031",
                  color: "#f8fafc",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "42px",
                    borderRadius: "8px",
                    background: signal.color,
                  }}
                />

                <span>
                  <span
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <strong>{signal.type}</strong>

                    <span
                      style={{
                        color: signal.color,
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {signal.severity}
                    </span>

                    <span
                      style={{
                        padding: "3px 7px",
                        borderRadius: "10px",
                        background: "#16364b",
                        color: "#cbd5e1",
                        fontSize: "10px",
                      }}
                    >
                      {signal.status}
                    </span>
                  </span>

                  <span
                    style={{
                      display: "block",
                      color: "#cbd5e1",
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    {signal.description}
                  </span>

                  <span
                    style={{
                      display: "block",
                      color: "#64748b",
                      fontSize: "11px",
                      marginTop: "6px",
                    }}
                  >
                    {signal.id} · {signal.location}
                  </span>
                </span>

                <span
                  style={{
                    color: "#64748b",
                    fontSize: "11px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {signal.time}
                </span>
              </button>
            );
          })}
        </div>

        {selectedSignal && (
          <aside
            style={{
              padding: "16px",
              borderRadius: "10px",
              border: "1px solid #203b50",
              background: "#091d2c",
            }}
          >
            <div
              style={{
                color: "#94a3b8",
                fontSize: "10px",
                letterSpacing: "1.2px",
              }}
            >
              SIGNAL DETAILS
            </div>

            <h3
              style={{
                margin: "8px 0 4px",
                color: "#f8fafc",
                fontSize: "18px",
              }}
            >
              {selectedSignal.type}
            </h3>

            <div
              style={{
                color: selectedSignal.color,
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {selectedSignal.severity}
            </div>

            <p
              style={{
                color: "#cbd5e1",
                fontSize: "13px",
                lineHeight: 1.6,
                margin: "14px 0",
              }}
            >
              {selectedSignal.description}
            </p>

            <div
              style={{
                display: "grid",
                gap: "9px",
                color: "#94a3b8",
                fontSize: "12px",
              }}
            >
              <div>
                <strong style={{ color: "#e2e8f0" }}>Signal ID:</strong>{" "}
                {selectedSignal.id}
              </div>

              <div>
                <strong style={{ color: "#e2e8f0" }}>Location:</strong>{" "}
                {selectedSignal.location}
              </div>

              <div>
                <strong style={{ color: "#e2e8f0" }}>Source:</strong>{" "}
                {selectedSignal.source}
              </div>

              <div>
                <strong style={{ color: "#e2e8f0" }}>Status:</strong>{" "}
                {selectedSignal.status}
              </div>
            </div>

            <div
  style={{
    display: "grid",
    gap: "10px",
    marginTop: "16px",
  }}
>
  {selectedSignal.status === "New" && (
    <button
      type="button"
      onClick={() => {
        updateSignalStatus(selectedSignal.id, "Under Review");
        setCreatedIncident(null);
      }}
      style={{
        width: "100%",
        padding: "11px 12px",
        border: "none",
        borderRadius: "8px",
        background: "#4fd1c5",
        color: "#06202b",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Start Review
    </button>
  )}

  {selectedSignal.status === "Under Review" && (
    <button
      type="button"
      onClick={() =>
        updateSignalStatus(selectedSignal.id, "Verified")
      }
      style={{
        width: "100%",
        padding: "11px 12px",
        border: "none",
        borderRadius: "8px",
        background: "#38bdf8",
        color: "#06202b",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Verify Signal
    </button>
  )}

  {selectedSignal.status === "Verified" && (
    <button
      type="button"
      onClick={() => convertToIncident(selectedSignal.id)}
      style={{
        width: "100%",
        padding: "11px 12px",
        border: "none",
        borderRadius: "8px",
        background: "#f59e0b",
        color: "#1f2937",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Convert to Incident
    </button>
  )}

  {selectedSignal.status === "Converted to Incident" && (
    <div
      style={{
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #4fd1c5",
        background: "#0f3541",
        color: "#a7f3d0",
        fontSize: "13px",
        fontWeight: 700,
        textAlign: "center",
      }}
    >
      Incident created:{" "}
      {createdIncident ??
        `INC-${selectedSignal.id.replace("SIG-", "")}`}
    </div>
  )}
</div>
          </aside>
        )}
      </div>
    </section>
  );
}
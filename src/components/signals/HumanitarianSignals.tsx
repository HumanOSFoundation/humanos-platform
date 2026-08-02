const signals = [
  {
    id: "SIG-001",
    type: "Severe Weather",
    location: "Caribbean Region",
    severity: "Critical",
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
    time: "34 minutes ago",
    description:
      "Medical organizations are reporting increased demand for assistance.",
    color: "#38bdf8",
  },
];

export default function HumanitarianSignals() {
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

      <div style={{ display: "grid", gap: "10px" }}>
        {signals.map((signal) => (
          <div
            key={signal.id}
            style={{
              display: "grid",
              gridTemplateColumns: "8px minmax(0, 1fr) auto",
              gap: "14px",
              alignItems: "center",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #203b50",
              background: "#0a2031",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "42px",
                borderRadius: "8px",
                background: signal.color,
              }}
            />

            <div>
              <div
                style={{
                  display: "flex",
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
              </div>

              <div
                style={{
                  color: "#cbd5e1",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                {signal.description}
              </div>

              <div
                style={{
                  color: "#64748b",
                  fontSize: "11px",
                  marginTop: "6px",
                }}
              >
                {signal.id} · {signal.location}
              </div>
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: "11px",
                whiteSpace: "nowrap",
              }}
            >
              {signal.time}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
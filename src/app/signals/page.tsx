import Link from "next/link";
import HumanitarianSignals from "../../components/signals/HumanitarianSignals";

export default function SignalsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        background: "#061a29",
        color: "#f8fafc",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div>
          <div
            style={{
              color: "#4fd1c5",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1.5px",
            }}
          >
            HUMANOS OPERATIONS
          </div>

          <h1
            style={{
              margin: "8px 0 4px",
              fontSize: "32px",
            }}
          >
            Humanitarian Signals
          </h1>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "15px",
            }}
          >
            Review, validate, and manage incoming humanitarian signals.
          </p>
        </div>

        <Link
          href="/"
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #29495e",
            color: "#cbd5e1",
            textDecoration: "none",
            background: "#0d2639",
          }}
        >
          Back to Operations Center
        </Link>
      </header>

      <HumanitarianSignals />
    </main>
  );
}
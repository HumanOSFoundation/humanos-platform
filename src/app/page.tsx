export default function Home() {
  return (
    <main
      style={{
        background: "#0B1E2D",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "56px",
            marginBottom: "20px",
            color: "#4FD1C5",
          }}
        >
          HumanOS™
        </h1>

        <h2
          style={{
            fontSize: "28px",
            fontWeight: 300,
            marginBottom: "30px",
          }}
        >
          Connecting People. Coordinating Hope.
        </h2>

        <p
          style={{
            fontSize: "20px",
            opacity: 0.85,
          }}
        >
          Intelligent Humanitarian Coordination Platform
        </p>
      </div>
    </main>
  );
}
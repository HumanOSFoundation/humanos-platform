export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#0B132B",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
          HumanOS™
        </h1>

        <p style={{ fontSize: "20px", opacity: 0.85 }}>
          Connecting People. Coordinating Hope.
        </p>

        <p style={{ marginTop: "30px", color: "#4FD1C5" }}>
          Plataforma en desarrollo
        </p>
      </div>
    </main>
  );
}

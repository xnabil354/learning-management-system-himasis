"use client";

export default function OfflinePage() {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Offline — SMARTSIS</title>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          background: "#050505",
          color: "#fff",
        }}
      >
        <div
          style={{ textAlign: "center", padding: "2rem", maxWidth: "420px" }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 1.5rem",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #7c3aed20, #a855f720)",
              border: "1px solid #7c3aed30",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
            }}
          >
            📡
          </div>

          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
              background: "linear-gradient(to right, #a78bfa, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Kamu Sedang Offline
          </h1>

          <p
            style={{
              color: "#71717a",
              lineHeight: 1.6,
              marginBottom: "2rem",
              fontSize: "0.95rem",
            }}
          >
            Sepertinya koneksi internet kamu terputus. Cek koneksi dan coba lagi
            ya.
          </p>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "9999px",
              border: "none",
              background: "linear-gradient(to right, #7c3aed, #a855f7)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: "0 4px 20px #7c3aed40",
              transition: "all 0.2s",
            }}
          >
            🔄 Coba Lagi
          </button>

          <p
            style={{
              marginTop: "2rem",
              fontSize: "0.75rem",
              color: "#3f3f46",
            }}
          >
            SMARTSIS — Himasis Academy
          </p>
        </div>
      </body>
    </html>
  );
}

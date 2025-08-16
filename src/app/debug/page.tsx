'use client'
export default function Debug() {
  const sendEmail = async () => {
    const response = await fetch('/api/mail', {
      method: 'POST',
      body: JSON.stringify({

      }),
    });
    const data = await response.json();
    console.log(data);
  }
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", padding: "2rem", maxWidth: "28rem", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1f2937" }}>Payment Request</h1>
          <p style={{ color: "#4b5563", marginTop: "0.5rem" }}>from Artist Name</p>
        </div>

        <div style={{ backgroundColor: "#f9fafb", padding: "1rem", borderRadius: "0.375rem", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>Message from the Artist:</p>
          <div style={{ backgroundColor: "white", padding: "1rem", borderRadius: "0.375rem", border: "1px solid #e5e7eb" }}>
            <p style={{ color: "#1f2937", fontStyle: "italic" }}>
              Sample message from artist
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ backgroundColor: "#f9fafb", padding: "1rem", borderRadius: "0.375rem", marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>Commission Title</p>
            <p style={{ fontSize: "1.125rem", fontWeight: "500", color: "#111827" }}>Sample Commission</p>
          </div>

          <div style={{ backgroundColor: "#f9fafb", padding: "1rem", borderRadius: "0.375rem" }}>
            <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>Amount Due</p>
            <p style={{ fontSize: "1.125rem", fontWeight: "500", color: "#111827" }}>$50.00</p>
          </div>
        </div>

        <a
          href="#"
          style={{ display: "block", width: "100%", backgroundColor: "#2563eb", color: "white", textAlign: "center", padding: "1rem 1.5rem", borderRadius: "0.375rem", textDecoration: "none", fontSize: "1.125rem", fontWeight: "500" }}
        >
          Pay Now →
        </a>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  )
}
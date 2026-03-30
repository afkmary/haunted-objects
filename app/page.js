import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Haunted Objects</h1>
      <p>Prototype home page</p>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <Link href="/login">Go to Login</Link>
      </div>
    </main>
  );
}
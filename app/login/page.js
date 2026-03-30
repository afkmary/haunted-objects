"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful!");
      router.push("/");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setMessage("Google login successful!");
      router.push("/");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleSignup = async () => {
    setMessage("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Account created successfully!");
      router.push("/");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Haunted Objects Login</h1>

      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "0.75rem" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "0.75rem" }}
        />

        <button type="submit" style={{ padding: "0.75rem" }}>
          Log In
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        style={{
          padding: "0.75rem",
          marginTop: "1rem",
          width: "100%",
          cursor: "pointer",
          backgroundColor: "#4285F4",
          color: "white",
        }}
      >
        Sign in with Google
      </button>
      <button
        onClick={handleSignup}
        style={{ padding: "0.75rem", marginTop: "1rem", width: "100%" }}
      >
        Create Account
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </main>
  );
}
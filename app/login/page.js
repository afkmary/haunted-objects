"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerError = (message) => {
    setErrorMessage(message);
    setShake(false);

    setTimeout(() => {
      setShake(true);
    }, 10);

    setTimeout(() => {
      setShake(false);
    }, 500);
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      triggerError("Please enter both email and password.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      triggerError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      triggerError("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const redirectByRole = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      triggerError("No user profile found.");
      return;
    }

    const userData = userSnap.data();

    if (userData.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await redirectByRole(userCredential.user.uid);
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        triggerError("Invalid email or password.");
      } else {
        triggerError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await redirectByRole(userCredential.user.uid);
    } catch (error) {
      triggerError("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={`${styles.loginBox} ${shake ? styles.shake : ""}`}>
        <div className={styles.logoArea}>
          <Image
            src="/hauntedlogo.png"
            alt="Haunted Objects logo"
            width={200}
            height={200}
            className={styles.logo}
          />
          <h1 className={styles.title}>HAUNTED OBJECTS</h1>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.fieldWrap}>
            <label htmlFor="email" className={styles.label}>
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldWrap}>
            <label htmlFor="password" className={styles.label}>
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className={styles.googleButton}
          disabled={loading}
        >
          Sign in with Google
        </button>

        <p className={styles.signupText}>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
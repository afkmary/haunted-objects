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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import styles from "./login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerError = (message) => {
    setErrorMessage(message);
    setShake(false);

    setTimeout(() => setShake(true), 10);
    setTimeout(() => setShake(false), 500);
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
      triggerError("No user profile found. Please sign up first.");
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
      } else if (error.code === "auth/user-not-found") {
        triggerError("No account found with that email.");
      } else if (error.code === "auth/wrong-password") {
        triggerError("Incorrect password.");
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

      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      // If first-time Google user, create customer profile automatically
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          fullName: userCredential.user.displayName || "",
          email: userCredential.user.email || "",
          role: "customer",
        });
      }

      await redirectByRole(userCredential.user.uid);
    } catch (error) {
      triggerError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={`${styles.loginBox} ${shake ? styles.shake : ""}`}>
        <div className={styles.logoArea}>
          <div className={styles.logoWrapper}>
            <Image
              src="/hauntedlogo.png"
              alt="Haunted Objects logo"
              width={250}
              height={250}
              className={styles.logo}
            />
            <h1 className={styles.titleOverlay}>HAUNTED OBJECTS</h1>
          </div>
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

            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.toggleBtn}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
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
          <img src="/googlelogo.png" alt="Google" className={styles.googleIcon} />
          <span>Sign in with Google</span>
        </button>

        <p className={styles.signupText}>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
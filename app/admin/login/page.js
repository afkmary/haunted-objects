"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import styles from "./adminLogin.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const triggerError = (message) => {
    setErrorMessage(message);
    setShake(false);

    setTimeout(() => setShake(true), 10);
    setTimeout(() => setShake(false), 500);
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      triggerError("Enter admin email and password.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        triggerError("No admin profile found.");
        setLoading(false);
        return;
      }

      const userData = userSnap.data();

      // ADMIN AUTH ONLY
      if (userData.role !== "admin") {
        triggerError("Access denied. Not an admin.");
        return;
      }

      router.push("/admin");

    } catch (error) {
      triggerError("Invalid admin credentials.");
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
            <label className={styles.label}>EMAIL</label>
            <input
              type="email"
              placeholder="ADMIN EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

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

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
      </div>
    </main>
  );
}
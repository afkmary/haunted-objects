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
    setTimeout(() => setShake(false), 400);
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

    if (!email.trim() || !password.trim()) {
      triggerError("Enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await redirectByRole(userCredential.user.uid);
    } catch {
      triggerError("Invalid login credentials.");
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

      // auto-create customer if first time
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          fullName: userCredential.user.displayName || "",
          email: userCredential.user.email || "",
          role: "customer",
        });
      }

      await redirectByRole(userCredential.user.uid);
    } catch {
      triggerError("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#2d2b2b] px-8 pt-32 pb-8 flex justify-center">
      <div
        className={`w-full max-w-90 ${shake ? "animate-[shake_0.35s_ease-in-out]" : ""
          }`}
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative inline-block">
            <Image
              src="/hauntedlogo.png"
              alt="Haunted Objects logo"
              width={250}
              height={250}
              className="object-contain opacity-50"
              priority
            />
            <h1 className="pointer-events-none absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[2rem] font-normal tracking-[0.18em] text-white/90 [font-family:var(--font-cormorant)]">
              HAUNTED OBJECTS
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[0.95rem] tracking-[0.04em] text-white [font-family:var(--font-poppins)]">
              EMAIL
            </label>
            <input
              type="email"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-[#f3f3f3] px-4 py-4 text-[#333] font-sans outline-none placeholder:italic placeholder:text-[#8a8a8a]"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[0.95rem] tracking-[0.04em] text-white [font-family:var(--font-poppins)]">
              PASSWORD
            </label>

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-[#f3f3f3] px-4 py-4 pr-17 text-[#333] font-sans outline-none placeholder:italic placeholder:text-[#8a8a8a]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#555] hover:text-black"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <p className="text-[0.9rem] text-[#ffbaba] font-sans">
              {errorMessage}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-md bg-[#49D357] px-4 py-4 text-[0.95rem] font-sans text-black cursor-pointer hover:brightness-85 disabled:opacity-70"
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="mt-3 w-full rounded-md bg-white px-4 py-4 text-black cursor-pointer font-sans hover:bg-gray-200 flex items-center justify-center gap-2"
        >
          <img src="/googlelogo.png" className="w-4 h-4" />
          Sign in with Google
        </button>

        {/* Signup */}
        <p className="mt-4 text-center text-white text-sm font-sans">
          Don’t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
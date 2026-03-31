"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerError = (message) => {
    setErrorMessage(message);
    setShake(false);

    setTimeout(() => setShake(true), 10);
    setTimeout(() => setShake(false), 400);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim()) {
      triggerError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      triggerError("Please enter your email.");
      return;
    }

    if (!password) {
      triggerError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      triggerError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      triggerError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName,
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      router.push("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        triggerError("That email is already in use.");
      } else if (error.code === "auth/invalid-email") {
        triggerError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        triggerError("Password is too weak.");
      } else {
        triggerError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f10] text-white flex items-start justify-center px-6 pt-24 pb-10">
      <div
        className={`w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-8 ${shake ? "animate-[shake_0.35s_ease-in-out]" : ""
          }`}
      >
        <div className="mb-8 text-center">
          <div className="mb-5 flex justify-center">
            <Image
              src="/hauntedlogo.png"
              alt="Haunted Objects logo"
              width={90}
              height={90}
              className="h-auto w-auto object-contain"
              priority
            />
          </div>

          <h1 className="mt-3 text-3xl font-serif tracking-[0.08em] text-white">
            — CREATE ACCOUNT —
          </h1>
        </div>

        {errorMessage && (
          <p className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 font-sans">
            {errorMessage}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSignUp}>
          <div>
            <label className="mb-2 block text-[0.95rem] tracking-[0.04em] text-white font-sans">
              FULL NAME
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition duration-200 font-sans 
              placeholder:italic placeholder:text-[0.88rem] placeholder:text-white/35 focus:border-white/30 focus:ring-1 focus:ring-white/20 cursor-text"
            />
          </div>

          <div>
            <label className="mb-2 block text-[0.95rem] tracking-[0.04em] text-white font-sans">
              EMAIL
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition duration-200 font-sans 
              placeholder:italic placeholder:text-[0.88rem] placeholder:text-white/35 focus:border-white/30 focus:ring-1 focus:ring-white/20 cursor-text"
            />
          </div>

          <div>
            <label className="mb-2 block text-[0.95rem] tracking-[0.04em] text-white font-sans">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 pr-12 text-white outline-none transition duration-200 font-sans 
                placeholder:italic placeholder:text-[0.88rem] placeholder:text-white/35 focus:border-white/30 focus:ring-1 focus:ring-white/20 cursor-text"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/60 hover:text-white transition cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[0.95rem] tracking-[0.04em] text-white font-sans">
              CONFIRM PASSWORD
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 pr-12 text-white outline-none transition duration-200 font-sans 
                placeholder:italic placeholder:text-[0.88rem] placeholder:text-white/35 focus:border-white/30 focus:ring-1 focus:ring-white/20 cursor-text"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/60 hover:text-white transition cursor-pointer"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-white/15 bg-[#49D357] text-black py-3 text-[0.95rem] font-sans tracking-[0.08em] uppercase transition 
            duration-200 hover:brightness-70 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-[0.9rem] text-white/60 font-sans">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white underline underline-offset-4 hover:text-white/80 transition cursor-pointer"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
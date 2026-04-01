"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLoginPage() {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      triggerError("Enter admin email and password.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        triggerError("No admin profile found.");
        return;
      }

      const userData = userSnap.data();

      if (userData.role !== "admin") {
        triggerError("Access denied. Not an admin.");
        return;
      }

      router.push("/admin");
    } catch {
      triggerError("Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#2d2b2b] px-8 pt-25 pb-8 flex justify-center">
      <div
        className={`w-full max-w-90 ${shake ? "animate-[shake_0.35s_ease-in-out]" : ""}`}
      >
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
            <h1 className="pointer-events-none absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[2rem] 
            font-normal tracking-[0.18em] text-white/90 font-serif">
              HAUNTED OBJECTS
            </h1>
          </div>
        </div>

        <form
          onSubmit={handleLogin}
          className={[
            "flex flex-col gap-4",
            shake ? "translate-x-1" : "translate-x-0",
            "transition-transform duration-75",
          ].join(" ")}
        >
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="email"
              className="text-[0.95rem] font-normal tracking-[0.04em] text-white font-sans"
            >
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              placeholder="ADMIN EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-[#f3f3f3] px-4 py-4 text-[0.95rem] text-[#333] outline-none
              placeholder:text-[#8a8a8a] placeholder:italic font-sans placeholder:text-[0.8rem]"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="password"
              className="text-[0.95rem] font-normal tracking-[0.04em] text-white font-sans"
            >
              PASSWORD
            </label>

            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-[#f3f3f3] px-4 py-4 pr-17 text-[0.95rem] text-[#333] outline-none
                placeholder:text-[#8a8a8a] placeholder:italic font-sans placeholder:text-[0.8rem]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#555] hover:text-black"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-[0.9rem] text-red-200 font-sans">
              {errorMessage}
            </p>
          )}

          <button
            className="mt-4 w-full rounded-md bg-[#49D357] px-4 py-4 text-[0.95rem] font-sans text-black 
            active:scale-95 transition hover:brightness-85 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
      </div>
    </main>
  );
}
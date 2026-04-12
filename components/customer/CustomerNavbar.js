"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, ShoppingCart, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useCart } from "@/contexts/CartContext";

export default function CustomerNavbar() {
  const router = useRouter();
  const { cartCount, openCart } = useCart();

  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserMenuOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full bg-[#1f1f22] text-white">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Image
            src="/hauntedlogo.png"
            alt="Haunted Objects logo"
            width={40}
            height={40}
            className="object-contain opacity-70"
            priority
          />

          <nav className="hidden items-center gap-6 text-[12px] uppercase tracking-[0.08em] text-white/80 md:flex">
            <Link href="/" className="transition hover:text-white">
              Shop All
            </Link>

            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 transition hover:text-white"
            >
              Categories <ChevronDown size={12} />
            </button>

            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 transition hover:text-white"
            >
              Info <ChevronDown size={12} />
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4 text-white/75">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="cursor-pointer transition hover:text-white"
            >
              <User size={20} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-8 z-50 min-w-35 overflow-hidden rounded-md bg-white shadow-lg">
                <Link
                  href="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-black font-sans transition hover:bg-gray-100"
                >
                  Account
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 text-left text-sm text-black font-sans transition hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={openCart}
            className="relative cursor-pointer transition hover:text-white"
          >
            <ShoppingCart size={20} />

            {mounted && cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
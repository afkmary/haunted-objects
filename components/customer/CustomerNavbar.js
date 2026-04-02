"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CustomerNavbar() {
  const { cartCount, openCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

          <nav className="hidden md:flex items-center gap-6 text-[12px] font-sans tracking-[0.08em] uppercase text-white/80">
            <Link href="/" className="hover:text-white transition">
              Shop All
            </Link>

            <button className="flex items-center gap-1 hover:text-white transition">
              Categories <ChevronDown size={12} />
            </button>

            <button className="flex items-center gap-1 hover:text-white transition">
              Info <ChevronDown size={12} />
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4 text-white/75">
          <button className="hover:text-white transition">
            <User size={20} />
          </button>

          <button
            onClick={openCart}
            className="relative hover:text-white transition"
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
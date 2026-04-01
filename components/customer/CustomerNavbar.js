"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Search, ShoppingCart, User } from "lucide-react";

export default function CustomerNavbar() {
  return (
    <header className="w-full bg-[#1f1f22] text-white">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Image
            src="/hauntedlogo.png"
            alt="Haunted Objects logo"
            width={38}
            height={38}
            className="object-contain opacity-40"
            priority
          />

          <nav className="hidden md:flex items-center gap-6 text-[11px] font-sans tracking-[0.08em] uppercase text-white/80">
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
            <User size={16} />
          </button>
          <button className="hover:text-white transition">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const [userEmail, setUserEmail] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "");
      } else {
        setUserEmail("");
      }
    });

    return () => unsubscribe();
  }, []);

  const linkClasses = (isActive) =>
    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-sans transition ${isActive
      ? "bg-white/10 text-white"
      : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside className="flex min-h-screen w-24 sm:w-28 md:w-64 lg:w-72 xl:w-80 flex-col justify-between bg-[#1f1f22] px-3 md:px-5 lg:px-6 py-6 text-white">
      <div>
        <div className="mb-5 flex justify-center">
          <Image
            src="/hauntedlogo.png"
            alt="Haunted Objects logo"
            width={100}
            height={100}
            className="opacity-70 object-contain"
          />
        </div>

        <nav className="space-y-2">
          <Link href="/admin" className={linkClasses(pathname === "/admin")}>
            <LayoutDashboard size={16} />
            <span className="hidden md:inline">Dashboard</span>
          </Link>

          <Link
            href="/admin/inventory"
            className={linkClasses(pathname.startsWith("/admin/inventory"))}
          >
            <Package size={16} />
            <span className="hidden md:inline">Manage Inventory</span>
          </Link>

          <Link
            href="/admin/orders"
            className={linkClasses(pathname.startsWith("/admin/orders"))}
          >
            <ShoppingBag size={16} />
            <span className="hidden md:inline">Manage Orders</span>
          </Link>
        </nav>
      </div>

      <div className="flex items-center rounded-xl pl-0 pr-2 py-2 text-sm text-white/80">
        <div className="flex items-center gap-3">
          <Image
            src="/pumpkin.png"
            alt="Admin profile"
            width={40}
            height={40}
            className="h-12 w-12 rounded-full object-cover"
          />

          <div className="hidden md:block leading-tight">
            <p className="text-sm text-white font-sans">Admin</p>
            <p className="text-[14px] text-white/50 font-sans">
              {userEmail || "loading..."}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
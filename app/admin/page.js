"use client";

import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag } from "lucide-react";

export default function AdminPage() {
  return (
    <>
      <div className="mb-8 flex items-center gap-5">
        <h1 className="whitespace-nowrap text-[2.1rem] tracking-[0.06em] text-[#2b2b2b] font-serif font-bold">
          ADMIN DASHBOARD
        </h1>
        <div className="h-px w-full bg-[#5e5a56]" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/inventory"
          className="rounded-2xl border border-black/10 bg-white/20 p-6 text-[#2d241d] shadow-md transition hover:bg-white/30"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f1f22] text-white">
            <Package size={20} />
          </div>
          <h2 className="text-xl font-serif">Manage Inventory</h2>
          <p className="mt-2 text-sm text-black/60 font-sans">
            View, add, edit, and remove items from your online inventory.
          </p>
        </Link>

        <div className="rounded-2xl border border-black/10 bg-white/10 p-6 text-[#2d241d] shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f1f22] text-white">
            <ShoppingBag size={20} />
          </div>
          <h2 className="text-xl font-serif">Manage Orders</h2>
          <p className="mt-2 text-sm text-black/60 font-sans">
            Coming soon.
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/10 p-6 text-[#2d241d] shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f1f22] text-white">
            <LayoutDashboard size={20} />
          </div>
          <h2 className="text-xl font-serif">Admin Overview</h2>
          <p className="mt-2 text-sm text-black/60 font-sans">
            Dashboard summary widgets can go here later.
          </p>
        </div>
      </div>
    </>
  );
}
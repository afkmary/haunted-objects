"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function InventoryCard({
  item,
  isAddCard = false,
  onDeleteClick,
}) {
  if (isAddCard) {
    return (
      <Link
        href="/admin/inventory/add-item"
        className="flex h-75 w-52.5 flex-col items-center justify-center rounded-md border border-white/20 bg-[#7f7f7f]/40 text-white/80 transition hover:bg-[#7f7f7f]/55 font-sans"
      >
        <Plus size={48} strokeWidth={1.2} />
        <span className="mt-6 text-[14px] tracking-[0.18em] font-sans">
          ADD ITEM
        </span>
      </Link>
    );
  }

  return (
    <div className="flex h-75 w-52.5 flex-col rounded-md border border-white/20 bg-[#7f7f7f]/40 p-3 text-white font-sans">
      <div className="relative mb-3 h-42.5 w-full overflow-hidden rounded-sm bg-white/10">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="210px"
          loading="eager"
          className="object-contain"
        />
      </div>

      <div className="mt-auto text-center">
        <p className="line-clamp-3 text-[14px] leading-tight text-white/90">
          {item.name}
        </p>
        <p className="mt-2 text-[14px] font-semibold text-[#2d241d]">
          ${Number(item.price).toLocaleString()}
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <Link
          href={`/admin/inventory/edit/${item.id}`}
          className="flex-1 rounded-md bg-black/30 px-2 py-1.5 text-center text-[12px] text-white transition hover:bg-black/40"
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={() => onDeleteClick(item)}
          className="flex-1 rounded-md bg-red-500/50 px-2 py-1.5 text-[12px] text-red-100 transition hover:bg-red-800/70"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
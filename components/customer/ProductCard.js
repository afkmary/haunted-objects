"use client";

import Image from "next/image";

export default function ProductCard({ item }) {
  return (
    <div className="w-52.5 rounded-md border border-white/20 bg-[#7a7a7a]/30 p-3 text-white">
      <div className="relative mb-3 h-42.5 w-full overflow-hidden rounded-sm bg-white/10">
        <Image
          src={item.images?.[0] || item.image || "/placeholder.png"}
          alt={item.name}
          fill
          sizes="210px"
          className="object-contain"
        />
      </div>

      <div className="text-center">
        <p className="line-clamp-3 text-[12px] leading-tight font-sans text-white/90">
          {item.name}
        </p>
        <p className="mt-2 text-[12px] font-sans text-white/70">
          ${Number(item.price).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
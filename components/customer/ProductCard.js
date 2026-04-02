"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ item }) {
  const imageSrc =
    item.images?.[0] || item.image || "/placeholder.png";

  const normalizedSrc = imageSrc.startsWith("/")
    ? imageSrc
    : `/products/${imageSrc}`;

  return (
    <Link href={`/products/${item.id}`}>
      <div className="w-52.5 h-77.5 cursor-pointer rounded-md border border-white/20 bg-[#7a7a7a]/30 p-3 text-white transition hover:-translate-y-1 hover:shadow-md flex flex-col">

        {/* IMAGE */}
        <div className="relative mb-3 h-40 w-full overflow-hidden rounded-sm bg-white/10">
          <Image
            src={normalizedSrc}
            alt={item.name}
            fill
            sizes="210px"
            className="object-contain"
          />
        </div>

        {/* TEXT */}
        <div className="flex flex-col flex-1 text-center">
          <p className="line-clamp-3 text-[14px] leading-tight font-sans text-white/90">
            {item.name}
          </p>

          <p className="mt-5 text-[16px] font-sans font-medium text-green-950">
            ${Number(item.price).toLocaleString()}
          </p>
        </div>

      </div>
    </Link>
  );
}
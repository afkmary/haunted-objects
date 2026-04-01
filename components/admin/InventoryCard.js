"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function InventoryCard({
  item,
  isAddCard = false,
  onDeleteClick,
}) {
  const imageList =
    item?.images && item.images.length > 0
      ? item.images
      : item?.image
        ? [item.image]
        : ["/placeholder.png"];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasMultipleImages = imageList.length > 1;

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentImageIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1
    );
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentImageIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1
    );
  };

  const handleMouseEnter = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  if (isAddCard) {
    return (
      <Link
        href="/admin/inventory/add-item"
        className="flex h-75 w-52.5 flex-col items-center justify-center rounded-md border border-white/20 bg-[#7f7f7f]/40 text-white/80 transition hover:bg-[#7f7f7f]/55 font-sans"
      >
        <Plus size={48} strokeWidth={1.2} />
        <span className="mt-6 text-[14px] tracking-[0.18em]">ADD ITEM</span>
      </Link>
    );
  }

  return (
    <div className="flex h-75 w-52.5 flex-col rounded-md border border-white/20 bg-[#7f7f7f]/40 p-3 text-white font-sans">
      <div
        className="group relative mb-3 h-42.5 w-full overflow-hidden rounded-sm bg-white/10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={imageList[currentImageIndex]}
          alt={item.name}
          fill
          sizes="210px"
          className="object-contain transition-opacity duration-200"
        />

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition group-hover:opacity-100"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition group-hover:opacity-100"
            >
              <ChevronRight size={16} />
            </button>

            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {imageList.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/40"
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-auto text-center">
        <p className="line-clamp-3 text-[14px] leading-tight text-white/90">
          {item.name}
        </p>
        <p className="mt-1 text-[14px] font-semibold text-[#2d241d]">
          ${Number(item.price).toLocaleString()}
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <Link
          href={`/admin/inventory/edit-item/${item.id}`}
          className="flex-1 rounded-md bg-black/30 px-2 py-1.5 text-center text-[12px] text-white transition hover:bg-black/40"
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={() => onDeleteClick(item)}
          className="flex-1 rounded-md bg-red-500/50 px-2 py-1.5 text-[12px] text-red-100 transition hover:bg-red-500/70"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
"use client";

export default function ReviewCard({ review }) {
  return (
    <div className="min-h-42.5 rounded-md border border-white/20 bg-[#2b2b2d] p-5 text-white">
      <p className="text-[12px] tracking-[0.12em] text-white/80">☆☆☆☆☆</p>

      <h3 className="mt-4 text-[20px] font-serif text-white">
        {review.title}
      </h3>

      <p className="mt-2 text-sm font-sans text-white/65">
        {review.body}
      </p>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4a261] text-xs font-bold text-black">
          {review.initial}
        </div>
        <div>
          <p className="text-[11px] font-sans text-white">{review.name}</p>
          <p className="text-[10px] font-sans text-white/45">{review.date}</p>
        </div>
      </div>
    </div>
  );
}
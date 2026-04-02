"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

function normalizeImagePath(item) {
  const firstImage =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : item.image || "/placeholder.png";

  if (!firstImage || typeof firstImage !== "string") return "/placeholder.png";
  if (firstImage.startsWith("/")) return firstImage;
  return `/products/${firstImage}`;
}

export default function CartDrawer() {
  const router = useRouter();
  const {
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    closeCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/35 transition-opacity duration-300 ${isCartOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
          }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-[420px] bg-[#222224] text-white shadow-2xl transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col px-6 py-6">
          <div className="flex h-full flex-col px-7 py-10">
            <h2 className="font-serif text-[2.5rem] leading-none text-white">
              CART ({cartCount})
            </h2>

            <div className="mt-10 flex-1 overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <p className="font-sans text-sm text-white/60">
                  Your cart is empty.
                </p>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => {
                    const imageSrc = normalizeImagePath(item);
                    const stockLimit =
                      typeof item.qty === "string"
                        ? parseInt(item.qty, 10) || 0
                        : Number(item.qty || 0);

                    const cannotIncrease = item.cartQty >= stockLimit;

                    return (
                      <div key={item.id}>
                        <div className="flex gap-4">
                          <div className="relative h-24 w-20 shrink-0 overflow-hidden">
                            <Image
                              src={imageSrc}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-contain"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-serif text-[1.05rem] leading-8 text-white/85">
                              {item.name}
                            </p>

                            <p className="mt-2 font-sans text-[0.95rem] text-white">
                              $
                              {Number(item.price * item.cartQty).toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </p>

                            <div className="mt-4 flex items-center justify-between gap-3">
                              <div className="flex items-center rounded-md border border-white/15">
                                <button
                                  onClick={() => decreaseQty(item.id)}
                                  className="flex h-9 w-9 items-center justify-center text-white/75 transition hover:bg-white/10 hover:text-white"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={14} />
                                </button>

                                <span className="flex h-9 min-w-10 items-center justify-center border-x border-white/15 px-2 font-sans text-sm">
                                  {item.cartQty}
                                </span>

                                <button
                                  onClick={() => increaseQty(item.id)}
                                  disabled={cannotIncrease}
                                  className="flex h-9 w-9 items-center justify-center text-white/75 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:text-white/25 disabled:hover:bg-transparent"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="flex items-center gap-1 font-sans text-xs uppercase tracking-[0.08em] text-white/50 transition hover:text-white"
                              >
                                <Trash2 size={14} />
                                Remove
                              </button>
                            </div>

                            {cannotIncrease && (
                              <p className="mt-2 font-sans text-[11px] text-white/40">
                                Max stock reached
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 h-px w-full bg-white/30" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-8">
              <div className="mb-8 flex items-center justify-between font-sans text-[1.1rem] uppercase text-white/75">
                <span>Subtotal</span>
                <span>
                  $
                  {cartTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <button
                onClick={() => {
                  closeCart();
                  router.push("/checkout");
                }}
                disabled={cartItems.length === 0}
                className="w-full rounded-xl bg-[#111113] px-6 py-4 text-sm font-semibold uppercase tracking-[0.05em] text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
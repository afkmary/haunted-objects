"use client";

import { useRouter } from "next/navigation";
import CustomerNavbar from "@/components/customer/CustomerNavbar";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    cartTotal,
  } = useCart();

  return (
    <main className="min-h-screen bg-[#6f6f6f] text-white">
      <CustomerNavbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-4xl">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="mt-8 rounded-xl bg-white/5 p-6 font-sans">
            <p>Your cart is empty.</p>
            <button
              onClick={() => router.push("/catalogue")}
              className="mt-4 rounded-full bg-white px-5 py-2 text-black"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {cartItems.map((item) => {
                const imagePath = item.image
                  ? item.image.startsWith("/")
                    ? item.image
                    : `/products/${item.image}`
                  : "/placeholder.jpg";

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-xl bg-white/5 p-4 font-sans"
                  >
                    <img
                      src={imagePath}
                      alt={item.name}
                      className="h-28 w-24 rounded-md object-cover"
                    />

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="text-lg font-medium">{item.name}</h2>
                        <p className="text-sm text-white/60">{item.brand}</p>
                        <p className="mt-2">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="h-8 w-8 rounded-full border border-white/30"
                          >
                            -
                          </button>
                          <span>{item.cartQty}</span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="h-8 w-8 rounded-full border border-white/30"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm text-white/60 hover:text-white"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="h-fit rounded-xl bg-white/5 p-6 font-sans">
              <h2 className="font-serif text-2xl">Order Summary</h2>

              <div className="mt-4 flex items-center justify-between">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="mt-6 w-full rounded-full bg-white px-5 py-3 text-black"
              >
                Proceed to checkout
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import CustomerNavbar from "@/components/customer/CustomerNavbar";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [user, setUser] = useState(undefined);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        router.push("/customer-login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handlePlaceOrder = () => {

    if (!user || cartItems.length === 0) return;

    clearCart();
    setSubmitted(true);
  };

  if (user === undefined) {
    return (
      <main className="min-h-screen bg-[#6f6f6f] text-white">
        <CustomerNavbar />
        <section className="mx-auto max-w-6xl px-6 py-10">
          <p className="font-sans text-white/70">Checking sign-in...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#6f6f6f] text-white">
      <CustomerNavbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-4xl">CHECKOUT</h1>

        {submitted ? (
          <div className="mt-8 rounded-xl bg-white/5 p-6 font-sans">
            <h2 className="font-serif text-2xl">Order placed</h2>
            <p className="mt-2 text-white/70">
              Your checkout was submitted successfully.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">

            {/* SHIPPING FORM */}
            <form
              onSubmit={handlePlaceOrder}
              className="rounded-xl bg-[#2a2a2d] border border-white/10 p-6 font-sans shadow-lg"
            >
              <h2 className="font-serif text-2xl">SHIPPING DETAILS</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                  required
                  placeholder="First Name"
                  className="rounded-lg bg-[#1f1f22] border border-white/10 px-4 py-3 text-white outline-none"
                />
                <input
                  required
                  placeholder="Last Name"
                  className="rounded-lg bg-[#1f1f22] border border-white/10 px-4 py-3 text-white outline-none"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  defaultValue={user?.email || ""}
                  className="rounded-lg bg-[#1f1f22] border border-white/10 px-4 py-3 text-white outline-none md:col-span-2"
                />
                <input
                  required
                  placeholder="Address"
                  className="rounded-lg bg-[#1f1f22] border border-white/10 px-4 py-3 text-white outline-none md:col-span-2"
                />
                <input
                  required
                  placeholder="City"
                  className="rounded-lg bg-[#1f1f22] border border-white/10 px-4 py-3 text-white outline-none"
                />
                <input
                  required
                  placeholder="Postal Code"
                  className="rounded-lg bg-[#1f1f22] border border-white/10 px-4 py-3 text-white outline-none"
                />
              </div>

              <h2 className="mt-8 font-serif text-2xl">PAYMENT</h2>

              <div className="mt-6 grid gap-4">
                <input
                  required
                  placeholder="Card Number"
                  className="rounded-lg bg-[#1f1f22] border border-white/10 px-4 py-3 text-white outline-none"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    placeholder="MM/YY"
                    className="rounded-lg bg-[#1f1f22] border border-white/10 px-4 py-3 text-white outline-none"
                  />
                  <input
                    required
                    placeholder="CVV"
                    className="rounded-lg bg-[#1f1f22] border border-white/10 px-4 py-3 text-white outline-none"
                  />
                </div>
              </div>
            </form>

            {/* ORDER SUMMARY */}
            <div className="h-fit rounded-xl bg-[#1f1f22] p-6 font-sans shadow-lg">
              <h2 className="font-serif text-2xl text-white">Order Summary</h2>

              <div className="mt-5 space-y-5">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-white/60">Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span className="text-white/80">
                        {item.name} × {item.cartQty}
                      </span>
                      <span className="text-white">
                        ${(item.price * item.cartQty).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 flex justify-between border-t border-white/10 pt-4 text-base">
                <span className="text-white/75">Total</span>
                <span className="font-medium text-white">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
                className="mt-7 w-full rounded-full bg-green-400 px-6 py-3 text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Place order
              </button>
            </div>

          </div>
        )}
      </section>
    </main>
  );
}
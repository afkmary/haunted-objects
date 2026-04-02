"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CustomerNavbar from "@/components/customer/CustomerNavbar";
import ProductCard from "@/components/customer/ProductCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));

        const productList = querySnapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();

          return {
            id: docSnapshot.id,
            itemId: data.itemId || "",
            name: data.itemName || "Untitled Product",
            price:
              typeof data.Price === "string"
                ? parseFloat(data.Price.replace(/[$,]/g, "")) || 0
                : Number(data.Price || 0),
            image: data.image || "",
            images: Array.isArray(data.images) ? data.images : [],
            brand: data.Brand || "",
            condition: data.Condition || "",
            qty: data.Qty || "",
          };
        });

        setProducts(productList);
      } catch (error) {
        console.error("Error fetching search products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) return products;

    return products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const brand = product.brand?.toLowerCase() || "";
      const condition = product.condition?.toLowerCase() || "";

      return (
        name.includes(trimmed) ||
        brand.includes(trimmed) ||
        condition.includes(trimmed)
      );
    });
  }, [products, query]);

  return (
    <main className="min-h-screen bg-[#6f6f6f] text-white">
      <CustomerNavbar />

      <section className="px-6 pb-14 pt-6">
        <div className="mb-8">
          <h1 className="font-serif text-[2rem] text-white">
            {query ? `Search Results for "${query}"` : "All Products"}
          </h1>
          <p className="mt-1 font-sans text-sm text-white/60">
            {loading
              ? "Loading products..."
              : `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"
              } found`}
          </p>
        </div>

        {loading ? (
          <p className="font-sans text-white/70">Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-10">
            <h2 className="font-serif text-xl text-white">No products found</h2>
            <p className="mt-2 font-sans text-sm text-white/60">
              Try another search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,210px))] gap-5">
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#6f6f6f] text-white">
          <CustomerNavbar />
          <section className="px-6 pb-14 pt-6">
            <p className="font-sans text-white/70">Loading search...</p>
          </section>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
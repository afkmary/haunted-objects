"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

import CustomerNavbar from "@/components/customer/CustomerNavbar";
import ProductCard from "@/components/customer/ProductCard";

export default function CataloguePage() {
  const [products, setProducts] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
                ? parseFloat(data.Price.replace("$", "")) || 0
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
        console.error("Error fetching catalogue products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchTerm.toLowerCase();

      return (
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.condition.toLowerCase().includes(query)
      );
    });
  }, [products, searchTerm]);

  return (
    <main className="min-h-screen bg-[#6f6f6f] text-white">
      <CustomerNavbar />

      <section className="px-6 pb-14 pt-6">
        <div className="mb-8">
          <h1 className="font-serif text-[2rem] text-white">CATALOGUE</h1>
          <p className="mt-1 font-sans text-sm text-white/60">
            Browse all available products
          </p>
        </div>

        <div className="mb-10 flex justify-center">
          <div className="relative w-full max-w-150">
            <input
              type="text"
              placeholder="Search catalogue..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(inputValue);
                }
              }}
              className="w-full rounded-full border border-black/10 bg-[#d9d9d9] px-5 py-2.5 pr-10 text-sm font-sans text-black/70 outline-none placeholder:font-sans placeholder:text-black/35"
            />
            <Search
              size={16}
              onClick={() => setSearchTerm(inputValue)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-black/35"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="font-sans text-white/70">No products found.</p>
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
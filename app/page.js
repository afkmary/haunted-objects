"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

import CustomerNavbar from "@/components/customer/CustomerNavbar";
import ProductCard from "@/components/customer/ProductCard";
import ReviewCard from "@/components/customer/ReviewCard";

export default function HomePage() {
  const [products, setProducts] = useState([]);
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
            price: parseFloat(data.Price?.replace("$", "")) || 0,
            image: data.image || "",
            images: data.images || [],
            brand: data.Brand || "",
            condition: data.Condition || "",
            qty: data.Qty || "",
          };
        });

        setProducts(productList);
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const reviews = [
    {
      title: "Review title",
      body: "Review body",
      name: "DOREAMON",
      date: "Date",
      initial: "D",
    },
    {
      title: "Review title",
      body: "Review body",
      name: "POCHITA",
      date: "Date",
      initial: "P",
    },
    {
      title: "Review title",
      body: "Review body",
      name: "GOJO",
      date: "Date",
      initial: "G",
    },
  ];

  return (
    <main className="min-h-screen bg-[#6f6f6f] text-white">
      <CustomerNavbar />

      <section className="px-6 pb-14 pt-6">
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-[420px]">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-[#d9d9d9] px-5 py-2.5 pr-10 text-sm font-sans text-black/70 outline-none placeholder:font-sans placeholder:text-black/35"
            />
            <Search
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black/35"
            />
          </div>
        </div>

        <div className="mb-14">
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-[2rem] font-serif text-white">NEW ARRIVALS</h2>
            <span className="mt-1 text-[10px] font-sans text-white/50">
              see more →
            </span>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,210px))] gap-5">
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-6 flex items-center gap-5">
            <h2 className="whitespace-nowrap text-[2rem] font-serif text-white">
              REVIEWS
            </h2>
            <div className="h-px w-full bg-[#3f3f3f]" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
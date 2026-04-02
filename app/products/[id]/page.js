"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import CustomerNavbar from "@/components/customer/CustomerNavbar";
import { useCart } from "@/contexts/CartContext";

function normalizeImagePath(img) {
  if (!img || typeof img !== "string") return "/placeholder.png";

  const trimmed = img.trim();

  if (!trimmed) return "/placeholder.png";

  if (trimmed.startsWith("/")) return trimmed;

  return `/products/${trimmed}`;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", params.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setProduct(null);
          return;
        }

        const data = docSnap.data();

        setProduct({
          id: docSnap.id,
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
          description: data.Description || "",
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchProduct();
    }
  }, [params?.id]);

  const allImages = useMemo(() => {
    if (!product) return ["/placeholder.png"];

    const validImagesArray = Array.isArray(product.images)
      ? product.images.filter(
        (img) => typeof img === "string" && img.trim() !== ""
      )
      : [];

    if (validImagesArray.length > 0) {
      return validImagesArray.map(normalizeImagePath);
    }

    if (typeof product.image === "string" && product.image.trim() !== "") {
      return [normalizeImagePath(product.image)];
    }

    return ["/placeholder.png"];
  }, [product]);

  useEffect(() => {
    setSelectedImage(0);
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#6f6f6f] text-white">
        <CustomerNavbar />
        <section className="px-6 py-10">
          <p className="font-sans">Loading product...</p>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#6f6f6f] text-white">
        <CustomerNavbar />
        <section className="px-6 py-10">
          <p className="font-sans">Product not found.</p>
        </section>
      </main>
    );
  }

  const stockCount =
    typeof product?.qty === "string"
      ? parseInt(product.qty, 10) || 0
      : Number(product?.qty || 0);

  const isOutOfStock = stockCount <= 0;

  return (
    <main className="min-h-screen bg-[#6f6f6f] text-white">
      <CustomerNavbar />

      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => router.back()}
            className="mb-8 font-sans text-xs uppercase tracking-[0.08em] text-white/70 transition hover:text-white"
          >
            &lt; Back
          </button>

          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div className="relative mx-auto h-105 w-full max-w-105 overflow-hidden">
                <img
                  src={allImages[selectedImage] || "/placeholder.png"}
                  alt={product.name}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
              </div>

              {allImages.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 w-20 overflow-hidden rounded border transition ${selectedImage === index
                        ? "border-white"
                        : "border-white/20 hover:border-white/50"
                        }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="max-w-105 font-sans">
              <h1 className="font-serif text-[2rem] leading-tight text-white">
                {product.name}
              </h1>

              <p className="mt-6 font-serif text-[2rem] text-white">
                ${Number(product.price).toFixed(2)}
              </p>

              <div className="mt-8 space-y-5 text-sm text-white/80">
                {product.description && (
                  <div>
                    <p className="mb-1 text-white">Measurements:</p>
                    <p className="whitespace-pre-line leading-6 text-white/70">
                      {product.description}
                    </p>
                  </div>
                )}

                {product.condition && (
                  <p>
                    <span className="text-white">Condition:</span>{" "}
                    <span className="text-white/70">{product.condition}</span>
                  </p>
                )}

                {product.qty && (
                  <p>
                    <span className="text-white">Qty:</span>{" "}
                    <span className="text-white/70">{product.qty}</span>
                  </p>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="mt-10 w-full rounded-sm bg-[#111111] px-6 py-3 text-[11px] uppercase tracking-[0.14em] text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-[#2b2b2b] disabled:text-white/40"
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
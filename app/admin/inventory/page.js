"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import InventoryCard from "@/components/admin/InventoryCard";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

export default function ManageInventoryPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

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
            createdAt: 0,
          };
        });

        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage("Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "newest") {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return filtered;
  }, [products, searchTerm, sortBy]);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    if (deleteLoading) return;
    setSelectedItem(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;

    try {
      setDeleteLoading(true);

      await deleteDoc(doc(db, "products", selectedItem.id));

      setProducts((prev) =>
        prev.filter((product) => product.id !== selectedItem.id)
      );

      setSelectedItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      setErrorMessage("Failed to delete item.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 flex items-center gap-5">
        <h1 className="whitespace-nowrap text-[2.1rem] tracking-[0.06em] text-[#2d241d] font-serif font-bold">
          ONLINE INVENTORY
        </h1>
        <div className="h-px w-full bg-[#5e5a56]" />
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-6">
        <div className="relative w-full max-w-100">
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-black/10 bg-[#d9d9d9] px-4 py-2.5 pr-10 text-sm text-black/70 font-sans outline-none placeholder:font-sans placeholder:text-black/35"
          />
          <Search
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-black/35"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-sans text-[#2d241d]">
          <span>Sort by:</span>

          <button
            type="button"
            onClick={() => setSortBy("newest")}
            className={`rounded-sm px-3 py-1 text-xs font-sans ${sortBy === "newest"
              ? "bg-[#2d2d2d] text-white"
              : "bg-[#bdbdbd] text-[#2d241d]"
              }`}
          >
            Newest
          </button>

          <button
            type="button"
            onClick={() => setSortBy("oldest")}
            className={`rounded-sm px-3 py-1 text-xs font-sans ${sortBy === "oldest"
              ? "bg-[#2d2d2d] text-white"
              : "bg-[#bdbdbd] text-[#2d241d]"
              }`}
          >
            Oldest
          </button>

          <button
            type="button"
            onClick={() => setSortBy("price-low")}
            className={`rounded-sm px-3 py-1 text-xs font-sans ${sortBy === "price-low"
              ? "bg-[#2d2d2d] text-white"
              : "bg-[#bdbdbd] text-[#2d241d]"
              }`}
          >
            Price: Low
          </button>

          <button
            type="button"
            onClick={() => setSortBy("price-high")}
            className={`rounded-sm px-3 py-1 text-xs font-sans ${sortBy === "price-high"
              ? "bg-[#2d2d2d] text-white"
              : "bg-[#bdbdbd] text-[#2d241d]"
              }`}
          >
            Price: High
          </button>
        </div>
      </div>

      {errorMessage && (
        <p className="mb-6 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-sans text-red-200">
          {errorMessage}
        </p>
      )}

      {loading ? (
        <p className="font-sans text-[#2d241d]">Loading inventory...</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,210px))] gap-5">
          <InventoryCard isAddCard />

          {filteredProducts.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && !errorMessage && (
        <p className="mt-8 font-sans text-[#2d241d]">No products found.</p>
      )}

      <ConfirmDeleteModal
        isOpen={!!selectedItem}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        itemName={selectedItem?.name || "this item"}
      />
    </>
  );
}
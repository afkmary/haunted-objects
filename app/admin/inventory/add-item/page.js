"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AddItemPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    itemId: "",
    itemName: "",
    Brand: "",
    Condition: "",
    Description: "",
    Price: "",
    Qty: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setErrors({});

    const newErrors = {};

    if (!formData.itemId.trim()) newErrors.itemId = "Required";
    if (!formData.itemName.trim()) newErrors.itemName = "Required";
    if (!formData.Brand.trim()) newErrors.Brand = "Required";
    if (!formData.Condition.trim()) newErrors.Condition = "Required";
    if (!formData.Description.trim()) newErrors.Description = "Required";
    if (!formData.Price.trim()) newErrors.Price = "Required";
    if (!formData.Qty.trim()) newErrors.Qty = "Required";
    if (!formData.image.trim()) newErrors.image = "Required";

    const cleanPrice = formData.Price.replace("$", "").trim();

    if (formData.Price.trim() && isNaN(cleanPrice)) {
      newErrors.Price = "Must be a valid number";
    }

    if (formData.Qty.trim() && isNaN(formData.Qty)) {
      newErrors.Qty = "Must be a valid number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessage("Please fill in all required fields correctly.");
      return;
    }

    try {
      setLoading(true);

      const formattedPrice = `$${Number(cleanPrice).toFixed(2)}`;

      await addDoc(collection(db, "products"), {
        itemId: formData.itemId.trim(),
        itemName: formData.itemName.trim(),
        Brand: formData.Brand.trim(),
        Condition: formData.Condition.trim(),
        Description: formData.Description.trim(),
        Price: formattedPrice,
        Qty: formData.Qty.trim(),
        image: formData.image.startsWith("/")
          ? formData.image.trim()
          : `/${formData.image.trim()}`,
      });

      setSuccessMessage("Item added successfully.");

      setFormData({
        itemId: "",
        itemName: "",
        Brand: "",
        Condition: "",
        Description: "",
        Price: "",
        Qty: "",
        image: "",
      });

      setTimeout(() => {
        router.push("/admin/inventory");
      }, 800);
    } catch (error) {
      console.error("Error adding item:", error);
      setErrorMessage("Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldName) =>
    `w-full rounded-xl px-4 py-3 text-sm text-black font-sans outline-none placeholder:italic placeholder:font-sans placeholder:text-black/35 ${errors[fieldName]
      ? "border border-red-400 bg-red-50"
      : "border border-black/10 bg-white/80"
    }`;

  return (
    <>
      <div className="mb-8 flex items-center gap-5">
        <h1 className="whitespace-nowrap text-[2.1rem] tracking-[0.06em] text-[#2d241d] font-serif font-bold">
          ADD ITEM
        </h1>
        <div className="h-px w-full bg-[#5e5a56]" />
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-3xl rounded-2xl border border-black/10 bg-white/15 p-8 shadow-md">
          {errorMessage && (
            <p className="mb-5 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="mb-5 rounded-lg border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-100">
              {successMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-sans text-[#2d241d]">
                  Item ID
                </label>
                <input
                  type="text"
                  name="itemId"
                  value={formData.itemId}
                  onChange={handleChange}
                  placeholder="0001"
                  className={inputClass("itemId")}
                />
                {errors.itemId && (
                  <p className="mt-1 text-xs font-sans text-red-500">
                    {errors.itemId}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-sans text-[#2d241d]">
                  Brand
                </label>
                <input
                  type="text"
                  name="Brand"
                  value={formData.Brand}
                  onChange={handleChange}
                  placeholder="Raf Simons"
                  className={inputClass("Brand")}
                />
                {errors.Brand && (
                  <p className="mt-1 text-xs font-sans text-red-500">
                    {errors.Brand}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-sans text-[#2d241d]">
                Item Name
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="SS03 Raf Simons Consumed 'Penelope' Blue Sun Faded Hoodie"
                className={inputClass("itemName")}
              />
              {errors.itemName && (
                <p className="mt-1 text-xs font-sans text-red-500">
                  {errors.itemName}
                </p>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-sans text-[#2d241d]">
                  Condition
                </label>
                <input
                  type="text"
                  name="Condition"
                  value={formData.Condition}
                  onChange={handleChange}
                  placeholder="7 / 10"
                  className={inputClass("Condition")}
                />
                {errors.Condition && (
                  <p className="mt-1 text-xs font-sans text-red-500">
                    {errors.Condition}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-sans text-[#2d241d]">
                  Quantity
                </label>
                <input
                  type="text"
                  name="Qty"
                  value={formData.Qty}
                  onChange={handleChange}
                  placeholder="1"
                  className={inputClass("Qty")}
                />
                {errors.Qty && (
                  <p className="mt-1 text-xs font-sans text-red-500">
                    {errors.Qty}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-sans text-[#2d241d]">
                  Price
                </label>
                <input
                  type="text"
                  name="Price"
                  value={formData.Price}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const value = e.target.value.replace("$", "").trim();

                    if (!isNaN(value) && value !== "") {
                      setFormData((prev) => ({
                        ...prev,
                        Price: `$${Number(value).toFixed(2)}`,
                      }));
                    }
                  }}
                  placeholder="5000"
                  className={inputClass("Price")}
                />
                {errors.Price && (
                  <p className="mt-1 text-xs font-sans text-red-500">
                    {errors.Price}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-sans text-[#2d241d]">
                  Image File Name
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="SS03RS.png"
                  className={inputClass("image")}
                />
                {errors.image && (
                  <p className="mt-1 text-xs font-sans text-red-500">
                    {errors.image}
                  </p>
                )}
                <p className="mt-1 text-[11px] font-sans text-black/40">
                  Enter file name only, like SS03RS.png
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-sans text-[#2d241d]">
                Description
              </label>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                placeholder="Enter product description..."
                rows={5}
                className={inputClass("Description")}
              />
              {errors.Description && (
                <p className="mt-1 text-xs font-sans text-red-500">
                  {errors.Description}
                </p>
              )}
            </div>

            <div className="flex justify-center pt-6">
              <div className="flex w-full max-w-md gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#49D357] py-3 text-sm font-sans text-black transition hover:brightness-90 disabled:opacity-70"
                >
                  {loading ? "ADDING..." : "ADD ITEM"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/admin/inventory")}
                  className="w-full rounded-xl border border-black/15 bg-white/40 py-3 text-sm font-sans text-[#2d241d] transition hover:bg-white/55"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
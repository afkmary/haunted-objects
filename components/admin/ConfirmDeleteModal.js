"use client";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  itemName,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1f1f22] p-6 shadow-2xl">
        <h2 className="text-xl font-serif text-white">DELETE ITEM</h2>

        <p className="mt-3 text-sm font-sans text-white/70">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">{itemName}</span>?
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-sans text-white transition hover:bg-white/10 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-500/80 px-5 py-2.5 text-sm font-sans text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
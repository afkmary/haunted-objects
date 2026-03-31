import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <main className="min-h-screen bg-[#8b8b8b] text-white">
      <div className="flex">
        <AdminSidebar />
        <section className="flex-1 px-10 py-8">
          {children}
        </section>
      </div>
    </main>
  );
}
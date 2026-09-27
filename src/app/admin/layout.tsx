import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | White Teak Coffee Roasters",
  description: "Manage section photos, banners, content, and customer inquiries.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0d0906] text-[#F3ECDF] selection:bg-[#c8d96a]/20 selection:text-[#c8d96a]">
      {children}
    </div>
  );
}

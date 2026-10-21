import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ArrivalsSection from "@/components/ArrivalsSection";
import Footer from "@/components/Footer";
import { getAllSectionMedia } from "@/lib/supabase/media";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "New Arrivals — The Summer Affair | White Teak Coffee Roasters",
  description:
    "Discover The Summer Affair — our new mango-inspired arrivals: cakes, cheesecakes, lattes, pancakes, waffles, bowls and more.",
};

export default async function ArrivalsPage() {
  const media = await getAllSectionMedia();

  return (
    <div className="bg-[#FFCB2D] min-h-screen">
      <Navbar />
      <main className="pt-24">
        <ArrivalsSection media={media.arrivals} />
      </main>
      <Footer media={media.footer} locations={media.locations} />
    </div>
  );
}

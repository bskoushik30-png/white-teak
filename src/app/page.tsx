import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FoodGallery from "@/components/FoodGallery";
import NatureSection from "@/components/NatureSection";
import StorySection from "@/components/StorySection";
import FarmSection from "@/components/FarmSection";
import FeatureCards from "@/components/FeatureCards";
import InstagramReelsSection from "@/components/InstagramReelsSection";
import GoogleReviews from "@/components/GoogleReviews";
import LocationsSection from "@/components/LocationsSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import ScrollGradient from "@/components/ScrollGradient";
import SmoothScroll from "@/components/SmoothScroll";
import { getAllSectionMedia } from "@/lib/supabase/media";
import { getInstagramReels } from "@/lib/instagram";

// Revalidate every 60s or on-demand via server action
export const revalidate = 60;

export default async function Home() {
  const [media, reels] = await Promise.all([
    getAllSectionMedia(),
    getInstagramReels(),
  ]);

  return (
    <>
      <SmoothScroll />
      <ScrollGradient />
      <Navbar />
      <main className="relative z-[1]">
        <HeroSection media={media.hero} />
        <FoodGallery media={media.food_gallery} categories={media.categories} />
        <NatureSection media={media.nature} />
        <StorySection media={media.story} />
        <FarmSection media={media.farm} />
        <FeatureCards media={media.feature_cards} />
        <InstagramReelsSection initialReels={reels} />
        <GoogleReviews />
        <LocationsSection media={media.locations} />
        <NewsletterSection />
        <Footer />
      </main>
    </>
  );
}

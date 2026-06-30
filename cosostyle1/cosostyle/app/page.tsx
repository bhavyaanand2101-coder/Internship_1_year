import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import TrendingProducts from "@/components/home/TrendingProducts";
import BestSellers from "@/components/home/BestSellers";
import BrandStory from "@/components/home/BrandStory";
import EditorialBanner from "@/components/home/EditorialBanner";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <main className="bg-[#FAFAFA]">
      <Navbar />
      <Hero />
      <FeaturedCollections />
      <TrendingProducts />
      <BestSellers />
      <BrandStory />
      <EditorialBanner />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}
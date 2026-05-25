import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import ConciergeServices from "@/components/home/ConciergeServices";
import WhyBookWithUs from "@/components/home/WhyBookWithUs";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedProperties />
        <ConciergeServices />
        <WhyBookWithUs />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

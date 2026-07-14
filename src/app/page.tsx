import FeaturedEvents from "@/components/FeaturedEvents";
import HeroBanner from "@/components/HeroBanner";
import InfoSection from "@/components/InfoSection";
import PricingSection from "@/components/PricingSection";


export default function Home() {
  return (
    <div className="">
     <HeroBanner />
     <FeaturedEvents />
     <PricingSection />
     <InfoSection />
    </div>
  );
}

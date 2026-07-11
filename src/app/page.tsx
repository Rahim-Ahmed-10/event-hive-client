import FeaturedEvents from "@/components/FeaturedEvents";
import HeroBanner from "@/components/HeroBanner";
import InfoSection from "@/components/InfoSection";


export default function Home() {
  return (
    <div className="">
     <HeroBanner />
     <FeaturedEvents />
     <InfoSection />
    </div>
  );
}

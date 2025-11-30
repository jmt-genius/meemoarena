import { Navigation } from "@/components/entertainment/Navigation";
import { HeroSection } from "@/components/entertainment/HeroSection";
import { SuggestSection } from "@/components/entertainment/SuggestSection";
import { BookEventSection } from "@/components/entertainment/BookEventSection";
import { SurpriseSection } from "@/components/entertainment/SurpriseSection";
import { Footer } from "@/components/entertainment/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <SuggestSection />
      <BookEventSection />
      <SurpriseSection />
      <Footer />
    </div>
  );
};

export default Index;

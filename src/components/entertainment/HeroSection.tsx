import { Sparkles, Calendar, Zap } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6">
          Entertainment Hub
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered companion for movies, events, games & more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <FeatureCard
          icon={<Sparkles className="w-12 h-12" />}
          title="Suggest Something"
          description="Get personalized recommendations"
          href="#suggest"
        />
        <FeatureCard
          icon={<Calendar className="w-12 h-12" />}
          title="Book an Event"
          description="Find and book entertainment"
          href="#book"
        />
        <FeatureCard
          icon={<Zap className="w-12 h-12" />}
          title="Surprise Me!"
          description="Random entertainment ideas"
          href="#surprise"
        />
      </div>
    </section>
  );
};

import { useState } from "react";
import { Shuffle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const surprises = [
  "🎬 Watch a mystery movie from the 90s!",
  "🎮 Try a random indie game today",
  "📚 Read a book in a genre you've never explored",
  "🍕 Order a pizza with toppings you've never tried",
  "🎭 Attend a local theater performance",
  "🎪 Visit a nearby museum or art gallery",
  "🎵 Listen to music from a country you've never visited",
  "🍜 Try cooking an exotic recipe tonight",
];

export const SurpriseSection = () => {
  const [surprise, setSurprise] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSurprise = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
      setSurprise(randomSurprise);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <section id="surprise" className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full">
        <h2 className="text-5xl font-bold text-foreground text-center mb-12">
          Surprise Me!
        </h2>

        <Card className="bg-card text-card-foreground rounded-[48px] p-12 panel-shadow">
          <CardContent className="flex flex-col items-center gap-8">
            <div
              className={`w-32 h-32 rounded-full bg-secondary/20 flex items-center justify-center transition-transform duration-500 ${
                isAnimating ? "rotate-[360deg] scale-110" : ""
              }`}
            >
              <Shuffle className="w-16 h-16" />
            </div>

            {surprise && !isAnimating && (
              <div className="text-center animate-fade-in">
                <p className="text-3xl font-semibold mb-4">{surprise}</p>
              </div>
            )}

            <Button
              size="lg"
              onClick={handleSurprise}
              disabled={isAnimating}
              className="text-lg px-8 py-6 rounded-full"
            >
              {isAnimating ? "Thinking..." : "Surprise Me!"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

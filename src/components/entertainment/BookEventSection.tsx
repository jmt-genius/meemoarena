import { useState } from "react";
import { Film, Mic, Music, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const eventTypes = [
  { icon: <Film className="w-8 h-8" />, label: "Movies", value: "movies" },
  { icon: <Mic className="w-8 h-8" />, label: "Talk Shows", value: "talkshows" },
  { icon: <Music className="w-8 h-8" />, label: "Concerts", value: "concerts" },
  { icon: <MapPin className="w-8 h-8" />, label: "Find Events", value: "find" },
];

const moviePosters = [
  { title: "Movie 1", color: "from-purple-500 to-pink-500" },
  { title: "Movie 2", color: "from-blue-500 to-cyan-500" },
  { title: "Movie 3", color: "from-green-500 to-emerald-500" },
  { title: "Movie 4", color: "from-orange-500 to-red-500" },
  { title: "Movie 5", color: "from-indigo-500 to-purple-500" },
];

export const BookEventSection = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <section id="book" className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full">
        <h2 className="text-5xl font-bold text-foreground text-center mb-12">
          Book an Event
        </h2>

        {!selectedType ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {eventTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className="bg-card text-card-foreground rounded-[40px] p-8 hover-lift panel-shadow group cursor-pointer transition-all"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {type.icon}
                  </div>
                  <span className="text-lg font-semibold">{type.label}</span>
                </div>
              </button>
            ))}
          </div>
        ) : selectedType === "movies" ? (
          <div className="animate-fade-in">
            <Button
              variant="outline"
              onClick={() => setSelectedType(null)}
              className="mb-6"
            >
              Back
            </Button>
            <Carousel className="w-full">
              <CarouselContent>
                {moviePosters.map((movie, index) => (
                  <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                    <Card className="bg-card rounded-[32px] overflow-hidden hover-lift cursor-pointer">
                      <CardContent className="p-0">
                        <div className={`h-80 bg-gradient-to-br ${movie.color} flex items-center justify-center`}>
                          <span className="text-2xl font-bold text-white">{movie.title}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        ) : selectedType === "find" ? (
          <Card className="bg-card text-card-foreground rounded-[40px] p-8 animate-fade-in">
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location">Enter your location</Label>
                <Input id="location" placeholder="City, State, or ZIP code" />
              </div>
              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => setSelectedType(null)}>
                  Back
                </Button>
                <Button>Search Events</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card text-card-foreground rounded-[40px] p-8 text-center animate-fade-in">
            <CardContent>
              <p className="text-xl mb-6">Coming soon!</p>
              <Button onClick={() => setSelectedType(null)}>Back</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

import { Star, TrendingUp } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Event {
  name: string;
  seatsSold: number;
  revenue: number;
  rating: number;
}

interface EventsCarouselProps {
  events: Event[];
}

export const EventsCarousel = ({ events }: EventsCarouselProps) => {
  return (
    <div className="bg-card text-card-foreground rounded-[50px] p-8 panel-shadow">
      <h2 className="text-2xl font-bold mb-6">Top Events & Bookings</h2>
      
      <Carousel className="w-full">
        <CarouselContent>
          {events.map((event, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-secondary/20 rounded-3xl p-6 hover-lift h-full">
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2">{event.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-300">
                    <Star size={16} fill="currentColor" />
                    <span className="font-semibold">{event.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-80">Seats Sold</span>
                    <span className="font-bold">{event.seatsSold.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-80">Revenue</span>
                    <span className="font-bold text-green-300">
                      ${(event.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-sm text-green-300">
                    <TrendingUp size={14} />
                    <span>Trending</span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-secondary hover:bg-secondary/80" />
        <CarouselNext className="bg-secondary hover:bg-secondary/80" />
      </Carousel>
    </div>
  );
};

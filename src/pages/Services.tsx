import { Navigation } from "@/components/entertainment/Navigation";
import { Footer } from "@/components/entertainment/Footer";
import { Sparkles, Calendar, Zap, Film, Book, Gamepad2, Music, Utensils, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const services = [
  {
    icon: <Sparkles className="w-10 h-10" />,
    title: "AI Recommendations",
    description: "Get personalized entertainment suggestions powered by advanced AI algorithms that learn your preferences.",
    features: ["Smart genre matching", "Mood-based suggestions", "Similar content discovery"]
  },
  {
    icon: <Calendar className="w-10 h-10" />,
    title: "Event Booking",
    description: "Book tickets for movies, concerts, shows, and events all in one place with real-time availability.",
    features: ["Real-time seat selection", "Multiple payment options", "Digital ticket delivery"]
  },
  {
    icon: <Film className="w-10 h-10" />,
    title: "Movie Database",
    description: "Access comprehensive information about movies including ratings, reviews, cast, and streaming availability.",
    features: ["10M+ movie database", "Where to watch info", "User reviews & ratings"]
  },
  {
    icon: <Book className="w-10 h-10" />,
    title: "Book Recommendations",
    description: "Discover your next great read with curated book suggestions based on your reading history and interests.",
    features: ["Genre exploration", "Author discovery", "Reading lists"]
  },
  {
    icon: <Gamepad2 className="w-10 h-10" />,
    title: "Gaming Hub",
    description: "Find new games to play, track your gaming journey, and connect with gaming communities.",
    features: ["Multi-platform coverage", "Game reviews", "Community forums"]
  },
  {
    icon: <Music className="w-10 h-10" />,
    title: "Concert Finder",
    description: "Never miss your favorite artists live. Get alerts for concerts and festivals near you.",
    features: ["Location-based search", "Artist notifications", "Venue information"]
  },
  {
    icon: <Utensils className="w-10 h-10" />,
    title: "Dining Suggestions",
    description: "Explore restaurants, cafes, and dining experiences tailored to your taste and mood.",
    features: ["Cuisine variety", "Dietary filters", "Reservation support"]
  },
  {
    icon: <Award className="w-10 h-10" />,
    title: "Premium Features",
    description: "Unlock exclusive benefits with ENTEZO Premium including early access and priority booking.",
    features: ["Early ticket access", "No booking fees", "Premium support"]
  },
  {
    icon: <Zap className="w-10 h-10" />,
    title: "Surprise Me",
    description: "Let ENTEZO pick random entertainment experiences you might never have discovered on your own.",
    features: ["Random discovery", "Adventure mode", "Challenge yourself"]
  }
];

export default function Services() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-6 py-24">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to discover, plan, and enjoy your entertainment experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="bg-card text-card-foreground rounded-[40px] p-6 hover-lift panel-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-card-foreground/80">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-card-foreground/90">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-card text-card-foreground rounded-[48px] p-12 max-w-3xl mx-auto panel-shadow">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg text-card-foreground/80">
                Join thousands of entertainment enthusiasts using ENTEZO every day
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-6">
              <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-4 rounded-full text-lg font-semibold transition-all hover-lift">
                Start Exploring
              </button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

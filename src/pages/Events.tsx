import { useState } from "react";
import { Navigation } from "@/components/entertainment/Navigation";
import { Footer } from "@/components/entertainment/Footer";
import { MapPin, Calendar, Search, Music, Film, Mic, Theater, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const upcomingEvents = [
  {
    title: "Summer Music Festival 2024",
    type: "Concert",
    icon: <Music className="w-6 h-6" />,
    date: "June 15-17, 2024",
    location: "Central Park, New York",
    price: "$89 - $299",
    image: "from-pink-500 to-purple-500",
    rating: 4.8,
    attendees: "50K+"
  },
  {
    title: "Marvel Studios: Endgame Rerelease",
    type: "Movie",
    icon: <Film className="w-6 h-6" />,
    date: "June 20, 2024",
    location: "AMC Theaters Nationwide",
    price: "$15 - $25",
    image: "from-red-500 to-orange-500",
    rating: 4.9,
    attendees: "1M+"
  },
  {
    title: "Stand-Up Comedy Night",
    type: "Comedy",
    icon: <Mic className="w-6 h-6" />,
    date: "June 22, 2024",
    location: "Comedy Club, Los Angeles",
    price: "$35 - $75",
    image: "from-yellow-500 to-amber-500",
    rating: 4.6,
    attendees: "2K+"
  },
  {
    title: "Broadway: Hamilton",
    type: "Theater",
    icon: <Theater className="w-6 h-6" />,
    date: "June 25-30, 2024",
    location: "Richard Rodgers Theatre, NYC",
    price: "$179 - $499",
    image: "from-blue-500 to-cyan-500",
    rating: 5.0,
    attendees: "100K+"
  },
  {
    title: "Jazz Night Under Stars",
    type: "Concert",
    icon: <Music className="w-6 h-6" />,
    date: "July 1, 2024",
    location: "Riverside Park, Chicago",
    price: "$45 - $120",
    image: "from-indigo-500 to-purple-500",
    rating: 4.7,
    attendees: "5K+"
  },
  {
    title: "Indie Film Premiere",
    type: "Movie",
    icon: <Film className="w-6 h-6" />,
    date: "July 5, 2024",
    location: "Sundance Cinema, Various",
    price: "$18 - $30",
    image: "from-green-500 to-teal-500",
    rating: 4.5,
    attendees: "500+"
  }
];

const categories = [
  { name: "All Events", icon: <Star className="w-5 h-5" /> },
  { name: "Concerts", icon: <Music className="w-5 h-5" /> },
  { name: "Movies", icon: <Film className="w-5 h-5" /> },
  { name: "Theater", icon: <Theater className="w-5 h-5" /> },
  { name: "Comedy", icon: <Mic className="w-5 h-5" /> }
];

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState("All Events");

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Discover Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find and book amazing entertainment experiences near you
          </p>
        </div>

        {/* Search Section */}
        <Card className="bg-card text-card-foreground rounded-[48px] p-8 mb-12 max-w-4xl mx-auto panel-shadow">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search events, artists, venues..." 
                    className="pl-12 h-14 text-lg rounded-full bg-background/20 border-card-foreground/20"
                  />
                </div>
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Location" 
                  className="pl-12 h-14 text-lg rounded-full bg-background/20 border-card-foreground/20"
                />
              </div>
            </div>
            <Button size="lg" className="w-full mt-4 h-14 text-lg rounded-full">
              Search Events
            </Button>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === category.name
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-card text-card-foreground hover:bg-card/80"
              } panel-shadow`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Upcoming Events
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card 
                key={index}
                className="bg-card text-card-foreground rounded-[40px] overflow-hidden hover-lift panel-shadow cursor-pointer"
              >
                <div className={`h-48 bg-gradient-to-br ${event.image} flex items-center justify-center`}>
                  <div className="text-6xl font-bold text-white opacity-20">
                    {event.icon}
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-secondary/20 text-card-foreground border-0">
                      {event.type}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{event.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                  <CardDescription className="text-card-foreground/80 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{event.price}</div>
                      <div className="text-sm text-card-foreground/60">{event.attendees} attending</div>
                    </div>
                    <Button size="sm" className="rounded-full">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Venues */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Popular Venues
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {["Madison Square Garden", "Hollywood Bowl", "Red Rocks", "Lincoln Center"].map((venue, index) => (
              <Card 
                key={index}
                className="bg-card text-card-foreground rounded-[32px] p-6 text-center hover-lift panel-shadow cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">{venue}</h3>
                  <p className="text-card-foreground/60 text-sm mt-1">View Events</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-card text-card-foreground rounded-[48px] p-12 text-center panel-shadow">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">Can't Find What You're Looking For?</CardTitle>
            <CardDescription className="text-lg text-card-foreground/80">
              Set up alerts and we'll notify you when new events match your interests
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6">
            <Button size="lg" className="px-8 py-6 text-lg rounded-full">
              Create Event Alert
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

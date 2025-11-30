import { Navigation } from "@/components/entertainment/Navigation";
import { Footer } from "@/components/entertainment/Footer";
import { Target, Users, Lightbulb, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const values = [
  {
    icon: <Target className="w-10 h-10" />,
    title: "Our Mission",
    description: "To make entertainment discovery effortless and enjoyable for everyone, powered by intelligent recommendations and seamless booking experiences."
  },
  {
    icon: <Lightbulb className="w-10 h-10" />,
    title: "Innovation First",
    description: "We leverage cutting-edge AI technology to understand your preferences and suggest entertainment that truly resonates with you."
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: "Community Driven",
    description: "Built by entertainment lovers, for entertainment lovers. Your feedback shapes our platform every single day."
  },
  {
    icon: <Heart className="w-10 h-10" />,
    title: "Passion for Entertainment",
    description: "We believe life is better with great movies, music, books, and experiences. Our goal is to help you find them all."
  }
];

const stats = [
  { number: "2M+", label: "Active Users" },
  { number: "500K+", label: "Events Booked" },
  { number: "10M+", label: "Recommendations Made" },
  { number: "50+", label: "Countries Served" }
];

const team = [
  { name: "Alex Chen", role: "CEO & Founder", bio: "Former Netflix engineer passionate about personalization" },
  { name: "Sarah Mitchell", role: "Head of Product", bio: "10+ years building entertainment platforms" },
  { name: "Marcus Johnson", role: "Chief AI Officer", bio: "PhD in Machine Learning from Stanford" },
  { name: "Emma Rodriguez", role: "Head of Partnerships", bio: "Connecting with venues and content providers worldwide" }
];

export default function About() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            About ENTEZO
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're on a mission to revolutionize how people discover and experience entertainment. 
            From movies and concerts to books and games, ENTEZO brings it all together in one intelligent platform.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className="bg-card text-card-foreground rounded-[32px] p-6 text-center panel-shadow hover-lift"
            >
              <CardContent className="p-0">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-card-foreground/70">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card 
                key={index}
                className="bg-card text-card-foreground rounded-[40px] p-8 hover-lift panel-shadow"
              >
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-2xl mb-2">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-card-foreground/80 text-lg leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <Card className="bg-card text-card-foreground rounded-[48px] p-12 mb-20 max-w-4xl mx-auto panel-shadow">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-card-foreground/80 text-lg leading-relaxed">
              <p>
                ENTEZO was born from a simple frustration: spending more time deciding what to watch 
                than actually watching it. Our founders, tired of endless scrolling and mediocre recommendations, 
                set out to build something better.
              </p>
              <p>
                In 2022, we launched with a bold vision—to create an AI-powered entertainment companion 
                that truly understands you. Not just your watch history, but your mood, your schedule, 
                and what you're really looking for in any given moment.
              </p>
              <p>
                Today, millions of users trust ENTEZO to help them discover their next favorite movie, 
                book the perfect concert tickets, or simply surprise them with something completely unexpected. 
                And we're just getting started.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card 
                key={index}
                className="bg-card text-card-foreground rounded-[32px] p-6 text-center hover-lift panel-shadow"
              >
                <CardContent className="p-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-secondary text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-card-foreground/70 text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-card text-card-foreground rounded-[48px] p-12 text-center max-w-3xl mx-auto panel-shadow">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">Join Our Journey</CardTitle>
            <CardDescription className="text-lg text-card-foreground/80">
              We're always looking for passionate people to join our mission. 
              Whether as a user or team member, we'd love to have you.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6 flex gap-4 justify-center flex-wrap">
            <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-4 rounded-full text-lg font-semibold transition-all hover-lift">
              View Careers
            </button>
            <button className="bg-background/20 text-card-foreground hover:bg-background/30 px-8 py-4 rounded-full text-lg font-semibold transition-all hover-lift border border-card-foreground/20">
              Contact Us
            </button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

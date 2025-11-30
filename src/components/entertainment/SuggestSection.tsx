import { useState } from "react";
import { Film, Book, Gamepad2, UtensilsCrossed, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  { icon: <Film className="w-8 h-8" />, label: "Movies", value: "movies" },
  { icon: <Book className="w-8 h-8" />, label: "Books", value: "books" },
  { icon: <Gamepad2 className="w-8 h-8" />, label: "Games", value: "games" },
  { icon: <UtensilsCrossed className="w-8 h-8" />, label: "Food", value: "food" },
  { icon: <MoreHorizontal className="w-8 h-8" />, label: "More", value: "more" },
];

export const SuggestSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <section id="suggest" className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full">
        <h2 className="text-5xl font-bold text-foreground text-center mb-12">
          Suggest Something
        </h2>

        {!selectedCategory ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className="bg-card text-card-foreground rounded-[40px] p-8 hover-lift panel-shadow group cursor-pointer transition-all"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <span className="text-lg font-semibold">{category.label}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <Card className="bg-card text-card-foreground rounded-[40px] p-8 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-3xl">Tell us your preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select>
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="action">Action</SelectItem>
                      <SelectItem value="comedy">Comedy</SelectItem>
                      <SelectItem value="drama">Drama</SelectItem>
                      <SelectItem value="scifi">Sci-Fi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" placeholder="2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Minimum Rating</Label>
                  <Select>
                    <SelectTrigger id="rating">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7+ ⭐</SelectItem>
                      <SelectItem value="8">8+ ⭐</SelectItem>
                      <SelectItem value="9">9+ ⭐</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mood">Mood</Label>
                  <Input id="mood" placeholder="Exciting, Relaxing..." />
                </div>
              </div>
              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                  Back
                </Button>
                <Button>Get Suggestions</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

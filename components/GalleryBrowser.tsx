"use client";

import { useState, useEffect } from "react";
import { Folder, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Button } from "@/components/ui/button";

type GalleryImage = {
  imageUrl: string;
  category: string;
};

export function GalleryBrowser({ images }: { images: GalleryImage[] }) {
  const [view, setView] = useState<"MENU" | "ALL" | "CATEGORIES" | "CATEGORY_VIEW">("MENU");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Animation state for "All Photos" thumbnail crossfade
  const [currentThumbIndex, setCurrentThumbIndex] = useState(0);

  // Grab the 4 latest images for the slideshow thumbnail
  const latestThumbnails = images.slice(0, 4).map(img => img.imageUrl);
  
  useEffect(() => {
    if (latestThumbnails.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentThumbIndex((prev) => (prev + 1) % latestThumbnails.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [latestThumbnails.length]);

  // Derive categories
  const categoriesMap = new Map<string, number>();
  images.forEach(img => {
    categoriesMap.set(img.category, (categoriesMap.get(img.category) || 0) + 1);
  });
  const categories = Array.from(categoriesMap.entries()).map(([name, count]) => ({ name, count }));

  if (view === "MENU") {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-black text-center mb-10">Moments of Glory</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 group relative overflow-hidden min-h-[300px] flex items-center justify-center border-2"
            onClick={() => setView("ALL")}
          >
            {/* Animated Background Slideshow */}
            {latestThumbnails.map((src, idx) => (
              <div 
                key={src}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${currentThumbIndex === idx ? 'opacity-40 scale-105' : 'opacity-0 scale-100'}`}
                style={{ backgroundImage: `url(${src})`, transitionProperty: 'opacity, transform' }}
              />
            ))}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

            <CardContent className="relative z-10 p-8 flex flex-col items-center text-center space-y-4 text-white">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black drop-shadow-md">All Photos</h3>
                <p className="text-white/80 mt-2 font-medium">Browse every incredible moment captured.</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-500/50 group relative overflow-hidden min-h-[300px] flex items-center justify-center border-2"
            onClick={() => setView("CATEGORIES")}
          >
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(/hero-bg.jpg)` }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

            <CardContent className="relative z-10 p-8 flex flex-col items-center text-center space-y-4 text-white">
              <div className="w-16 h-16 bg-blue-500/40 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Folder className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black drop-shadow-md">Category Wise</h3>
                <p className="text-white/80 mt-2 font-medium">Browse albums by sport and event type.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (view === "CATEGORIES") {
    return (
      <div className="space-y-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <Button variant="outline" onClick={() => setView("MENU")}>
            <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" /> 
            <span className="hidden md:inline">Back to Menu</span>
            <span className="md:hidden">Back</span>
          </Button>
          <h2 className="text-2xl font-bold">Albums by Category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Card 
              key={cat.name} 
              className="cursor-pointer hover:shadow-lg transition-all group border-muted relative overflow-hidden min-h-[200px] flex items-end"
              onClick={() => {
                setSelectedCategory(cat.name);
                setView("CATEGORY_VIEW");
              }}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url(/grassroots-bg.jpg)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <CardContent className="relative z-10 p-4 w-full text-white">
                <h4 className="font-black text-xl drop-shadow-md">{cat.name}</h4>
                <p className="text-sm text-white/80 font-bold">{cat.count} Photos</p>
              </CardContent>
            </Card>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No categories found.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ALL or CATEGORY_VIEW
  const displayedImages = view === "ALL" 
    ? images.map(img => img.imageUrl) 
    : images.filter(img => img.category === selectedCategory).map(img => img.imageUrl);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <Button variant="outline" onClick={() => view === "ALL" ? setView("MENU") : setView("CATEGORIES")}>
          <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" /> 
          <span className="hidden md:inline">Back</span>
          <span className="md:hidden">Back</span>
        </Button>
        <h2 className="text-2xl font-bold">
          {view === "ALL" ? "All Photos" : `${selectedCategory} Album`}
        </h2>
      </div>
      <GalleryGrid images={displayedImages} />
    </div>
  );
}

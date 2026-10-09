"use client";

import { useState } from "react";
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
            className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 group"
            onClick={() => setView("ALL")}
          >
            <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ImageIcon className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">View All Photos</h3>
                <p className="text-muted-foreground mt-2">Browse every incredible moment captured.</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-500/50 group"
            onClick={() => setView("CATEGORIES")}
          >
            <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Folder className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">View Category Wise</h3>
                <p className="text-muted-foreground mt-2">Browse albums by sport and event type.</p>
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
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setView("MENU")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Menu
          </Button>
          <h2 className="text-2xl font-bold">Albums by Category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Card 
              key={cat.name} 
              className="cursor-pointer hover:shadow-md transition-all group border-muted"
              onClick={() => {
                setSelectedCategory(cat.name);
                setView("CATEGORY_VIEW");
              }}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <Folder className="w-12 h-12 text-yellow-500 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg">{cat.name}</h4>
                  <p className="text-sm text-muted-foreground">{cat.count} Photos</p>
                </div>
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
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => view === "ALL" ? setView("MENU") : setView("CATEGORIES")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-bold">
          {view === "ALL" ? "All Photos" : `${selectedCategory} Album`}
        </h2>
      </div>
      <GalleryGrid images={displayedImages} />
    </div>
  );
}

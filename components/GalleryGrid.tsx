"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";

export function GalleryGrid({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return <div className="text-center py-24 text-muted-foreground italic">No gallery images uploaded yet.</div>;
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const handleDownload = async (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `BKV_Gallery_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Failed to download image", err);
      // Fallback for direct download if fetch fails (e.g. CORS)
      window.open(url, '_blank');
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {images.map((src, index) => (
          <div 
            key={index} 
            className="relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-muted group"
            onClick={() => setSelectedIndex(index)}
          >
            <Image 
              src={src} 
              alt={`Gallery image ${index + 1}`} 
              fill 
              className="object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={() => setSelectedIndex(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <button 
            className="absolute top-6 right-20 text-white/70 hover:text-white transition-colors"
            onClick={(e) => handleDownload(e, images[selectedIndex])}
            title="Download Image"
          >
            <Download className="w-7 h-7" />
          </button>

          <button 
            className="absolute left-4 md:left-12 text-white/50 hover:text-white transition-colors p-4"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <div className="relative w-full max-w-5xl max-h-[85vh] aspect-video px-4 md:px-0" onClick={e => e.stopPropagation()}>
            <Image 
              src={images[selectedIndex]} 
              alt={`Gallery preview`} 
              fill 
              className="object-contain" 
            />
          </div>

          <button 
            className="absolute right-4 md:right-12 text-white/50 hover:text-white transition-colors p-4"
            onClick={handleNext}
          >
            <ChevronRight className="w-12 h-12" />
          </button>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-medium tracking-widest text-sm">
             {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

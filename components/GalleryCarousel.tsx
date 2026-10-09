"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export function GalleryCarousel({ images }: { images?: string[] }) {
  // Fallback to empty if no images exist yet
  const displayImages = images && images.length > 0 ? images : [];
  
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  if (displayImages.length === 0) {
     return (
        <section className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground italic">No gallery images uploaded yet.</p>
        </section>
     );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="space-y-4 text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Moments of Glory</h2>
        <p className="text-muted-foreground">Highlights from our recent rural sporting events.</p>
      </div>
      
      <div className="px-12 max-w-5xl mx-auto">
        <Carousel 
          opts={{ align: "start", loop: true }} 
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full"
        >
          <CarouselContent>
            {displayImages.map((src, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-sm border border-muted/50">
                    <Image src={src} alt={`Gallery image ${index + 1}`} fill className="object-cover" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}

"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";

export function GalleryCarousel() {
  const images = [
    "https://picsum.photos/seed/gal1/800/600",
    "https://picsum.photos/seed/gal2/800/600",
    "https://picsum.photos/seed/gal3/800/600",
    "https://picsum.photos/seed/gal4/800/600",
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="space-y-4 text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Moments of Glory</h2>
        <p className="text-muted-foreground">Highlights from our recent rural sporting events.</p>
      </div>
      
      <div className="px-12 max-w-5xl mx-auto">
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {images.map((src, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-sm">
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

import { GalleryCarousel } from "@/components/GalleryCarousel";

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4">Event Gallery</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse through the incredible moments captured during our tournaments.
        </p>
      </div>
      <GalleryCarousel />
    </div>
  );
}

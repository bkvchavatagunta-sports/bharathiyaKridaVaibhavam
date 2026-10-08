import { GalleryCarousel } from "@/components/GalleryCarousel";
import prisma from "@/lib/db";

export default async function GalleryPage() {
  const dbImages = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const imageUrls = dbImages.map(img => img.url);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4">Event Gallery</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse through the incredible moments captured during our tournaments.
        </p>
      </div>
      <GalleryCarousel images={imageUrls} />
    </div>
  );
}

import { GalleryGrid } from "@/components/GalleryGrid";
import prisma from "@/lib/db";

export default async function GalleryPage() {
  const dbImages = await prisma.galleryImage.findMany({
    orderBy: { uploadedAt: 'desc' }
  });
  const imageUrls = dbImages.map(img => img.imageUrl);

  return (
    <div className="container mx-auto py-8 min-h-[70vh]">
      <GalleryGrid images={imageUrls} />
    </div>
  );
}

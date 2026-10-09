import { GalleryBrowser } from "@/components/GalleryBrowser";
import prisma from "@/lib/db";

export default async function GalleryPage() {
  const dbImages = await prisma.galleryImage.findMany({
    orderBy: { uploadedAt: 'desc' },
    select: {
      imageUrl: true,
      category: true,
    }
  });

  return (
    <div className="container mx-auto py-12 px-4 min-h-[70vh]">
      <GalleryBrowser images={dbImages} />
    </div>
  );
}

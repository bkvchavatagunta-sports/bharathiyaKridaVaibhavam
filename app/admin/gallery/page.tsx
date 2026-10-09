import prisma from "@/lib/db";
import { GalleryGridAdmin } from "./GalleryGridAdmin";
import { GalleryUploader } from "@/components/GalleryUploader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { uploadedAt: 'desc' }
  });

  return (
    <div className="p-8 space-y-8 min-h-screen bg-muted/10">
      <div>
        <h1 className="text-3xl font-bold">Photos Management</h1>
        <p className="text-muted-foreground mt-1">Upload new photos and manage the public gallery.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="border-0 shadow-sm sticky top-8">
            <CardHeader className="border-b bg-muted/10">
              <CardTitle>Upload Photos</CardTitle>
              <CardDescription>Add new moments to the gallery.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <GalleryUploader />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <GalleryGridAdmin images={images} />
        </div>
      </div>
    </div>
  );
}

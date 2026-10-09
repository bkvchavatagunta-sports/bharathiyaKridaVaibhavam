import prisma from "@/lib/db";
import { HeroGridAdmin } from "./HeroGridAdmin";
import { HeroUploader } from "./HeroUploader";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const images = await prisma.heroImage.findMany({
    orderBy: { uploadedAt: "desc" }
  });

  return (
    <div className="p-8 space-y-8 bg-muted/10 min-h-full">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-muted flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">Hero Backgrounds</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage the auto-sliding carousel background for the main page.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-muted">
        <h2 className="text-xl font-bold mb-4">Upload New Image</h2>
        <HeroUploader />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Current Backgrounds</h2>
        <HeroGridAdmin images={images} />
      </div>
    </div>
  );
}

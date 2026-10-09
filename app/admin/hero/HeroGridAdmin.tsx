"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { deleteHeroImage } from "@/app/actions/hero";

export function HeroGridAdmin({ images }: { images: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero image?")) return;
    setLoadingId(id);
    await deleteHeroImage(id);
    setLoadingId(null);
  };

  if (images.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-dashed">
        <p className="text-muted-foreground font-medium">No hero images uploaded yet. Upload some above to show on the main page carousel.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {images.map(img => (
        <div key={img.id} className="group relative rounded-xl overflow-hidden shadow-sm border bg-white aspect-video">
          <Image src={img.imageUrl} alt="Hero" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <button 
              onClick={() => handleDelete(img.id)}
              disabled={loadingId === img.id}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-transform"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

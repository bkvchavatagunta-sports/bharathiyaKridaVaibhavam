"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteGalleryImage } from "@/app/actions/gallery";
import { format } from "date-fns";

type GalleryImage = {
  id: string;
  imageUrl: string;
  category: string;
  uploadedAt: Date;
};

export function GalleryGridAdmin({ images }: { images: GalleryImage[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this photo? This will instantly remove it from the public gallery.")) {
      setLoadingId(id);
      await deleteGalleryImage(id);
      setLoadingId(null);
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border">
        <p className="text-muted-foreground">No photos uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((img) => (
        <div key={img.id} className="group relative border rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="aspect-[4/3] w-full relative">
            <img 
              src={img.imageUrl} 
              alt="Gallery" 
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <Button 
                 variant="destructive" 
                 size="sm" 
                 className="font-bold shadow-xl"
                 disabled={loadingId === img.id}
                 onClick={() => handleDelete(img.id)}
               >
                 <Trash2 className="w-4 h-4 mr-2" />
                 {loadingId === img.id ? "Deleting..." : "Delete Photo"}
               </Button>
            </div>
          </div>
          <div className="p-3 bg-white flex justify-between items-center border-t">
            <Badge variant="secondary" className="font-semibold text-xs">{img.category}</Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {format(new Date(img.uploadedAt), 'dd/MM/yyyy')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

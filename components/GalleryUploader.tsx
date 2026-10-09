"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import { addGalleryImage } from "@/app/actions/gallery";

export function GalleryUploader() {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("General");

  const SPORTS_CATEGORIES = [
    "General",
    "Football",
    "Athletics",
    "Hockey",
    "Kabaddi",
    "Volleyball",
    "Cricket",
    "Badminton",
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-2">
        <UploadCloud className="w-10 h-10 text-primary" />
      </div>
      <p className="text-sm text-center text-muted-foreground">
        Select a category below, then upload photos for the landing page carousel and gallery.
      </p>

      <div className="w-full max-w-xs space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Select Category
        </label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {SPORTS_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <CldUploadWidget 
        signatureEndpoint="/api/sign-image"
        onSuccess={async (result: any) => {
          const url = result?.info?.secure_url;
          if (url) {
            setUploadedPhotos((prev) => [...prev, url]);
            await addGalleryImage(url, category);
          }
        }}
      >
        {({ open }) => {
          return (
            <Button size="lg" className="w-full font-bold shadow-md max-w-xs" onClick={() => open()}>
              Upload Photos to {category}
            </Button>
          );
        }}
      </CldUploadWidget>

      {uploadedPhotos.length > 0 && (
        <div className="w-full space-y-2 pt-4 border-t">
          <p className="font-semibold text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            {uploadedPhotos.length} Photo(s) Saved to {category}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {uploadedPhotos.map((url, i) => (
              <img key={i} src={url} alt="Upload preview" className="w-16 h-16 object-cover rounded-md border shadow-sm shrink-0" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";

export function GalleryUploader() {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-2">
        <UploadCloud className="w-10 h-10 text-primary" />
      </div>
      <p className="text-sm text-center text-muted-foreground">
        Images uploaded here will automatically appear in the public gallery carousel.
      </p>
      
      <CldUploadWidget 
        signatureEndpoint="/api/sign-image"
        onSuccess={async (result: any) => {
          const url = result?.info?.secure_url;
          setUploadedPhotos([...uploadedPhotos, url]);
          
          // In a real app we would call a server action here to save to the DB GalleryImage table.
        }}
      >
        {({ open }) => {
          return (
            <Button size="lg" className="w-full font-bold shadow-md" onClick={() => open()}>
              Upload Photos
            </Button>
          );
        }}
      </CldUploadWidget>

      {uploadedPhotos.length > 0 && (
        <div className="w-full space-y-2 pt-4 border-t">
          <p className="font-semibold text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            {uploadedPhotos.length} Photo(s) Uploaded
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

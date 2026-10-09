"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { addHeroImage } from "@/app/actions/hero";

export function HeroUploader() {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  return (
    <div className="w-full flex flex-col items-center">
      <CldUploadWidget 
        signatureEndpoint="/api/sign-image"
        onSuccess={async (result: any) => {
          const url = result?.info?.secure_url;
          if (url) {
            setUploadedPhotos((prev) => [...prev, url]);
            await addHeroImage(url);
          }
        }}
      >
        {({ open }) => {
          return (
            <div 
              onClick={() => open()}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="mb-2 text-sm text-muted-foreground font-medium">
                  <span className="font-bold text-primary">Click to upload</span> a new Hero Image
                </p>
              </div>
            </div>
          );
        }}
      </CldUploadWidget>

      {uploadedPhotos.length > 0 && (
        <div className="w-full space-y-2 pt-4 mt-4 border-t">
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

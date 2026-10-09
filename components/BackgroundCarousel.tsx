"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function BackgroundCarousel({ imageUrls, opacity = 100, interval = 5000 }: { imageUrls: string[], opacity?: number, interval?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!imageUrls || imageUrls.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
    }, interval);
    return () => clearInterval(timer);
  }, [imageUrls, interval]);

  if (!imageUrls || imageUrls.length === 0) return null;

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden opacity-${opacity}`}>
      {imageUrls.map((url, i) => (
        <div
          key={url + i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={url}
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

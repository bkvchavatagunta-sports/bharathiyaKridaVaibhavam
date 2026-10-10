import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/chavatagunta", destination: "/" },
      { source: "/bulletYouth", destination: "/" },
      { source: "/vedurukuppam", destination: "/" },
      { source: "/tirupati", destination: "/" },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default withPWA(nextConfig);

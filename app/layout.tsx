import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://bharathiyakridavaibhavam.onrender.com"),
  title: "Bharatiya Krida Vaibhavam | BKV Sports",
  description: "Empowering rural athletes and managing sports events in Andhra Pradesh. Join Bharatiya Krida Vaibhavam for grassroot sports, football, athletics, and more.",
  keywords: ["Bharatiya Krida Vaibhavam", "BKV Sports", "Chavatagunta", "Bullet Youth", "Vedurukuppam", "Tirupati", "Rural Sports", "Andhra Pradesh Sports", "Athletics", "Football", "Grassroots Athletes"],
  authors: [{ name: "BKV Admin" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://bharathiyakridavaibhavam.onrender.com/",
    siteName: "Bharatiya Krida Vaibhavam",
    title: "Bharatiya Krida Vaibhavam | BKV Sports",
    description: "Empowering rural athletes and managing sports events in Andhra Pradesh.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Bharatiya Krida Vaibhavam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bharatiya Krida Vaibhavam | BKV Sports",
    description: "Empowering rural athletes and managing sports events in Andhra Pradesh.",
    images: ["/icon-512.png"],
  },
  manifest: "/manifest.json",
  verification: {
    google: "dneGurYR-8a7Io19NbTRiIcf8swZhebRTJPXs2O-VhU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}

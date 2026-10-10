import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bharatiya Krida Vaibhavam | BKV Sports",
  description: "Empowering rural athletes and managing sports events in Andhra Pradesh. Join Bharatiya Krida Vaibhavam for grassroot sports, football, athletics, and more.",
  keywords: ["Bharatiya Krida Vaibhavam", "BKV Sports", "Chavatagunta", "Bullet Youth", "Vedurukuppam", "Tirupati", "Rural Sports", "Andhra Pradesh Sports", "Athletics", "Football", "Grassroots Athletes"],
  authors: [{ name: "BKV Admin" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://bharathiyakridavaibhavam.onrender.com/",
    siteName: "Bharatiya Krida Vaibhavam",
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

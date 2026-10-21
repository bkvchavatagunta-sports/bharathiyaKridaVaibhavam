import { RegistrationForm } from "@/components/RegistrationForm";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const event = await prisma.event.findUnique({ where: { slug: resolvedParams.slug } });

  if (!event) {
    return { title: "Register | Event Not Found" };
  }

  const title = `Register: ${event.title} | BKV Sports`;
  const description = `Register online for ${event.title}. Entry Fee: ${event.entryFee > 0 ? `₹${event.entryFee}` : 'Free'}. Venue: ${event.venue}.`;
  const siteUrl = "https://bharathiyakridavaibhavam.onrender.com";
  const registerUrl = `${siteUrl}/events/${event.slug}/register`;
  const imageUrl = event.bannerImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: registerUrl,
      siteName: "Bharatiya Krida Vaibhavam",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: `Register for ${event.title}`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function RegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const event = await prisma.event.findUnique({ where: { slug: resolvedParams.slug } });
  
  if (!event) {
    notFound();
  }
  
  if (event.status === "COMPLETED" || event.status === "CANCELLED") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h1 className="text-4xl font-black text-red-600">Registration Closed</h1>
        <p className="text-muted-foreground text-lg">This event is no longer accepting new registrations.</p>
      </div>
    );
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: "global" } });
  const upiId = settings?.upiId || "bkv@ybl";

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <RegistrationForm event={event} upiId={upiId} />
    </div>
  );
}

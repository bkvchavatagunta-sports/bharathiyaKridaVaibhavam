import { RegistrationForm } from "@/components/RegistrationForm";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function RegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let event = await prisma.event.findUnique({ where: { slug: resolvedParams.slug } });
  
  if (!event) {
    event = {
      id: "mock-1",
      title: "Annual Village Marathon 2026",
      slug: "village-marathon-2026",
      entryFee: 250,
    } as any;
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <RegistrationForm event={event} />
    </div>
  );
}

import { RegistrationForm } from "@/components/RegistrationForm";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

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

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <RegistrationForm event={event} />
    </div>
  );
}

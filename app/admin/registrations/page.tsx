import prisma from "@/lib/db";
import { RegistrationsList } from "./RegistrationsList";

export const dynamic = "force-dynamic";

export default async function RegistrationsPage() {
  const registrations = await prisma.registration.findMany({
    include: { event: true, user: true },
    orderBy: { registeredAt: 'desc' }
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Participant Registrations</h1>
        <p className="text-muted-foreground mt-1">Review registrations, organize by categories, and verify payments.</p>
      </div>

      <RegistrationsList registrations={registrations} />
    </div>
  );
}

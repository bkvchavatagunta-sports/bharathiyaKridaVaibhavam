import prisma from "@/lib/db";
import { SponsorsListAdmin } from "./SponsorsListAdmin";
import { AddSponsorForm } from "./AddSponsorForm";

export const dynamic = "force-dynamic";

export default async function AdminSponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: { amount: "desc" }
  });

  return (
    <div className="p-8 space-y-8 bg-muted/10 min-h-full">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-muted flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">Manage Patrons & Sponsors</h1>
          <p className="text-muted-foreground mt-2 font-medium">Add, hide, and remove patrons supporting BKV.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <AddSponsorForm />
        </div>
        <div className="md:col-span-2">
          <SponsorsListAdmin sponsors={sponsors} />
        </div>
      </div>
    </div>
  );
}

import prisma from "@/lib/db";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function SponsorsPublicPage() {
  const sponsors = await prisma.sponsor.findMany({
    where: { isVisible: true },
    orderBy: { amount: "desc" }
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
          <h1 className="text-4xl font-black">Our Esteemed Patrons</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A heartfelt thank you to the individuals and organizations whose generous support makes Bharatiya Krida Vaibhavam possible.
          </p>
        </div>

        {sponsors.length === 0 ? (
          <div className="text-center p-12 bg-muted/30 rounded-2xl border">
            <p className="text-muted-foreground">The patrons list is currently being updated.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-sm">Patron Name</th>
                    <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-sm">Designation</th>
                    <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-sm">From</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sponsors.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-bold text-lg flex items-center gap-3">
                        <span className="text-muted-foreground text-sm font-mono w-4">{idx + 1}.</span>
                        {s.name}
                      </td>
                      <td className="p-4 text-primary font-medium">{s.designation}</td>
                      <td className="p-4 text-muted-foreground">{s.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link href="/">
            <Button variant="outline" size="lg">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { CheckCircle, Download, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function RegistrationSuccessPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ regId?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  if (!resolvedSearchParams.regId) notFound();

  const registration = await prisma.registration.findUnique({
    where: { id: resolvedSearchParams.regId },
    include: { event: true, user: true }
  });

  if (!registration || registration.event.slug !== resolvedParams.slug) notFound();

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border">
        <div className="bg-green-600 p-8 text-center text-white">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-black">Registration Confirmed!</h1>
          <p className="mt-2 text-green-100 font-medium">Your spot is secured for {registration.event.title}.</p>
        </div>
        
        <div className="p-8 space-y-6 text-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Your Unique ID</p>
            <p className="text-3xl font-mono font-black text-primary bg-muted/30 py-4 rounded-xl border border-dashed border-primary/40 shadow-inner">
              {registration.registrationNo}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Please save this ID. You can use it to track your registration or download your pass later.
            </p>
          </div>

          <div className="pt-6 space-y-3">
            <Link href={`/pass/${registration.id}`} target="_blank">
              <Button className="w-full h-14 text-lg font-bold shadow-lg bg-blue-600 hover:bg-blue-700">
                <Download className="w-5 h-5 mr-2" /> Download Registration PDF
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full h-12 text-muted-foreground border-2">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Link href="/find-registration" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          <Search className="w-4 h-4" /> Lost your pass? Find it here.
        </Link>
      </div>
    </div>
  );
}

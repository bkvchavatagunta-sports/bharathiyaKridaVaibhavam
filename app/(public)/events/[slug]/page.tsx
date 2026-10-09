import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, Users, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function EventDetails({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const event = await prisma.event.findUnique({ where: { slug: resolvedParams.slug } });
  
  if (!event) {
    notFound();
  }

  const isFinished = event.status === "COMPLETED" || event.status === "CANCELLED";
  const registrationDisabled = isFinished || event.status === "REGISTRATION_CLOSED";

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className={`relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl mb-8 ${isFinished ? 'opacity-70 grayscale' : ''}`}>
        <Image 
          src={event.bannerImage} 
          alt={event.title} 
          fill 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-8 text-white w-full flex justify-between items-end">
            <div>
              <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-full mb-3 shadow-sm">
                {event.sportType.join(", ")}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2">{event.title}</h1>
              {event.dedicationName && (
                <p className="text-xl font-medium text-gray-200">{event.dedicationName}</p>
              )}
            </div>
            {isFinished && (
              <div className="bg-black/60 px-6 py-2 rounded-lg border border-white/20">
                 <p className="font-black text-2xl tracking-widest text-red-400">{event.status}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">About The Event</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </section>

          {event.rules && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Rules & Guidelines</h2>
              <div className="bg-muted/10 p-6 rounded-xl border">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {event.rules}
                </p>
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold mb-4">Categories & Formats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-xl border">
                 <p className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">Age Groups</p>
                 <div className="flex flex-wrap gap-2">
                   {event.ageGroups && event.ageGroups.length > 0 ? (
                     event.ageGroups.map((g: string) => <span key={g} className="bg-white px-2 py-1 rounded shadow-sm text-sm font-bold">{g}</span>)
                   ) : <span className="bg-white px-2 py-1 rounded shadow-sm text-sm font-bold">Open Category</span>}
                 </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl border">
                 <p className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">Sub-Events</p>
                 <div className="flex flex-wrap gap-2">
                   {event.subCategories && event.subCategories.length > 0 ? (
                     event.subCategories.map((c: string) => <span key={c} className="bg-white px-2 py-1 rounded shadow-sm text-sm font-bold">{c}</span>)
                   ) : <span className="bg-white px-2 py-1 rounded shadow-sm text-sm font-bold">{event.sportType.join(", ")} Default</span>}
                 </div>
              </div>
            </div>
          </section>

        </div>

        <div className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-xl border space-y-6">
            <h3 className="font-bold text-xl border-b pb-4">Event Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">{format(event.startDate, 'dd/MM/yyyy')} to {format(event.endDate, 'dd/MM/yyyy')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Venue</p>
                  <p className="text-sm text-muted-foreground">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Entry Fee</p>
                  <p className="text-sm font-bold text-green-600">{event.entryFee > 0 ? `₹${event.entryFee}` : 'Free Entry'}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              {registrationDisabled ? (
                 <Button size="lg" className="w-full font-bold text-lg" disabled variant="secondary">
                   {event.status === "REGISTRATION_CLOSED" ? "Registration Closed" : "Event Ended"}
                 </Button>
              ) : (
                <Link href={`/events/${event.slug}/register`}>
                  <Button size="lg" className="w-full font-bold text-lg shadow-lg">
                    Register Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, Users, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EventDetails({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let event = await prisma.event.findUnique({ where: { slug: resolvedParams.slug } });
  
  if (!event) {
    event = {
      id: "mock-1",
      title: "Annual Village Marathon 2026",
      slug: "village-marathon-2026",
      dedicationName: "Late Sri XYZ Memorial Cup",
      sportType: "Marathon",
      description: "Join the biggest marathon of the year organized by BHARATIYA KRIDA VAIBHAVAM. This event is dedicated to bringing out the hidden running talent from our villages.",
      bannerImage: "https://picsum.photos/seed/marathon/1920/1080",
      venue: "Zilla Parishad Ground, District XYZ",
      startDate: new Date("2026-12-15"),
      endDate: new Date("2026-12-15"),
      entryFee: 250,
      status: "UPCOMING",
      createdAt: new Date(),
    } as any;
    if (resolvedParams.slug !== "village-marathon-2026") {
      notFound();
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl mb-8">
        <Image 
          src={event.bannerImage} 
          alt={event.title} 
          fill 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-8 text-white">
            <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-full mb-3">
              {event.sportType}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2">{event.title}</h1>
            {event.dedicationName && (
              <p className="text-xl font-medium text-gray-200">{event.dedicationName}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">About The Event</h2>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Rules & Guidelines</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>Participants must bring a valid age-proof ID on the day of the event.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>Chest numbers will be distributed 1 hour before the start time.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>Umpire/Referee decisions will be final and binding.</span>
              </li>
            </ul>
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
                  <p className="text-sm text-muted-foreground">{event.startDate.toLocaleDateString()}</p>
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
                  <p className="text-sm text-muted-foreground">₹{event.entryFee}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Link href={`/events/${event.slug}/register`}>
                <Button size="lg" className="w-full font-bold text-lg">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

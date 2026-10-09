import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function EventsPage() {
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  const events = await prisma.event.findMany({ 
    where: { 
      OR: [
        { status: "UPCOMING" },
        { status: "ONGOING" },
        { 
          status: { in: ["COMPLETED", "CANCELLED"] },
          endDate: { gte: fiveDaysAgo }
        }
      ]
    },
    orderBy: { startDate: 'asc' }
  });

  return (
    <div className="container mx-auto px-4 py-12 min-h-[70vh]">
      <div className="space-y-4 mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Events Board</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Browse and register for the latest sports meets organized by BHARATIYA KRIDA VAIBHAVAM across the rural circuits.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center p-12 bg-muted/20 rounded-xl border">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold">No Events</h2>
          <p className="text-muted-foreground mt-2">Check back later for new tournaments and meets.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isFinished = event.status === "COMPLETED" || event.status === "CANCELLED";
            
            return (
              <Card key={event.id} className={`overflow-hidden group flex flex-col border-0 shadow-xl transition-all duration-300 ${isFinished ? 'opacity-60 grayscale' : 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:-translate-y-2'}`}>
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  {event.bannerImage && (
                    <Image 
                      src={event.bannerImage} 
                      alt={event.title} 
                      fill 
                      className={`object-cover transition-transform ${!isFinished ? 'group-hover:scale-105' : ''}`} 
                    />
                  )}
                  {isFinished && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                      <h3 className="text-white font-black text-2xl tracking-widest uppercase">{event.status}</h3>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-white/95 text-black hover:bg-white border-0 shadow-sm font-bold px-3 py-1">
                      {event.sportType.join(", ")}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 z-20">
                    <Badge variant={event.status === "UPCOMING" ? "default" : "secondary"} className="shadow-sm font-bold">
                      {event.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    {event.dedicationName && (
                      <CardDescription className="text-primary font-medium">{event.dedicationName}</CardDescription>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(event.startDate, 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.venue}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t">
                  <div className="w-full flex items-center justify-between">
                    <span className="font-bold text-lg">
                      {event.entryFee > 0 ? `₹${event.entryFee}` : 'Free Entry'}
                    </span>
                    {isFinished ? (
                      <Button disabled variant="secondary">Registration Closed</Button>
                    ) : (
                      <Link href={`/events/${event.slug}`}>
                        <Button>View Details</Button>
                      </Link>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

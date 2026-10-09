import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, MapPin, ChevronRight, Users, Medal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GalleryCarousel } from "@/components/GalleryCarousel";
import { BackgroundCarousel } from "@/components/BackgroundCarousel";
import Image from "next/image";
import prisma from "@/lib/db";
import { format } from "date-fns";

export default async function Home() {
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  const featuredEvents = await prisma.event.findMany({
    where: {
      OR: [
        { status: "UPCOMING" },
        { endDate: { gte: fiveDaysAgo } }
      ]
    },
    orderBy: [
      { status: 'desc' },
      { startDate: 'asc' }
    ],
    take: 3
  });

  const dbImages = await prisma.galleryImage.findMany({
    orderBy: { uploadedAt: 'desc' },
    take: 10
  });
  const imageUrls = dbImages.map(img => img.imageUrl);

  const totalRegistrations = await prisma.registration.count();
  const displayAthletes = 1500 + totalRegistrations;
  const totalEvents = await prisma.event.count();
  const displayEvents = 3 + totalEvents;

  const dbHeroImages = await prisma.heroImage.findMany({
    orderBy: { uploadedAt: 'desc' }
  });
  // Default to static if none uploaded yet
  const heroImageUrls = dbHeroImages.length > 0 
    ? dbHeroImages.map(img => img.imageUrl) 
    : ['/hero-bg.jpg'];

  const topSponsors = await prisma.sponsor.findMany({
    where: { isVisible: true },
    orderBy: { amount: 'desc' },
    take: 5
  });

  return (
    <div className="flex flex-col gap-16 pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 flex items-center justify-center overflow-hidden">
        <BackgroundCarousel imageUrls={heroImageUrls} opacity={100} interval={5000} />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />
        
        <div className="container relative z-20 mx-auto px-4 text-center space-y-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold tracking-wider">SPORTS FOR UNITY</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
            BHARATIYA KRIDA <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">VAIBHAVAM</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 font-medium">
            Join the biggest rural sports revolution. Founded by national medalists, for the next generation of champions.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            <Link href="/events">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 h-auto bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-[pulse_3s_ease-in-out_infinite]">
                Explore Upcoming Events
              </Button>
            </Link>
            <Link href="/find-registration">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 py-6 h-auto hover:scale-105 transition-transform duration-300 shadow-xl">
                Download Your Pass
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-black">Nurturing Grassroots Talent Since 2021</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We started as a small committee of passionate athletes. Today, BHARATIYA KRIDA VAIBHAVAM a local hosts over {displayAthletes}+ rural athletes from around Andhra Pradesh across {displayEvents} disciplines. And we are looking forward with big success.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t">
              <div className="text-center space-y-2">
                <Trophy className="w-8 h-8 mx-auto text-yellow-500" />
                <h4 className="font-bold text-2xl">{displayEvents}</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Events</p>
              </div>
              <div className="text-center space-y-2">
                <Users className="w-8 h-8 mx-auto text-blue-500" />
                <h4 className="font-bold text-2xl">{displayAthletes}+</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Athletes</p>
              </div>
              <div className="text-center space-y-2">
                <Medal className="w-8 h-8 mx-auto text-green-500" />
                <h4 className="font-bold text-2xl">60+</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Awards</p>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            {imageUrls.length > 0 ? (
              <BackgroundCarousel imageUrls={imageUrls} opacity={100} interval={4000} />
            ) : (
              <Image 
                src="/grassroots-real.jpg" 
                alt="BHARATIYA KRIDA VAIBHAVAM Team" 
                fill 
                className="object-cover" 
              />
            )}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="bg-muted/30 py-16 border-y">
        <div className="container mx-auto px-4 space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Featured Events</h2>
              <p className="text-muted-foreground">Register now for our upcoming meets and tournaments.</p>
            </div>
            <Link href="/events" className="hidden md:flex items-center text-primary font-medium hover:underline">
              View all events <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {featuredEvents.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl border">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold">No Upcoming Events</h2>
              <p className="text-muted-foreground mt-2">Our next season is being planned. Stay tuned!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => {
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
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          {event.dedicationName && (
                            <CardDescription className="text-primary font-medium">{event.dedicationName}</CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                      <div className="flex items-center text-sm text-muted-foreground gap-2 bg-muted/50 p-2 rounded-md">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{format(event.startDate, 'dd/MM/yyyy')}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground gap-2 bg-muted/50 p-2 rounded-md">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span className="font-medium">{event.venue}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t bg-muted/10">
                      <div className="w-full flex items-center justify-between">
                        <span className="font-bold text-lg">
                          {event.entryFee > 0 ? `₹${event.entryFee}` : 'Free Entry'}
                        </span>
                        {isFinished ? (
                          <Button disabled variant="secondary" className="shadow-sm">Registration Closed</Button>
                        ) : (
                          <Link href={`/events/${event.slug}`}>
                            <Button className="font-bold shadow-md">Register Now</Button>
                          </Link>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
          
          <div className="md:hidden flex justify-center mt-6">
            <Link href="/events">
              <Button variant="outline" className="w-full">View all events</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Carousel */}
      <GalleryCarousel images={imageUrls} />

      {/* Sponsors Section */}
      <section className="container mx-auto px-4 text-center space-y-10 border-t pt-16">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Supported By Our Patrons</h2>
          <p className="text-muted-foreground text-lg">Thank you to the community and local businesses who make this possible.</p>
        </div>
        
        {topSponsors.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-16 items-center">
            {topSponsors.map(sponsor => (
              <div key={sponsor.id} className="flex flex-col items-center gap-2">
                <div className="text-2xl font-black">{sponsor.name}</div>
                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {sponsor.designation} (₹{sponsor.amount.toLocaleString()})
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No sponsors listed yet.</p>
        )}

        <div className="pt-4">
          <Link href="/sponsors">
            <Button variant="link" className="text-primary font-bold">View all sponsors & patrons →</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

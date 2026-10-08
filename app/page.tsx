import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Medal, Trophy, ChevronRight } from "lucide-react";
import Image from "next/image";
import { GalleryCarousel } from "@/components/GalleryCarousel";
import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  const featuredEvents = await prisma.event.findMany({ 
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
    orderBy: { startDate: 'asc' },
    take: 3
  });

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://picsum.photos/seed/hero/1920/1080"
            alt="Athletics Track"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container px-4 mx-auto text-center text-white space-y-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Championing Rural Talent
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 font-medium">
            Join the biggest rural sports revolution. Founded by national medalists, for the next generation of champions.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            <Link href="/events">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 h-auto bg-primary text-primary-foreground hover:bg-primary/90">
                Explore Upcoming Events
              </Button>
            </Link>
            <Link href="/find-registration">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 py-6 h-auto">
                Download Your Pass
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Foundation Story */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Our Roots, Our Vision</h2>
            <div className="w-20 h-2 bg-yellow-500 rounded-full"></div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We started from dust tracks and muddy fields. Now, a collective of national medalists in Athletics, Hockey, Swimming, and Archery have united to bring world-class event management to rural talent.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is simple: discover, celebrate, and elevate athletes from villages who have the fire but lack the platform.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center space-y-2">
                <Trophy className="w-8 h-8 mx-auto text-yellow-500" />
                <h4 className="font-bold text-2xl">50+</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Events</p>
              </div>
              <div className="text-center space-y-2">
                <Users className="w-8 h-8 mx-auto text-blue-500" />
                <h4 className="font-bold text-2xl">10k+</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Athletes</p>
              </div>
              <div className="text-center space-y-2">
                <Medal className="w-8 h-8 mx-auto text-green-500" />
                <h4 className="font-bold text-2xl">200+</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Medalists</p>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="https://picsum.photos/seed/team/800/600" 
              alt="BHARATIYA KRIDA VAIBHAVAM Team" 
              fill 
              className="object-cover" 
            />
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
                  <Card key={event.id} className={`overflow-hidden group flex flex-col border-0 shadow-lg ${isFinished ? 'opacity-60 grayscale' : ''}`}>
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
                          {event.sportType}
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
                        <span className="font-medium">{event.startDate.toLocaleDateString()}</span>
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
      <GalleryCarousel />

      {/* Sponsors Section */}
      <section className="container mx-auto px-4 text-center space-y-10 border-t pt-16">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Supported By Our Patrons</h2>
          <p className="text-muted-foreground text-lg">Thank you to the community and local businesses who make this possible.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-16 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl font-black italic">XYZ Sports Gear</div>
            <span className="text-sm font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">Gold Sponsor (₹50k)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl font-bold uppercase tracking-widest text-primary">Village Agro Bank</div>
            <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Title Sponsor (₹1L)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl font-serif">Sharma & Sons Mills</div>
            <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Associate Sponsor (₹25k)</span>
          </div>
        </div>
      </section>
    </div>
  );
}

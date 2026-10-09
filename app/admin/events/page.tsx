import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreVertical, MapPin, Calendar, Edit, Trash2, XCircle, CheckCircle } from "lucide-react";
import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteEvent, updateEventStatus } from "@/app/actions/event";
import { format } from "date-fns";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="p-8 space-y-8 bg-muted/10 min-h-full">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-muted">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">Manage Events</h1>
          <p className="text-muted-foreground mt-1 font-medium">Create and oversee your premium sporting events.</p>
        </div>
        <Link href="/admin/events/new">
          <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground">
            <PlusCircle className="w-5 h-5 mr-2" />
            Create New Event
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl shadow-sm border border-dashed border-2">
          <Calendar className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-bold">No Events Found</h2>
          <p className="text-muted-foreground mt-2 mb-6">You haven't created any events yet. Click the button above to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => {
            const isFinished = event.status === "COMPLETED" || event.status === "CANCELLED";
            
            return (
              <Card key={event.id} className={`overflow-hidden border-0 shadow-lg transition-all duration-300 group bg-white ${isFinished ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100' : 'hover:shadow-xl'}`}>
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  {event.bannerImage && (
                    <Image 
                      src={event.bannerImage} 
                      alt={event.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/95 text-black hover:bg-white border-0 shadow-sm font-bold px-3 py-1">
                      {event.sportType.join(", ")}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant={
                      event.status === "COMPLETED" ? "default" : 
                      event.status === "CANCELLED" ? "destructive" : 
                      event.status === "ONGOING" ? "secondary" : "default"
                    } className={`shadow-sm font-bold ${event.status === 'UPCOMING' ? 'bg-blue-600' : event.status === 'ONGOING' ? 'bg-yellow-500 text-black' : ''}`}>
                      {event.status}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold line-clamp-1">{event.title}</h3>
                    <p className="text-primary font-semibold text-sm mt-1">
                      {event.entryFee > 0 ? `₹${event.entryFee} Entry Fee` : 'Free Entry'}
                    </p>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                      <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                      <span className="font-medium">{format(event.startDate, 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                      <MapPin className="w-4 h-4 mr-3 text-red-500" />
                      <span className="font-medium line-clamp-1">{event.venue}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex justify-between border-t mt-4 bg-muted/10 items-center h-16">
                  <Link href={`/events/${event.slug}`}>
                    <Button variant="ghost" size="sm" className="font-semibold hover:bg-white hover:shadow-sm">View Public Page</Button>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center p-2 rounded-full hover:bg-white hover:shadow-sm text-muted-foreground transition-colors focus-visible:outline-none">
                      <MoreVertical className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" /> Edit Event
                        </DropdownMenuItem>
                      </Link>
                      
                      {event.status !== "COMPLETED" && (
                        <form action={async () => {
                          "use server";
                          await updateEventStatus(event.id, "COMPLETED");
                        }}>
                          <button type="submit" className="w-full text-left">
                            <DropdownMenuItem className="cursor-pointer text-green-600">
                              <CheckCircle className="w-4 h-4 mr-2" /> Mark as Completed
                            </DropdownMenuItem>
                          </button>
                        </form>
                      )}
                      
                      {event.status === "COMPLETED" && (
                        <form action={async () => {
                          "use server";
                          await updateEventStatus(event.id, "UPCOMING");
                        }}>
                          <button type="submit" className="w-full text-left">
                            <DropdownMenuItem className="cursor-pointer text-primary">
                              <CheckCircle className="w-4 h-4 mr-2" /> Undo Complete
                            </DropdownMenuItem>
                          </button>
                        </form>
                      )}
                      
                      {event.status !== "CANCELLED" && (
                        <form action={async () => {
                          "use server";
                          await updateEventStatus(event.id, "CANCELLED");
                        }}>
                          <button type="submit" className="w-full text-left">
                            <DropdownMenuItem className="cursor-pointer text-orange-600">
                              <XCircle className="w-4 h-4 mr-2" /> Mark as Cancelled
                            </DropdownMenuItem>
                          </button>
                        </form>
                      )}

                      {event.status !== "REGISTRATION_CLOSED" && event.status !== "COMPLETED" && event.status !== "CANCELLED" && (
                        <form action={async () => {
                          "use server";
                          await updateEventStatus(event.id, "REGISTRATION_CLOSED");
                        }}>
                          <button type="submit" className="w-full text-left">
                            <DropdownMenuItem className="cursor-pointer text-blue-600">
                              <XCircle className="w-4 h-4 mr-2" /> Close Registration
                            </DropdownMenuItem>
                          </button>
                        </form>
                      )}

                      {event.status === "REGISTRATION_CLOSED" && (
                        <form action={async () => {
                          "use server";
                          await updateEventStatus(event.id, "UPCOMING");
                        }}>
                          <button type="submit" className="w-full text-left">
                            <DropdownMenuItem className="cursor-pointer text-primary">
                              <CheckCircle className="w-4 h-4 mr-2" /> Open Registration
                            </DropdownMenuItem>
                          </button>
                        </form>
                      )}

                      {event.status === "CANCELLED" && (
                        <form action={async () => {
                          "use server";
                          await updateEventStatus(event.id, "UPCOMING");
                        }}>
                          <button type="submit" className="w-full text-left">
                            <DropdownMenuItem className="cursor-pointer text-primary">
                              <XCircle className="w-4 h-4 mr-2" /> Undo Cancelled
                            </DropdownMenuItem>
                          </button>
                        </form>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <form action={async () => {
                        "use server";
                        await deleteEvent(event.id);
                      }}>
                        <button type="submit" className="w-full">
                          <DropdownMenuItem className="cursor-pointer text-red-600 font-medium">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Event
                          </DropdownMenuItem>
                        </button>
                      </form>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

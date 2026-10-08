import { ArrowLeft, CheckCircle2, UploadCloud } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateEvent } from "@/app/actions/event";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const event = await prisma.event.findUnique({ where: { id: resolvedParams.id } });
  
  if (!event) notFound();

  // Format dates for input type="date"
  const startStr = event.startDate.toISOString().split("T")[0];
  const endStr = event.endDate.toISOString().split("T")[0];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 bg-white min-h-screen">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black text-primary">Edit Event: {event.title}</h1>
          <p className="text-muted-foreground mt-1">Update details for this sporting event.</p>
        </div>
      </div>

      <form action={updateEvent} className="space-y-8">
        <input type="hidden" name="id" value={event.id} />
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-bold">Event Title *</Label>
            <Input id="title" name="title" defaultValue={event.title} required className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dedicationName" className="font-bold">Dedication / Memorial Name</Label>
            <Input id="dedicationName" name="dedicationName" defaultValue={event.dedicationName || ""} className="h-12" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sportType" className="font-bold">Sport Type *</Label>
            <select id="sportType" name="sportType" defaultValue={event.sportType} required className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="Athletics">Athletics</option>
              <option value="Marathon">Marathon</option>
              <option value="Hockey">Hockey</option>
              <option value="Football">Football</option>
              <option value="Kabaddi">Kabaddi</option>
              <option value="Volleyball">Volleyball</option>
              <option value="Swimming">Swimming</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="entryFee" className="font-bold">Entry Fee (₹) *</Label>
            <Input id="entryFee" name="entryFee" type="number" defaultValue={event.entryFee} required className="h-12" min="0" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="font-bold">Start Date *</Label>
            <Input id="startDate" name="startDate" type="date" defaultValue={startStr} required className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="font-bold">End Date *</Label>
            <Input id="endDate" name="endDate" type="date" defaultValue={endStr} required className="h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue" className="font-bold">Venue Details *</Label>
          <Input id="venue" name="venue" defaultValue={event.venue} required className="h-12" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-bold">Event Description & Rules *</Label>
          <Textarea id="description" name="description" defaultValue={event.description} required className="min-h-[120px]" />
        </div>

        <input type="hidden" name="bannerImage" value={event.bannerImage} />
        <div className="space-y-2 opacity-70">
          <Label className="font-bold">Event Banner Image (Read-only in basic edit)</Label>
          <div className="border border-dashed rounded-xl p-4 bg-muted/20">
             <img src={event.bannerImage} alt="Banner" className="w-full h-32 object-cover rounded-md" />
             <p className="text-xs mt-2 text-muted-foreground text-center">To replace banner, recreate the event or use the advanced editor.</p>
          </div>
        </div>

        <div className="pt-8 border-t">
          <Button type="submit" className="w-full h-14 text-xl font-bold shadow-lg hover:shadow-xl bg-green-600 hover:bg-green-700">
            Update Event Details
          </Button>
        </div>
      </form>
    </div>
  );
}

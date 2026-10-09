import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CalendarCheck, IndianRupee, Trophy, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { GalleryUploader } from "@/components/GalleryUploader";

export default async function AdminDashboard() {
  const activeEventsCount = await prisma.event.count({
    where: { status: "UPCOMING" }
  });

  const allRegistrations = await prisma.registration.findMany({
    include: { event: true, user: true }
  });

  const participantsCount = allRegistrations.length;

  const feesCollected = allRegistrations
    .filter(r => r.paymentStatus === "VERIFIED" || (r.paymentStatus === "PENDING" && !r.paymentProofUrl)) // Assuming venue cash collected
    .reduce((sum, r) => sum + (r.finalFee || 0), 0);

  // We haven't built the sponsorships model yet, so we will show a placeholder block.
  
  return (
    <div className="p-8 space-y-8 bg-muted/10 min-h-full">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-muted">
        <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">Committee Dashboard</h1>
        <p className="text-muted-foreground mt-1 font-medium">Overview of your events, registrations, and media gallery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 rounded-t-xl">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Active Events</CardTitle>
            <CalendarCheck className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black">{activeEventsCount}</div>
            <p className="text-xs font-semibold text-muted-foreground mt-1">Currently Upcoming</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 rounded-t-xl">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Participants</CardTitle>
            <Users className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black">{participantsCount}</div>
            <p className="text-xs font-semibold text-muted-foreground mt-1">Total Registrations</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 rounded-t-xl">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Fees Processing</CardTitle>
            <IndianRupee className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black">₹{feesCollected}</div>
            <p className="text-xs font-semibold text-muted-foreground mt-1">Verified / Pending Venue Cash</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md opacity-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 rounded-t-xl">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Sponsorships</CardTitle>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black">Coming Soon</div>
            <p className="text-xs font-semibold text-muted-foreground mt-1">Sponsor management module</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Recent Registrations Table (Replacing Mock Sponsors) */}
        <Card className="md:col-span-2 border-0 shadow-md">
          <CardHeader className="border-b bg-muted/10 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Registrations</CardTitle>
              <CardDescription>Latest athletes who signed up.</CardDescription>
            </div>
            <Info className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No recent registrations.</TableCell>
                  </TableRow>
                ) : allRegistrations.slice(0, 5).map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-bold">{reg.isTeamRegistration ? reg.teamName : reg.user.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{reg.event.title}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{reg.registeredAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">{reg.paymentStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Photos Management Widget */}
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b bg-muted/10">
            <CardTitle>Event Gallery</CardTitle>
            <CardDescription>Manage your public photos.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-lg text-gray-800">Upload & Manage</p>
              <p className="text-sm text-muted-foreground">Keep the landing page updated.</p>
            </div>
            <a href="/admin/gallery" className="w-full">
              <Button className="w-full font-bold">Go to Photos</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

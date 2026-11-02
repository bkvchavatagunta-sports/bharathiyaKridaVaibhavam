import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CalendarCheck, IndianRupee, Trophy, Info, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const activeEventsCount = await prisma.event.count({
    where: { status: { in: ["UPCOMING", "ONGOING"] } }
  });

  const allRegistrations = await prisma.registration.findMany({
    include: { event: true, user: true },
    orderBy: { registeredAt: 'desc' }
  });

  const participantsCount = allRegistrations.length;

  const verifiedFees = allRegistrations
    .filter(r => r.paymentStatus === "VERIFIED")
    .reduce((sum, r) => sum + (r.finalFee || 0), 0);

  const pendingFees = allRegistrations
    .filter(r => r.paymentStatus === "PENDING")
    .reduce((sum, r) => sum + (r.finalFee || 0), 0);

  const totalFees = verifiedFees + pendingFees;

  const sponsors = await prisma.sponsor.findMany();
  const totalSponsorships = sponsors.reduce((sum, s) => sum + (s.amount || 0), 0);

  return (
    <div className="p-8 space-y-8 bg-muted/10 min-h-full">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-muted flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">Committee Dashboard</h1>
          <p className="text-muted-foreground mt-1 font-medium">Live overview of your events, registrations, fees, and patrons.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/events" className="block transition-transform hover:-translate-y-1">
          <Card className="border-0 shadow-md h-full cursor-pointer hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 rounded-t-xl">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Active Events</CardTitle>
              <CalendarCheck className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black">{activeEventsCount}</div>
              <p className="text-xs font-semibold text-muted-foreground mt-1">Upcoming & Ongoing</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/registrations" className="block transition-transform hover:-translate-y-1">
          <Card className="border-0 shadow-md h-full cursor-pointer hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 rounded-t-xl">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Participants</CardTitle>
              <Users className="w-5 h-5 text-orange-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black">{participantsCount}</div>
              <p className="text-xs font-semibold text-muted-foreground mt-1">Total Registrations</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/registrations" className="block transition-transform hover:-translate-y-1">
          <Card className="border-0 shadow-md h-full cursor-pointer hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 rounded-t-xl">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Fees Processing</CardTitle>
              <IndianRupee className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black">₹{totalFees.toLocaleString('en-IN')}</div>
              <p className="text-xs font-semibold text-muted-foreground mt-1">
                {verifiedFees > 0 ? `₹${verifiedFees.toLocaleString('en-IN')} Verified • ₹${pendingFees.toLocaleString('en-IN')} Pending` : `${pendingFees > 0 ? `₹${pendingFees.toLocaleString('en-IN')} Pending Approval` : 'All accounts settled'}`}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/sponsors" className="block transition-transform hover:-translate-y-1">
          <Card className="border-0 shadow-md h-full cursor-pointer hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 rounded-t-xl">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Sponsorships</CardTitle>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-black">₹{totalSponsorships.toLocaleString('en-IN')}</div>
              <p className="text-xs font-semibold text-muted-foreground mt-1">{sponsors.length} Patrons Supporting</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Recent Registrations Table */}
        <Card className="md:col-span-2 border-0 shadow-md">
          <CardHeader className="border-b bg-muted/10 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Registrations</CardTitle>
              <CardDescription>Latest athletes who signed up.</CardDescription>
            </div>
            <Link href="/admin/registrations" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View All ({participantsCount}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
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
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      <p className="font-semibold text-base">No registrations found yet.</p>
                      <p className="text-xs mt-1">Registrations will appear dynamically here as users sign up.</p>
                    </TableCell>
                  </TableRow>
                ) : allRegistrations.slice(0, 5).map((reg) => {
                  const displayName = reg.isTeamRegistration && reg.teamName
                    ? `Team: ${reg.teamName}`
                    : reg.user?.name || "Participant";

                  return (
                    <TableRow key={reg.id} className="hover:bg-muted/10">
                      <TableCell className="font-bold">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{displayName}</p>
                          {reg.isTeamRegistration && reg.user?.name && (
                            <p className="text-xs text-muted-foreground font-normal">Capt: {reg.user.name}</p>
                          )}
                          <p className="text-[11px] font-mono text-muted-foreground">{reg.registrationNo}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        <p className="font-medium text-slate-800">{reg.event?.title || "Event"}</p>
                        <p className="text-xs text-muted-foreground">{reg.sportSubCategory || "General"}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm font-medium">
                        {format(new Date(reg.registeredAt), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          reg.paymentStatus === "VERIFIED" ? "bg-green-100 text-green-800 border-green-200" :
                          reg.paymentStatus === "REJECTED" ? "bg-red-100 text-red-800 border-red-200" :
                          reg.paymentStatus === "FREE" ? "bg-blue-100 text-blue-800 border-blue-200" :
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }`}>
                          {reg.paymentStatus}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
            <Link href="/admin/gallery" className="w-full">
              <Button className="w-full font-bold">Go to Photos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

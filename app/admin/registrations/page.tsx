import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { verifyPayment } from "@/app/actions/registration";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default async function RegistrationsPage() {
  const registrations = await prisma.registration.findMany({
    include: { event: true, user: true },
    orderBy: { registeredAt: 'desc' }
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Participant Registrations</h1>
        <p className="text-muted-foreground mt-1">Review registrations and verify UPI payments.</p>
      </div>

      <div className="border rounded-md bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Registration ID</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Event & Category</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No registrations found yet.
                </TableCell>
              </TableRow>
            ) : registrations.map((reg) => {
               // The payment mode is technically inferred: if paymentProofUrl exists, it was UPI. Else VENUE.
               const isUPI = !!reg.paymentProofUrl;
               
               return (
                <TableRow key={reg.id}>
                  <TableCell className="font-mono text-sm font-bold">{reg.registrationNo}</TableCell>
                  <TableCell className="font-medium">
                    {reg.isTeamRegistration ? reg.teamName : reg.user.name}
                    {reg.isTeamRegistration && <span className="block text-xs text-muted-foreground">Capt: {reg.captainName}</span>}
                  </TableCell>
                  <TableCell>{reg.user.phone}</TableCell>
                  <TableCell>
                    <span className="block font-bold">{reg.event.title}</span>
                    <span className="text-xs text-muted-foreground">{reg.sportSubCategory} ({reg.age} Yrs)</span>
                  </TableCell>
                  <TableCell>
                    {isUPI ? 'UPI / Online' : 'Pay at Venue'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={reg.paymentStatus === "VERIFIED" || reg.paymentStatus === "FREE" ? "default" : "secondary"} 
                      className={reg.paymentStatus === "PENDING" && isUPI ? "border-yellow-500 text-yellow-700 bg-yellow-50" : reg.paymentStatus === "PENDING" ? "text-gray-600 bg-gray-100" : "bg-green-100 text-green-700"}
                    >
                      {reg.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {reg.paymentStatus === "PENDING" && isUPI ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Verify Screenshot</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Verify Payment Proof</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm font-medium">Please verify the UPI payment screenshot below for {reg.isTeamRegistration ? reg.teamName : reg.user.name} (Fee: ₹{reg.finalFee}).</p>
                            <img src={reg.paymentProofUrl!} alt="UPI Proof" className="w-full rounded-md border" />
                            <form action={async () => {
                               "use server";
                               await verifyPayment(reg.id);
                            }}>
                               <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 font-bold">Approve & Verify Payment</Button>
                            </form>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : reg.paymentStatus === "PENDING" && !isUPI ? (
                       <form action={async () => {
                           "use server";
                           await verifyPayment(reg.id);
                        }}>
                           <Button size="sm" type="submit" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">Mark Paid at Venue</Button>
                       </form>
                    ) : (
                      <span className="text-sm font-bold text-green-600">Verified ✓</span>
                    )}
                  </TableCell>
                </TableRow>
               )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

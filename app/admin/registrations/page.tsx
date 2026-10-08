import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RegistrationsPage() {
  const mockRegistrations = [
    {
      id: "reg-1",
      name: "Ramesh Kumar",
      phone: "+91 9876543210",
      event: "Annual Village Marathon 2026",
      category: "5K Open",
      paymentMode: "UPI",
      status: "PENDING_VERIFICATION",
    },
    {
      id: "reg-2",
      name: "Suresh Singh",
      phone: "+91 8765432109",
      event: "Annual Village Marathon 2026",
      category: "10K Men",
      paymentMode: "VENUE",
      status: "PENDING",
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Participant Registrations</h1>
        <p className="text-muted-foreground mt-1">Review registrations and verify UPI payments.</p>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRegistrations.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell className="font-medium">{reg.name}</TableCell>
                <TableCell>{reg.phone}</TableCell>
                <TableCell>{reg.event}</TableCell>
                <TableCell>{reg.category}</TableCell>
                <TableCell>{reg.paymentMode}</TableCell>
                <TableCell>
                  <Badge variant={reg.status === "PENDING_VERIFICATION" ? "outline" : "secondary"} className={reg.status === "PENDING_VERIFICATION" ? "border-yellow-500 text-yellow-600" : ""}>
                    {reg.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {reg.status === "PENDING_VERIFICATION" ? (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">Verify UPI</Button>
                  ) : (
                    <Button size="sm" variant="outline">View</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

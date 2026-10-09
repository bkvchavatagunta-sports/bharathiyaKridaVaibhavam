"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { deleteSponsor, toggleSponsorVisibility } from "@/app/actions/sponsor";

export function SponsorsListAdmin({ sponsors }: { sponsors: any[] }) {
  if (sponsors.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-muted text-center text-muted-foreground">
        No sponsors added yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-muted overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sponsors.map(sponsor => (
            <TableRow key={sponsor.id}>
              <TableCell className="font-bold">{sponsor.name}</TableCell>
              <TableCell>{sponsor.location}</TableCell>
              <TableCell>{sponsor.designation}</TableCell>
              <TableCell className="font-bold text-green-600">₹{sponsor.amount.toLocaleString()}</TableCell>
              <TableCell>
                {sponsor.isVisible ? (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer" onClick={() => toggleSponsorVisibility(sponsor.id, false)}>
                    <Eye className="w-3 h-3 mr-1" /> Visible
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => toggleSponsorVisibility(sponsor.id, true)}>
                    <EyeOff className="w-3 h-3 mr-1" /> Hidden
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => {
                  if (confirm("Delete this sponsor?")) deleteSponsor(sponsor.id);
                }}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

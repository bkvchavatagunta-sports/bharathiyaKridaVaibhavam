"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CalendarCheck, IndianRupee, Trophy, UploadCloud, CheckCircle2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

export default function AdminDashboard() {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const mockSponsors = [
    { id: 1, name: "XYZ Sports Gear", tier: "Gold", amount: "₹50,000", date: "Oct 1, 2026" },
    { id: 2, name: "Village Agro Bank", tier: "Title", amount: "₹1,00,000", date: "Sep 28, 2026" },
    { id: 3, name: "Sharma & Sons Mills", tier: "Associate", amount: "₹25,000", date: "Oct 5, 2026" },
  ];

  return (
    <div className="p-8 space-y-8 bg-muted/10 min-h-full">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-muted">
        <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">Committee Dashboard</h1>
        <p className="text-muted-foreground mt-1 font-medium">Overview of your events, sponsorships, and media gallery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 rounded-t-xl">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Active Events</CardTitle>
            <CalendarCheck className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black">3</div>
            <p className="text-xs font-semibold text-green-600 mt-1">+1 drafting</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 rounded-t-xl">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Participants</CardTitle>
            <Users className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black">1,248</div>
            <p className="text-xs font-semibold text-green-600 mt-1">+84 this week</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 rounded-t-xl">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Fees Collected</CardTitle>
            <IndianRupee className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black">₹1,12,500</div>
            <p className="text-xs font-semibold text-muted-foreground mt-1">Verified UPI Payments</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20 rounded-t-xl">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase">Sponsorships</CardTitle>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black">₹1,75,000</div>
            <p className="text-xs font-semibold text-muted-foreground mt-1">From 12 Sponsors</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sponsors Table */}
        <Card className="md:col-span-2 border-0 shadow-md">
          <CardHeader className="border-b bg-muted/10">
            <CardTitle>Recent Sponsors</CardTitle>
            <CardDescription>Contributions from the community.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sponsor Name</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSponsors.map((sponsor) => (
                  <TableRow key={sponsor.id}>
                    <TableCell className="font-bold">{sponsor.name}</TableCell>
                    <TableCell>
                      <Badge variant={sponsor.tier === 'Title' ? 'default' : 'secondary'} className={sponsor.tier === 'Title' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}>
                        {sponsor.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{sponsor.date}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">{sponsor.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Gallery Upload Widget */}
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b bg-muted/10">
            <CardTitle>Event Gallery Upload</CardTitle>
            <CardDescription>Upload photos for the landing page carousel.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-2">
              <UploadCloud className="w-10 h-10 text-primary" />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Images uploaded here will automatically appear in the public gallery carousel.
            </p>
            
            <CldUploadWidget 
              signatureEndpoint="/api/sign-image"
              onSuccess={(result: any) => {
                setUploadedPhotos([...uploadedPhotos, result?.info?.secure_url]);
              }}
            >
              {({ open }) => {
                return (
                  <Button size="lg" className="w-full font-bold shadow-md" onClick={() => open()}>
                    Upload Photos
                  </Button>
                );
              }}
            </CldUploadWidget>

            {uploadedPhotos.length > 0 && (
              <div className="w-full space-y-2 pt-4 border-t">
                <p className="font-semibold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {uploadedPhotos.length} Photo(s) Uploaded
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {uploadedPhotos.map((url, i) => (
                    <img key={i} src={url} alt="Upload preview" className="w-16 h-16 object-cover rounded-md border shadow-sm shrink-0" />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

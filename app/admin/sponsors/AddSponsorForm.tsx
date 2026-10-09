"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addSponsor } from "@/app/actions/sponsor";

export function AddSponsorForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      await addSponsor(formData);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-muted space-y-6">
      <h2 className="text-xl font-bold">Add New Patron</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name or Company *</Label>
          <Input id="name" name="name" required placeholder="e.g. Ramakrishna" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="designation">Designation *</Label>
          <Input id="designation" name="designation" required placeholder="e.g. Gold Sponsor, Local MLA" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">From (Location) *</Label>
          <Input id="location" name="location" required placeholder="e.g. Hyderabad" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount Sponsored (₹) *</Label>
          <Input id="amount" name="amount" type="number" required placeholder="e.g. 50000" min="0" />
        </div>
        <Button type="submit" disabled={loading} className="w-full font-bold">
          {loading ? "Adding..." : "Add Patron"}
        </Button>
      </form>
    </div>
  );
}

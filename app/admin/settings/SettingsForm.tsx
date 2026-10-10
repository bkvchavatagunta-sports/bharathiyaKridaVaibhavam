"use client";

import { useState } from "react";
import { updateSettings } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Save, CheckCircle2 } from "lucide-react";

export function SettingsForm({ settings }: { settings: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      await updateSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0 border-t-4 border-t-primary">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-bold">Contact Phone Number</Label>
              <Input id="phone" name="phone" defaultValue={settings.phone} required className="h-12" placeholder="+91 75696 04988" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">Contact Email Address</Label>
              <Input id="email" name="email" type="email" defaultValue={settings.email} required className="h-12" placeholder="bkv.chavatagunta@gmail.com" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="font-bold">Event Base Location Address</Label>
              <Input id="address" name="address" defaultValue={settings.address} required className="h-12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="latitude" className="font-bold">Latitude (For Google Maps)</Label>
              <Input id="latitude" name="latitude" defaultValue={settings.latitude} required className="h-12" placeholder="13.43995" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude" className="font-bold">Longitude (For Google Maps)</Label>
              <Input id="longitude" name="longitude" defaultValue={settings.longitude} required className="h-12" placeholder="79.31484" />
            </div>
          </div>

          <div className="pt-6 border-t flex items-center justify-between">
            {success ? (
              <span className="text-green-600 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Settings Saved!
              </span>
            ) : (
              <span className="text-muted-foreground text-sm">Updates instantly reflect across the public site.</span>
            )}
            <Button type="submit" disabled={loading} className="w-48 h-12 font-bold text-lg shadow-lg">
              {loading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Settings</>}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

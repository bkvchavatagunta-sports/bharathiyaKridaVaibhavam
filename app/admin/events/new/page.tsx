"use client";

import { useState } from "react";
import { Plus, X, UploadCloud, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CldUploadWidget } from "next-cloudinary";
import { createEvent } from "@/app/actions/event";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const router = useRouter();
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [subCategoryInput, setSubCategoryInput] = useState("");
  
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [ageGroupInput, setAgeGroupInput] = useState("");

  const [sportTypes, setSportTypes] = useState<string[]>([]);
  const [sportTypeInput, setSportTypeInput] = useState("");

  const [bannerUrl, setBannerUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddSubCategory = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (subCategoryInput.trim() && !subCategories.includes(subCategoryInput.trim())) {
      setSubCategories([...subCategories, subCategoryInput.trim()]);
    }
    setSubCategoryInput("");
  };

  const handleRemoveSubCategory = (category: string) => {
    setSubCategories(subCategories.filter(c => c !== category));
  };

  const handleAddAgeGroup = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (ageGroupInput.trim() && !ageGroups.includes(ageGroupInput.trim())) {
      setAgeGroups([...ageGroups, ageGroupInput.trim()]);
    }
    setAgeGroupInput("");
  };

  const handleRemoveAgeGroup = (group: string) => {
    setAgeGroups(ageGroups.filter(g => g !== group));
  };

  const handleAddSportType = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (sportTypeInput.trim() && !sportTypes.includes(sportTypeInput.trim())) {
      setSportTypes([...sportTypes, sportTypeInput.trim()]);
    }
    setSportTypeInput("");
  };

  const handleRemoveSportType = (sport: string) => {
    setSportTypes(sportTypes.filter(s => s !== sport));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bannerUrl) return alert("Please upload a banner image");
    if (sportTypes.length === 0) return alert("Please add at least one Sport Type");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("bannerImage", bannerUrl);
    formData.append("subCategories", JSON.stringify(subCategories));
    formData.append("ageGroups", JSON.stringify(ageGroups));
    formData.append("sportTypes", JSON.stringify(sportTypes));

    const res = await createEvent(formData);
    
    if (res.success) {
      router.push("/admin/events");
    } else {
      alert("Failed to create event");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 bg-white rounded-xl shadow-sm border mt-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-black">Publish New Event</h1>
          <p className="text-muted-foreground mt-1">Fill in the details to publish a new tournament or meet.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-bold">Event Title *</Label>
            <Input id="title" name="title" required placeholder="e.g. State Level Athletics Meet" className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dedicationName" className="font-bold">Dedication / Memorial Name</Label>
            <Input id="dedicationName" name="dedicationName" placeholder="e.g. Late Sri XYZ Memorial Cup" className="h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="entryFee" className="font-bold">Entry Fee (₹) *</Label>
          <Input id="entryFee" name="entryFee" type="number" required placeholder="250" className="h-12 w-full md:w-1/2" min="0" />
          <p className="text-xs text-muted-foreground">Enter 0 for free events.</p>
        </div>

        <div className="p-6 bg-muted/20 border rounded-xl space-y-8">
          <div className="space-y-4">
            <Label className="font-bold">Sport Types (e.g. Football, Athletics, Hockey) *</Label>
            <div className="flex gap-2">
              <Input 
                value={sportTypeInput} 
                onChange={(e) => setSportTypeInput(e.target.value)}
                placeholder="Type sport and click Add..." 
                className="h-12 bg-white"
                onKeyDown={(e) => {
                  if(e.key === 'Enter') { e.preventDefault(); handleAddSportType(e as any); }
                }}
              />
              <Button type="button" onClick={handleAddSportType} className="h-12 px-6">
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </div>
            {sportTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {sportTypes.map((sport, i) => (
                  <Badge key={i} variant="default" className="px-3 py-1.5 text-sm font-medium bg-blue-600">
                    {sport}
                    <X className="w-3 h-3 ml-2 cursor-pointer hover:text-red-300" onClick={() => handleRemoveSportType(sport)} />
                  </Badge>
                ))}
              </div>
            )}
            {sportTypes.length === 0 && <p className="text-sm text-red-500 italic">Please add at least one sport.</p>}
          </div>

          <div className="space-y-4 pt-4 border-t border-muted-foreground/20">
            <Label className="font-bold">Sub-Categories / Events (e.g. 100mts, 5K Open, Single Men)</Label>
            <div className="flex gap-2">
              <Input 
                value={subCategoryInput} 
                onChange={(e) => setSubCategoryInput(e.target.value)}
                placeholder="Type sub-category and click Add..." 
                className="h-12 bg-white"
                onKeyDown={(e) => {
                  if(e.key === 'Enter') { e.preventDefault(); handleAddSubCategory(e as any); }
                }}
              />
              <Button type="button" onClick={handleAddSubCategory} className="h-12 px-6">
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </div>
            {subCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {subCategories.map((cat, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                    {cat}
                    <X className="w-3 h-3 ml-2 cursor-pointer hover:text-red-500" onClick={() => handleRemoveSubCategory(cat)} />
                  </Badge>
                ))}
              </div>
            )}
            {subCategories.length === 0 && <p className="text-sm text-muted-foreground italic">No sub-categories added. If left empty, a single default category is assumed (e.g. Football).</p>}
          </div>

          <div className="space-y-4 pt-4 border-t border-muted-foreground/20">
            <Label className="font-bold">Age Groups Allowed (e.g. U-14, U-19, Open)</Label>
            <div className="flex gap-2">
              <Input 
                value={ageGroupInput} 
                onChange={(e) => setAgeGroupInput(e.target.value)}
                placeholder="Type age group and click Add..." 
                className="h-12 bg-white"
                onKeyDown={(e) => {
                  if(e.key === 'Enter') { e.preventDefault(); handleAddAgeGroup(e as any); }
                }}
              />
              <Button type="button" onClick={handleAddAgeGroup} className="h-12 px-6">
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </div>
            {ageGroups.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {ageGroups.map((group, i) => (
                  <Badge key={i} variant="outline" className="px-3 py-1.5 text-sm font-medium border-primary/50 text-primary">
                    {group}
                    <X className="w-3 h-3 ml-2 cursor-pointer hover:text-red-500" onClick={() => handleRemoveAgeGroup(group)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="font-bold">Start Date *</Label>
            <Input id="startDate" name="startDate" type="date" required className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="font-bold">End Date *</Label>
            <Input id="endDate" name="endDate" type="date" required className="h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue" className="font-bold">Venue Details *</Label>
          <Input id="venue" name="venue" required placeholder="e.g. Zilla Parishad Ground, District Name" className="h-12" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-bold">About the Event (Description) *</Label>
          <Textarea id="description" name="description" required placeholder="Provide full details and overview of the event..." className="min-h-[120px]" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rules" className="font-bold">Rules and Guidelines</Label>
          <Textarea id="rules" name="rules" placeholder="Enter specific rules, formatting guidelines, etc..." className="min-h-[120px]" />
        </div>

        <div className="space-y-2">
          <Label className="font-bold">Event Banner Image *</Label>
          <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-muted/20">
            {bannerUrl ? (
              <div className="w-full space-y-4">
                <img src={bannerUrl} alt="Banner Preview" className="w-full h-48 object-cover rounded-md shadow-sm" />
                <p className="text-sm font-bold text-green-600 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Banner Uploaded Successfully
                </p>
                <div className="flex justify-center">
                  <CldUploadWidget signatureEndpoint="/api/sign-image" onSuccess={(res: any) => setBannerUrl(res?.info?.secure_url)}>
                    {({ open }) => <Button type="button" variant="outline" size="sm" onClick={() => open()}>Replace Banner</Button>}
                  </CldUploadWidget>
                </div>
              </div>
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                <CldUploadWidget signatureEndpoint="/api/sign-image" onSuccess={(res: any) => setBannerUrl(res?.info?.secure_url)}>
                  {({ open }) => (
                    <Button type="button" onClick={() => open()} variant="secondary" className="font-bold">
                      Upload Banner Image
                    </Button>
                  )}
                </CldUploadWidget>
                <p className="text-sm text-muted-foreground mt-2">Recommended size: 1920x1080 (Landscape)</p>
              </>
            )}
          </div>
        </div>

        <div className="pt-8 border-t">
          <Button type="submit" disabled={loading || !bannerUrl} className="w-full h-14 text-xl font-bold shadow-lg hover:shadow-xl">
            {loading ? "Publishing Event..." : "Publish Event"}
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, UploadCloud, CheckCircle, MapPin, Plus, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CldUploadWidget } from "next-cloudinary";
import { submitRegistration } from "@/app/actions/registration";

export function RegistrationForm({ event }: { event: any }) {
  const router = useRouter();
  const [step, setStep] = useState<"FORM" | "PREVIEW">("FORM");
  const [loading, setLoading] = useState(false);
  
  // Base State
  const [paymentMode, setPaymentMode] = useState<"VENUE" | "UPI">("VENUE");
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [dob, setDob] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [location, setLocation] = useState("");
  const [locating, setLocating] = useState(false);
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState(event.sportType);
  const [ageGroup, setAgeGroup] = useState("Open");

  // Individual State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Team Registration State
  const isTeamSport = ["Football", "Hockey", "Kabaddi", "Volleyball"].includes(event.sportType);
  const minPlayers = event.sportType === "Kabaddi" ? 7 : event.sportType === "Volleyball" ? 6 : 11;
  const maxPlayers = event.sportType === "Kabaddi" ? 12 : event.sportType === "Volleyball" ? 12 : 15;
  const [playerNames, setPlayerNames] = useState<string[]>(Array(minPlayers).fill(""));
  const [teamName, setTeamName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [viceCaptainName, setViceCaptainName] = useState("");

  const maxDob = new Date().toISOString().split("T")[0];

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      const birthDate = new Date(val);
      const eventDate = new Date(event.startDate || Date.now());
      let calculatedAge = eventDate.getFullYear() - birthDate.getFullYear();
      const m = eventDate.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && eventDate.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  };

  const getCurrentLocation = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        setLocation(data.display_name || "Unknown Location");
        setLocating(false);
      }, () => {
        setLocating(false);
      });
    } else {
      setLocating(false);
    }
  };

  const handleAddPlayer = () => { if (playerNames.length < maxPlayers) setPlayerNames([...playerNames, ""]); };
  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > minPlayers) {
      const newPlayers = [...playerNames];
      newPlayers.splice(index, 1);
      setPlayerNames(newPlayers);
    }
  };
  const handlePlayerChange = (index: number, val: string) => {
    const newPlayers = [...playerNames];
    newPlayers[index] = val;
    setPlayerNames(newPlayers);
  };

  const handlePreviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (age !== null && age < 5) return alert("Participant must be at least 5 years old.");
    if (paymentMode === 'UPI' && !proofUrl) return alert("Please upload your UPI payment screenshot.");
    setStep("PREVIEW");
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    const data = {
      eventId: event.id,
      sportType: event.sportType,
      name: isTeamSport ? captainName : name,
      phone,
      location,
      age: age || 0,
      gender,
      sportSubCategory: category,
      isTeamRegistration: isTeamSport,
      teamName,
      captainName,
      viceCaptainName,
      coachName,
      playerNames,
      finalFee: event.entryFee,
      paymentMode,
      proofUrl
    };
    
    const res = await submitRegistration(data);
    if (res.success) {
      router.replace(`/events/${event.slug}/register/success?regId=${res.regId}`);
    }
  };

  if (step === "PREVIEW") {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <Card className="shadow-2xl border-0 relative overflow-hidden">
          <CardHeader className="bg-primary/5 border-b pb-8 rounded-t-xl">
            <CardTitle className="text-3xl font-black text-primary">Review Registration</CardTitle>
            <CardDescription className="text-base font-medium">Please verify your details before confirming.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-y-6 gap-x-12 bg-muted/10 p-6 rounded-xl border">
              <div><span className="block text-sm text-muted-foreground font-semibold">Event</span><span className="font-bold text-lg">{event.title}</span></div>
              <div><span className="block text-sm text-muted-foreground font-semibold">Sport Category</span><span className="font-bold text-lg">{category} ({ageGroup})</span></div>
              {!isTeamSport && (
                <>
                  <div><span className="block text-sm text-muted-foreground font-semibold">Full Name</span><span className="font-bold text-lg">{name}</span></div>
                  <div><span className="block text-sm text-muted-foreground font-semibold">Gender & Age</span><span className="font-bold text-lg">{gender}, {age} yrs</span></div>
                </>
              )}
              <div><span className="block text-sm text-muted-foreground font-semibold">Phone Number</span><span className="font-bold text-lg">{phone}</span></div>
              <div><span className="block text-sm text-muted-foreground font-semibold">Location</span><span className="font-bold text-lg">{location}</span></div>
            </div>

            {isTeamSport && (
              <div className="bg-muted/10 p-6 rounded-xl border space-y-4">
                <h3 className="font-bold text-xl text-primary border-b pb-2">Team Details</h3>
                <div className="grid md:grid-cols-2 gap-y-4">
                  <div><span className="block text-sm text-muted-foreground font-semibold">Team Name</span><span className="font-bold text-lg">{teamName}</span></div>
                  <div><span className="block text-sm text-muted-foreground font-semibold">Captain</span><span className="font-bold text-lg">{captainName}</span></div>
                  <div><span className="block text-sm text-muted-foreground font-semibold">Vice Captain</span><span className="font-bold text-lg">{viceCaptainName}</span></div>
                  {coachName && <div><span className="block text-sm text-muted-foreground font-semibold">Coach</span><span className="font-bold text-lg">{coachName}</span></div>}
                </div>
                <div className="pt-2">
                  <span className="block text-sm text-muted-foreground font-semibold mb-2">Squad List ({playerNames.length} Players)</span>
                  <div className="flex flex-wrap gap-2">
                    {playerNames.map((p, i) => <span key={i} className="bg-white border px-3 py-1 rounded-md text-sm font-bold shadow-sm">{i+1}. {p}</span>)}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-muted/10 p-6 rounded-xl border flex items-center justify-between">
              <div>
                <span className="block text-sm text-muted-foreground font-semibold">Payment Details</span>
                <span className="font-black text-2xl text-primary">₹{event.entryFee}</span>
                <span className="block text-sm font-bold mt-1">{paymentMode === 'UPI' ? 'Paid via UPI (Proof Attached)' : 'Will Pay at Venue (Cash)'}</span>
              </div>
              {proofUrl && <img src={proofUrl} alt="Proof" className="w-24 h-24 object-cover rounded-lg border shadow-sm" />}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" size="lg" className="w-1/3 text-lg h-14" onClick={() => setStep("FORM")}>
                <Edit2 className="w-5 h-5 mr-2" /> Edit Info
              </Button>
              <Button type="button" size="lg" className="w-2/3 text-lg h-14 font-black bg-green-600 hover:bg-green-700 shadow-xl" onClick={handleFinalSubmit} disabled={loading}>
                {loading ? "Processing..." : <><CheckCircle2 className="w-5 h-5 mr-2" /> Confirm & Register</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Card className="shadow-2xl border-0 relative overflow-hidden">
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10 rounded-full hover:bg-red-50 hover:text-red-600" onClick={() => router.back()}><X className="w-5 h-5" /></Button>
        <CardHeader className="bg-primary/5 border-b pb-8 rounded-t-xl pr-16">
          <CardTitle className="text-3xl font-black text-primary">Register for {event.title}</CardTitle>
          <CardDescription className="text-base font-medium">Fill out your details to secure your spot.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handlePreviewSubmit} className="space-y-8">
            
            {isTeamSport ? (
              <div className="space-y-6">
                <div className="bg-muted/30 p-4 rounded-xl border border-primary/20 space-y-4">
                  <h3 className="font-bold text-lg text-primary flex items-center gap-2">Team Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="font-bold">Team Name *</Label><Input required minLength={2} value={teamName} onChange={e=>setTeamName(e.target.value)} className="h-12 bg-white" /></div>
                    <div className="space-y-2"><Label className="font-bold">Coach Name (Optional)</Label><Input value={coachName} onChange={e=>setCoachName(e.target.value)} className="h-12 bg-white" /></div>
                    <div className="space-y-2"><Label className="font-bold">Captain Name *</Label><Input required minLength={2} value={captainName} onChange={e=>setCaptainName(e.target.value)} className="h-12 bg-white" /></div>
                    <div className="space-y-2"><Label className="font-bold">Vice Captain Name *</Label><Input required minLength={2} value={viceCaptainName} onChange={e=>setViceCaptainName(e.target.value)} className="h-12 bg-white" /></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold">Playing Squad (Min {minPlayers}, Max {maxPlayers}) *</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddPlayer} disabled={playerNames.length >= maxPlayers}><Plus className="w-4 h-4 mr-2" /> Add Player</Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {playerNames.map((pn, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input required minLength={2} placeholder={`Player ${i + 1}`} value={pn} onChange={(e) => handlePlayerChange(i, e.target.value)} />
                        {playerNames.length > minPlayers && <Button type="button" variant="ghost" size="icon" onClick={() => handleRemovePlayer(i)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label className="font-semibold">Full Name *</Label><Input required minLength={2} value={name} onChange={e=>setName(e.target.value)} className="h-12" /></div>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <Label className="font-semibold">Phone Number (Required for Tracking) *</Label>
                  <Input required pattern="^\+?[0-9]{10,15}$" value={phone} onChange={e=>setPhone(e.target.value)} type="tel" className="h-12" placeholder="e.g. 9876543210" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Village / City Location *</Label>
                  <div className="flex gap-2">
                    <Input required minLength={3} className="h-12 flex-1" value={location} onChange={(e) => setLocation(e.target.value)} />
                    <Button type="button" variant="outline" className="h-12 px-4" onClick={getCurrentLocation} disabled={locating}><MapPin className="w-5 h-5 text-primary" /></Button>
                  </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between"><Label className="font-semibold">Date of Birth *</Label>{age !== null && <span className="text-xs font-bold text-primary">{age} yrs</span>}</div>
                <Input required type="date" max={maxDob} value={dob} onChange={handleDobChange} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Gender *</Label>
                <select className="flex h-12 w-full rounded-md border bg-background px-3" required value={gender} onChange={e=>setGender(e.target.value)}>
                  <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-semibold">Sport Sub-Category *</Label>
                <select className="flex h-12 w-full rounded-md border bg-background px-3" required value={category} onChange={e=>setCategory(e.target.value)}>
                  {event.subCategories?.length > 0 ? (
                    <><option value="">Select Sub-Category</option>{event.subCategories.map((c: string) => <option key={c} value={c}>{c}</option>)}</>
                  ) : <option value={event.sportType}>{event.sportType}</option>}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Age Group *</Label>
                <select className="flex h-12 w-full rounded-md border bg-background px-3" required value={ageGroup} onChange={e=>setAgeGroup(e.target.value)}>
                  {event.ageGroups?.length > 0 ? (
                    <><option value="">Select Age Group</option>{event.ageGroups.map((g: string) => <option key={g} value={g}>{g}</option>)}</>
                  ) : <option value="Open">Open Category</option>}
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <h3 className="font-bold text-xl text-primary">Payment Details (Fee: ₹{event.entryFee})</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`border-2 rounded-xl p-5 cursor-pointer ${paymentMode === 'VENUE' ? 'border-primary bg-primary/5 shadow-md' : 'border-muted'}`} onClick={() => setPaymentMode('VENUE')}>
                  <p className="font-bold text-lg">Pay at Venue</p><p className="text-sm text-muted-foreground">Pay cash directly at the ground.</p>
                </div>
                <div className={`border-2 rounded-xl p-5 cursor-pointer ${paymentMode === 'UPI' ? 'border-primary bg-primary/5 shadow-md' : 'border-muted'}`} onClick={() => setPaymentMode('UPI')}>
                  <p className="font-bold text-lg">Pay Now (UPI)</p><p className="text-sm text-muted-foreground">Pay via UPI and upload proof.</p>
                </div>
              </div>
              {paymentMode === 'UPI' && (
                <div className="bg-muted/20 p-6 rounded-xl border-dashed border-2 text-center space-y-4 mt-4">
                  <p className="font-mono font-black text-xl text-primary">UPI ID: bkv@ybl</p>
                  <CldUploadWidget signatureEndpoint="/api/sign-image" onSuccess={(res: any) => setProofUrl(res?.info?.secure_url)}>
                    {({ open }) => <Button type="button" variant={proofUrl ? "default" : "outline"} onClick={() => open()}>{proofUrl ? 'Screenshot Uploaded!' : 'Upload Screenshot'}</Button>}
                  </CldUploadWidget>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full h-14 text-xl font-bold mt-8 shadow-lg">Preview Registration</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
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

  const [selectedSport, setSelectedSport] = useState(event.sportType?.[0] || "General");
  const [category, setCategory] = useState(event.subCategories?.[0] || "");
  const [ageGroup, setAgeGroup] = useState(event.ageGroups?.[0] || "Open");

  useEffect(() => {
    if (event.subCategories?.length === 0) setCategory(selectedSport);
  }, [selectedSport, event.subCategories]);

  // Individual State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Team Registration State
  const isTeamSport = ["Football", "Hockey", "Kabaddi", "Volleyball"].includes(selectedSport);
  const minPlayers = selectedSport === "Kabaddi" ? 7 : selectedSport === "Volleyball" ? 6 : 11;
  const maxPlayers = selectedSport === "Kabaddi" ? 12 : selectedSport === "Volleyball" ? 12 : 15;
  const [playerNames, setPlayerNames] = useState<string[]>(Array(minPlayers).fill(""));
  const [teamName, setTeamName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [viceCaptainName, setViceCaptainName] = useState("");

  const maxDob = new Date();
  maxDob.setFullYear(maxDob.getFullYear() - 5);
  const maxDobStr = maxDob.toISOString().split("T")[0];

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDob(e.target.value);
    const today = new Date();
    const birthDate = new Date(e.target.value);
    let a = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) a--;
    setAge(a);
  };

  const handleAddPlayer = () => { if (playerNames.length < maxPlayers) setPlayerNames([...playerNames, ""]); };
  const handleRemovePlayer = (index: number) => { if (playerNames.length > minPlayers) setPlayerNames(playerNames.filter((_, i) => i !== index)); };
  const handlePlayerChange = (index: number, value: string) => { const newP = [...playerNames]; newP[index] = value; setPlayerNames(newP); };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation is not supported by your browser");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
          const data = await res.json();
          setLocation(data.address.village || data.address.town || data.address.city || data.display_name.split(",")[0]);
        } catch(e) {}
        setLocating(false);
      },
      () => { alert("Failed to get location"); setLocating(false); }
    );
  };

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age !== null && age < 5) return alert("Participant must be at least 5 years old.");
    if (paymentMode === "UPI" && !proofUrl && event.entryFee > 0) return alert("Please upload UPI payment screenshot.");
    setStep("PREVIEW");
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    
    const data = {
      eventId: event.id,
      sportType: selectedSport,
      sportSubCategory: category,
      ageGroup: ageGroup,
      age: Number(age),
      gender,
      location,
      phone,
      finalFee: event.entryFee,
      paymentMode,
      proofUrl: paymentMode === "UPI" && proofUrl ? proofUrl : null,
      isTeamRegistration: isTeamSport,
      name: name,
      teamName: isTeamSport ? teamName : null,
      captainName: isTeamSport ? captainName : null,
      viceCaptainName: isTeamSport ? viceCaptainName : null,
      coachName: isTeamSport ? coachName : null,
      playerNames: isTeamSport ? playerNames.filter(n => n.trim() !== "") : []
    };

    const res = await submitRegistration(data);
    
    if (res.success && res.regId) {
      router.push(`/pass/${res.regId}`);
    } else {
      alert("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  if (step === "PREVIEW") {
    return (
      <Card className="shadow-2xl border-0 overflow-hidden max-w-3xl mx-auto border-t-8 border-t-primary">
        <div className="bg-muted p-6 flex justify-between items-center border-b">
          <div>
            <h2 className="text-2xl font-black text-primary">Preview Registration</h2>
            <p className="text-sm font-medium text-muted-foreground mt-1">Please verify all details before submitting.</p>
          </div>
          <Button variant="outline" onClick={() => setStep("FORM")}><Edit2 className="w-4 h-4 mr-2" /> Edit</Button>
        </div>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
            <div><p className="text-muted-foreground font-bold uppercase mb-1">Sport</p><p className="font-black text-lg">{selectedSport} - {category}</p></div>
            <div><p className="text-muted-foreground font-bold uppercase mb-1">Age Group</p><p className="font-black text-lg">{ageGroup}</p></div>
            <div><p className="text-muted-foreground font-bold uppercase mb-1">Phone</p><p className="font-black text-lg">{phone}</p></div>
            <div><p className="text-muted-foreground font-bold uppercase mb-1">Location</p><p className="font-bold">{location}</p></div>
            <div><p className="text-muted-foreground font-bold uppercase mb-1">Age / Gender</p><p className="font-bold">{age} yrs / {gender}</p></div>
            <div><p className="text-muted-foreground font-bold uppercase mb-1">Payment</p><p className="font-bold">{event.entryFee === 0 ? "Free Entry" : paymentMode === 'VENUE' ? "Pay at Venue" : "UPI Paid"}</p></div>
          </div>
          
          {isTeamSport ? (
            <div className="bg-muted/50 p-6 rounded-xl border">
              <h4 className="font-black text-lg mb-4 text-primary pb-2 border-b">Team: {teamName}</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <p><strong>Captain:</strong> {captainName}</p>
                <p><strong>Vice Capt:</strong> {viceCaptainName}</p>
                {coachName && <p className="col-span-2"><strong>Coach:</strong> {coachName}</p>}
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Squad ({playerNames.filter(n=>n.trim()).length} players)</p>
                <div className="flex flex-wrap gap-2 text-sm font-medium">
                  {playerNames.filter(n=>n.trim()).map((p,i) => <span key={i} className="bg-white px-3 py-1 rounded shadow-sm border">{p}</span>)}
                </div>
              </div>
            </div>
          ) : (
            <div><p className="text-muted-foreground font-bold uppercase mb-1">Participant Name</p><p className="font-black text-2xl">{name}</p></div>
          )}
          
          <Button onClick={handleFinalSubmit} disabled={loading} className="w-full h-14 text-xl font-bold shadow-xl">
            {loading ? "Submitting..." : <><CheckCircle className="w-5 h-5 mr-2" /> Confirm & Generate Pass</>}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <Card className="shadow-xl border-t-8 border-t-primary">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle className="text-3xl font-black text-primary">Register for {event.title}</CardTitle>
          <CardDescription className="text-base font-medium">Fill out your details to secure your spot.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handlePreviewSubmit} className="space-y-8">
            
            <div className="grid md:grid-cols-3 gap-6 mb-8 p-6 bg-muted/20 border rounded-xl">
              <div className="space-y-2">
                <Label className="font-semibold">Sport *</Label>
                <select className="flex h-12 w-full rounded-md border bg-background px-3" required value={selectedSport} onChange={e=>setSelectedSport(e.target.value)}>
                  {event.sportType?.map((s: string) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Sub-Category / Event *</Label>
                <select className="flex h-12 w-full rounded-md border bg-background px-3" required value={category} onChange={e=>setCategory(e.target.value)}>
                  {event.subCategories?.length > 0 ? (
                    <><option value="">Select Sub-Category</option>{event.subCategories.map((c: string) => <option key={c} value={c}>{c}</option>)}</>
                  ) : <option value={selectedSport}>{selectedSport}</option>}
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

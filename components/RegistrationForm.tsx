"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  UploadCloud, 
  CheckCircle, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CldUploadWidget } from "next-cloudinary";
import { submitRegistration } from "@/app/actions/registration";
import { RegistrationTour } from "@/components/RegistrationTour";

export function RegistrationForm({ event, upiId = "bkv@ybl" }: { event: any; upiId?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<"FORM" | "PREVIEW">("FORM");
  const [loading, setLoading] = useState(false);
  
  // Guided Tour & Assistant State
  const [tourOpen, setTourOpen] = useState(false);
  const [activeError, setActiveError] = useState<string | null>(null);

  // Check URL query for auto-starting tour e.g. /events/[slug]/register?tour=true
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tour") === "true") {
        setTourOpen(true);
      }
    }
  }, []);

  // Base State
  const [paymentMode, setPaymentMode] = useState<"VENUE" | "UPI">("UPI");
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
  const minPlayers = selectedSport === "Kabaddi" ? 7 : selectedSport === "Volleyball" ? 6 : 5;
  const maxPlayers = selectedSport === "Kabaddi" ? 12 : selectedSport === "Volleyball" ? 12 : 18;
  const [playerNames, setPlayerNames] = useState<string[]>(Array(minPlayers).fill(""));
  const [teamName, setTeamName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [viceCaptainName, setViceCaptainName] = useState("");

  useEffect(() => {
    if (playerNames.length < minPlayers) {
      setPlayerNames(prev => [...prev, ...Array(minPlayers - prev.length).fill("")]);
    }
  }, [minPlayers]);

  // Progress Checklist Calculation (Option 3)
  const isStep1Done = Boolean(selectedSport && category && ageGroup);
  const filledSquadCount = playerNames.filter(n => n.trim().length >= 2).length;
  const isStep2Done = isTeamSport 
    ? Boolean(teamName.trim().length >= 2 && captainName.trim().length >= 2 && filledSquadCount >= minPlayers)
    : Boolean(name.trim().length >= 2);
  const isStep3Done = Boolean(phone.trim().length >= 10 && location.trim().length >= 3 && dob && gender);
  const isStep4Done = event.entryFee === 0 || Boolean(proofUrl);
  const completedStepsCount = (isStep1Done ? 1 : 0) + (isStep2Done ? 1 : 0) + (isStep3Done ? 1 : 0) + (isStep4Done ? 1 : 0);

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
    if (activeError) setActiveError(null);
  };

  const handleAddPlayer = () => { if (playerNames.length < maxPlayers) setPlayerNames([...playerNames, ""]); };
  const handleRemovePlayer = (index: number) => { if (playerNames.length > minPlayers) setPlayerNames(playerNames.filter((_, i) => i !== index)); };
  const handlePlayerChange = (index: number, value: string) => { 
    const newP = [...playerNames]; 
    newP[index] = value; 
    setPlayerNames(newP);
    if (activeError) setActiveError(null);
  };

  const scrollToElement = (id: string) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-4", "ring-primary", "transition-all");
        setTimeout(() => {
          el.classList.remove("ring-4", "ring-primary");
        }, 2500);
      }
    }, 80);
  };

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
    setActiveError(null);

    // Smart Validation with smooth scroll & visual pulse (Option 3)
    if (isTeamSport) {
      if (!teamName.trim()) {
        setActiveError("Please enter your Team Name to proceed.");
        scrollToElement("tour-team-details");
        return;
      }
      if (!captainName.trim()) {
        setActiveError("Please enter the Captain Name.");
        scrollToElement("tour-team-details");
        return;
      }
      if (filledSquadCount < minPlayers) {
        setActiveError(`Playing squad requires at least ${minPlayers} player names (currently ${filledSquadCount} filled).`);
        scrollToElement("tour-team-details");
        return;
      }
    } else {
      if (!name.trim()) {
        setActiveError("Please enter Participant Full Name.");
        scrollToElement("tour-participant-details");
        return;
      }
    }

    if (!phone.trim() || !/^\+?[0-9]{10,15}$/.test(phone)) {
      setActiveError("Please enter a valid 10-digit mobile number for registration tracking.");
      scrollToElement("tour-contact-location");
      return;
    }

    if (!location.trim()) {
      setActiveError("Please enter your Village or City location (or tap 📍 to auto-fill).");
      scrollToElement("tour-contact-location");
      return;
    }

    if (!dob) {
      setActiveError("Please select Date of Birth.");
      scrollToElement("tour-dob-gender");
      return;
    }

    if (age !== null && age < 5) {
      setActiveError("Participant must be at least 5 years old.");
      scrollToElement("tour-dob-gender");
      return;
    }

    if (!gender) {
      setActiveError("Please select Gender.");
      scrollToElement("tour-dob-gender");
      return;
    }

    if (paymentMode === "UPI" && !proofUrl && event.entryFee > 0) {
      setActiveError("Please upload your UPI payment screenshot to complete registration.");
      scrollToElement("tour-payment");
      return;
    }

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
      if (typeof window !== "undefined") {
        try {
          const identifiedName = isTeamSport ? (captainName || teamName) : name;
          if (identifiedName) localStorage.setItem("bkv_user_name", identifiedName);
          if (location) localStorage.setItem("bkv_user_location", location);
        } catch (e) {}
      }
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
                {viceCaptainName ? <p><strong>Vice Capt:</strong> {viceCaptainName}</p> : <p className="text-muted-foreground"><strong>Vice Capt:</strong> <i>None</i></p>}
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
      {/* Interactive Walkthrough Tour (Option 1) */}
      <RegistrationTour
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
        isTeamSport={isTeamSport}
        minPlayers={minPlayers}
      />

      <Card className="shadow-xl border-t-8 border-t-primary overflow-hidden">
        <CardHeader className="bg-muted/20 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-black text-primary">Register for {event.title}</CardTitle>
            <CardDescription className="text-sm sm:text-base font-medium">Fill out your details to secure your spot.</CardDescription>
          </div>
          {/* Quick Demo Tour Launch Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setTourOpen(true)}
            className="self-start sm:self-auto bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 font-bold flex items-center gap-2 shadow-sm text-xs sm:text-sm h-10 px-4"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>How to Register? (Demo Tour)</span>
          </Button>
        </CardHeader>

        {/* In-Form Smart Assistance & Progress Checklist (Option 3) */}
        <div className="bg-slate-50 border-b p-4 px-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-primary" /> Registration Progress
            </span>
            <span className="text-xs font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
              {completedStepsCount} of 4 Completed
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold transition-all ${isStep1Done ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs' : 'bg-white text-muted-foreground'}`}>
              {isStep1Done ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground shrink-0 flex items-center justify-center text-[10px]">1</div>}
              <span className="truncate">Category</span>
            </div>
            <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold transition-all ${isStep2Done ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs' : 'bg-white text-muted-foreground'}`}>
              {isStep2Done ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground shrink-0 flex items-center justify-center text-[10px]">2</div>}
              <span className="truncate">{isTeamSport ? "Squad Roster" : "Athlete Info"}</span>
            </div>
            <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold transition-all ${isStep3Done ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs' : 'bg-white text-muted-foreground'}`}>
              {isStep3Done ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground shrink-0 flex items-center justify-center text-[10px]">3</div>}
              <span className="truncate">Contact & Village</span>
            </div>
            <div className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold transition-all ${isStep4Done ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs' : 'bg-white text-muted-foreground'}`}>
              {isStep4Done ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground shrink-0 flex items-center justify-center text-[10px]">4</div>}
              <span className="truncate">UPI Payment</span>
            </div>
          </div>
        </div>

        <CardContent className="pt-8">
          <form onSubmit={handlePreviewSubmit} className="space-y-8">
            
            {/* Step 1: Sport & Category */}
            <div id="tour-sport-category" className="grid md:grid-cols-3 gap-6 mb-8 p-6 bg-muted/20 border rounded-xl transition-all">
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
            
            {/* Step 2: Team Roster or Individual Athlete */}
            {isTeamSport ? (
              <div id="tour-team-details" className="space-y-6 transition-all">
                <div className="bg-muted/30 p-4 rounded-xl border border-primary/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-primary flex items-center gap-2">Team Details</h3>
                    <span className="text-xs text-muted-foreground font-semibold">Vice Captain is optional</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="font-bold">Team Name *</Label><Input required minLength={2} value={teamName} onChange={e=>{setTeamName(e.target.value); if(activeError) setActiveError(null);}} className="h-12 bg-white" placeholder="e.g. Bullet Youth FC" /></div>
                    <div className="space-y-2"><Label className="font-bold">Coach Name (Optional)</Label><Input value={coachName} onChange={e=>setCoachName(e.target.value)} className="h-12 bg-white" placeholder="Optional" /></div>
                    <div className="space-y-2"><Label className="font-bold">Captain Name *</Label><Input required minLength={2} value={captainName} onChange={e=>{setCaptainName(e.target.value); if(activeError) setActiveError(null);}} className="h-12 bg-white" placeholder="Captain Full Name" /></div>
                    <div className="space-y-2"><Label className="font-bold">Vice Captain Name (Optional)</Label><Input value={viceCaptainName} onChange={e=>setViceCaptainName(e.target.value)} placeholder="Optional" className="h-12 bg-white" /></div>
                  </div>
                </div>

                <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="font-bold">Playing Squad (Min {minPlayers}, Max {maxPlayers}) *</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Enter at least {minPlayers} player names. ({filledSquadCount}/{minPlayers} filled)
                      </p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddPlayer} disabled={playerNames.length >= maxPlayers}><Plus className="w-4 h-4 mr-2" /> Add Player</Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {playerNames.map((pn, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input 
                          required={i < minPlayers} 
                          minLength={i < minPlayers ? 2 : undefined} 
                          placeholder={`Player ${i + 1}${i < minPlayers ? " *" : " (Optional)"}`} 
                          value={pn} 
                          onChange={(e) => handlePlayerChange(i, e.target.value)} 
                          className="bg-white"
                        />
                        {playerNames.length > minPlayers && <Button type="button" variant="ghost" size="icon" onClick={() => handleRemovePlayer(i)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div id="tour-participant-details" className="grid md:grid-cols-2 gap-6 transition-all">
                <div className="space-y-2"><Label className="font-semibold">Full Name *</Label><Input required minLength={2} value={name} onChange={e=>{setName(e.target.value); if(activeError) setActiveError(null);}} className="h-12" placeholder="Athlete Full Name" /></div>
              </div>
            )}
            
            {/* Step 3: Contact & Location */}
            <div id="tour-contact-location" className="grid md:grid-cols-2 gap-6 transition-all">
               <div className="space-y-2">
                  <Label className="font-semibold">Phone Number (Required for Tracking) *</Label>
                  <Input required pattern="^\+?[0-9]{10,15}$" value={phone} onChange={e=>{setPhone(e.target.value); if(activeError) setActiveError(null);}} type="tel" className="h-12" placeholder="e.g. 9876543210" />
                  <p className="text-[11px] text-muted-foreground">Used to find registrations and send match schedule alerts.</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold flex items-center justify-between">
                    <span>Village / City Location *</span>
                    <span className="text-[11px] text-primary font-normal">Tap 📍 to auto-fill</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input required minLength={3} className="h-12 flex-1" value={location} onChange={(e) => {setLocation(e.target.value); if(activeError) setActiveError(null);}} placeholder="e.g. Chavatagunta" />
                    <Button type="button" variant="outline" className="h-12 px-4" onClick={getCurrentLocation} disabled={locating} title="Auto-detect Village Location"><MapPin className="w-5 h-5 text-primary" /></Button>
                  </div>
                </div>
            </div>

            {/* DOB & Gender */}
            <div id="tour-dob-gender" className="grid md:grid-cols-2 gap-6 transition-all">
              <div className="space-y-2">
                <div className="flex justify-between"><Label className="font-semibold">Date of Birth *</Label>{age !== null && <span className="text-xs font-bold text-primary">{age} yrs</span>}</div>
                <Input required type="date" max={maxDobStr} value={dob} onChange={handleDobChange} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Gender *</Label>
                <select className="flex h-12 w-full rounded-md border bg-background px-3" required value={gender} onChange={e=>{setGender(e.target.value); if(activeError) setActiveError(null);}}>
                  <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Step 4: UPI Payment Details */}
            <div id="tour-payment" className="space-y-4 pt-6 border-t transition-all">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl text-primary">Payment Details (Fee: ₹{event.entryFee})</h3>
                <span className="text-xs font-semibold text-muted-foreground">UPI Payment Required</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div 
                  className="border-2 rounded-xl p-5 opacity-50 bg-muted/20 border-muted/80 cursor-not-allowed relative select-none"
                  title="Pay at Venue is currently disabled"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-lg text-muted-foreground line-through">Pay at Venue</p>
                    <span className="text-[11px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full border">Disabled</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Cash at venue is disabled. Please pay via UPI.</p>
                </div>
                <div 
                  className={`border-2 rounded-xl p-5 cursor-pointer relative transition-all duration-300 ease-out transform hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/15 hover:border-primary active:scale-[0.99] ${
                    paymentMode === 'UPI' ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' : 'border-muted hover:bg-muted/10'
                  }`} 
                  onClick={() => setPaymentMode('UPI')}
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-lg text-primary flex items-center gap-2">
                      Pay Now (UPI)
                    </p>
                    <span className="text-[11px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20 animate-pulse">
                      Recommended
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Instant verification via UPI payment screenshot.</p>
                </div>
              </div>
              {paymentMode === 'UPI' && (
                <div className="bg-muted/20 p-6 rounded-xl border-dashed border-2 text-center space-y-4 mt-4">
                  <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-lg border shadow-sm">
                    <p className="font-mono font-black text-xl text-primary">UPI ID: {upiId}</p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(upiId);
                        alert(`UPI ID "${upiId}" copied to clipboard!`);
                      }}
                      className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded font-bold hover:bg-primary/20 transition-colors"
                      title="Copy UPI ID"
                    >
                      Copy
                    </button>
                  </div>
                  <div>
                    <CldUploadWidget signatureEndpoint="/api/sign-image" onSuccess={(res: any) => { setProofUrl(res?.info?.secure_url); if(activeError) setActiveError(null); }}>
                      {({ open }) => (
                        <Button 
                          type="button" 
                          variant={proofUrl ? "default" : "outline"} 
                          onClick={() => open()}
                          className={`font-bold ${proofUrl ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                        >
                          {proofUrl ? (
                            <><CheckCircle2 className="w-4 h-4 mr-2" /> Screenshot Uploaded!</>
                          ) : (
                            <><UploadCloud className="w-4 h-4 mr-2" /> Upload Payment Screenshot</>
                          )}
                        </Button>
                      )}
                    </CldUploadWidget>
                  </div>
                  <p className="text-xs text-muted-foreground">Attach transaction screenshot for instant match verification.</p>
                </div>
              )}
            </div>

            {/* Smart Click-to-Complete Error Assistant Alert (Option 3) */}
            {activeError && (
              <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-900 font-bold flex items-center gap-3 shadow-md animate-bounce">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="text-sm">{activeError}</span>
              </div>
            )}

            {/* Step 5: Submit Preview Button */}
            <div id="tour-submit-btn" className="pt-2">
              <Button type="submit" className="w-full h-14 text-xl font-bold shadow-lg hover:shadow-xl transition-all">
                Preview Registration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

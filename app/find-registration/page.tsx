"use client";

import { useState } from "react";
import { Search, FileSearch, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { findRegistration } from "@/app/actions/registration";
import { useRouter } from "next/navigation";

export default function FindRegistrationPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"ID" | "DETAILS">("ID");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const query = mode === "ID" 
      ? { regNo: (formData.get("regNo") as string).trim().toUpperCase() }
      : { phone: (formData.get("phone") as string).trim(), name: (formData.get("name") as string).trim() };

    const reg = await findRegistration(query);
    
    if (reg) {
      router.push(`/pass/${reg.id}`);
    } else {
      setError("We couldn't find a registration matching those details. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden">
        <div className="bg-primary p-6 text-white text-center">
          <FileSearch className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <CardTitle className="text-2xl font-black">Find Your Pass</CardTitle>
          <CardDescription className="text-primary-foreground/80 mt-1">
            Look up your registration to download the PDF pass.
          </CardDescription>
        </div>
        
        <CardContent className="p-8">
          <div className="flex bg-muted/50 rounded-lg p-1 mb-8">
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'ID' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
              onClick={() => setMode("ID")}
            >
              Unique ID
            </button>
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'DETAILS' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
              onClick={() => setMode("DETAILS")}
            >
              Personal Details
            </button>
          </div>

          <form onSubmit={handleLookup} className="space-y-6">
            {mode === "ID" ? (
              <div className="space-y-2">
                <Label className="font-bold text-gray-700">Registration Unique ID</Label>
                <Input name="regNo" required placeholder="e.g. BKV00AT01234" className="h-14 text-lg font-mono tracking-widest text-center uppercase" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="font-bold text-gray-700">Phone Number Used</Label>
                  <Input name="phone" required type="tel" placeholder="e.g. 9876543210" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-gray-700">Participant / Captain Name</Label>
                  <Input name="name" required placeholder="Enter name exactly as registered" className="h-12" />
                </div>
              </>
            )}

            {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-md">{error}</p>}

            <Button type="submit" className="w-full h-14 text-lg font-bold shadow-lg" disabled={loading}>
              {loading ? "Searching..." : <><Search className="w-5 h-5 mr-2" /> Find My Pass</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

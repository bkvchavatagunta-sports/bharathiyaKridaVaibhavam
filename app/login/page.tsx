"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, X } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden relative">
        <Button 
          type="button"
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 z-10 rounded-full text-white hover:bg-white/20 hover:text-white"
          onClick={() => router.push('/')}
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="bg-primary p-6 text-white text-center pt-8">
          <Lock className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <CardTitle className="text-2xl font-black">Committee Login</CardTitle>
          <CardDescription className="text-primary-foreground/80 mt-1">
            Sign in to access the administration dashboard.
          </CardDescription>
        </div>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter committee email" 
                required
                className="h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required
                className="h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded-md">{error}</p>}
            
            <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

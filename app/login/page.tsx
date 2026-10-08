import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-2 text-center pb-8 border-b bg-primary/5 rounded-t-xl">
          <CardTitle className="text-3xl font-black text-primary">Committee Login</CardTitle>
          <CardDescription className="text-base font-medium">Authentication is currently being set up.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@bkv.com" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" disabled />
          </div>
          <Button className="w-full h-12 text-lg font-bold" disabled>Sign In</Button>
        </CardContent>
      </Card>
    </div>
  );
}

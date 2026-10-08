import { Trophy } from "lucide-react";

export default function HallOfFame() {
  return (
    <div className="container mx-auto px-4 py-24 text-center min-h-[70vh] flex flex-col items-center justify-center">
      <Trophy className="w-24 h-24 text-yellow-500 mb-6 mx-auto" />
      <h1 className="text-5xl font-black mb-4">Hall of Fame</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        We are building a digital archive of our greatest rural champions. 
        Biographies and medalist records are coming soon!
      </p>
    </div>
  );
}

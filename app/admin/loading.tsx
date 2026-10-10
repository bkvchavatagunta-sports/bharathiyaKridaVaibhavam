import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 bg-muted/10">
      <div className="p-8 bg-white rounded-full shadow-sm border border-muted animate-pulse">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
      <p className="font-bold text-muted-foreground text-lg animate-pulse">Loading dashboard data...</p>
    </div>
  );
}

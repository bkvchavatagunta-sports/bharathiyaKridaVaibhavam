import Link from "next/link";
import { LayoutDashboard, Calendar, Users, Settings } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6 border-b">
          <h2 className="font-bold text-xl text-primary">BKV Admin</h2>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 bg-muted rounded-md text-foreground font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/events" className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-md text-muted-foreground font-medium transition-colors">
            <Calendar className="w-5 h-5" /> Manage Events
          </Link>
          <Link href="/admin/registrations" className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-md text-muted-foreground font-medium transition-colors">
            <Users className="w-5 h-5" /> Registrations
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

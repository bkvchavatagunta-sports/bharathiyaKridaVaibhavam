"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Users, Trophy } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="p-6 border-b">
        <h2 className="font-bold text-xl text-primary">BKV Admin</h2>
      </div>
      <nav className="p-4 space-y-2">
        <Link 
          href="/admin" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${isActive('/admin') ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted/50'}`}
        >
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </Link>
        <Link 
          href="/admin/events" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${isActive('/admin/events') ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted/50'}`}
        >
          <Calendar className="w-5 h-5" /> Manage Events
        </Link>
        <Link 
          href="/admin/registrations" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${isActive('/admin/registrations') ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted/50'}`}
        >
          <Users className="w-5 h-5" /> Registrations
        </Link>
        <Link 
          href="/admin/gallery" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${isActive('/admin/gallery') ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted/50'}`}
        >
          <Trophy className="w-5 h-5" /> Photos
        </Link>
        <div className="pt-8 mt-8 border-t border-dashed">
           <SignOutButton />
        </div>
      </nav>
    </aside>
  );
}

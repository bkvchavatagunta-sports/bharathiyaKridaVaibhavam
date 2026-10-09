"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  const handleSignOut = async () => {
    // 1. Sign out without letting NextAuth auto-reload the page
    // (If it auto-reloads while we are on /admin, the middleware instantly kicks us to /login)
    await signOut({ redirect: false });
    
    // 2. Hard redirect the browser to the public homepage
    window.location.href = "/";
  };

  return (
    <button 
      onClick={handleSignOut}
      className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 hover:text-red-600 rounded-md text-muted-foreground font-medium transition-colors w-full text-left mt-8"
    >
      <LogOut className="w-5 h-5" /> Sign Out
    </button>
  );
}

"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 hover:text-red-600 rounded-md text-muted-foreground font-medium transition-colors w-full text-left mt-8"
    >
      <LogOut className="w-5 h-5" /> Sign Out
    </button>
  );
}

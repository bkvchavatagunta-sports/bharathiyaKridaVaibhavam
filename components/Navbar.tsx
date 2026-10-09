"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="print:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="hidden sm:inline">BHARATIYA KRIDA VAIBHAVAM</span>
            <span className="sm:hidden">BKV</span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Home
          </Link>
          <Link href="/events" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Events
          </Link>
          <Link href="/gallery" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Gallery
          </Link>
          <div className="flex items-center gap-4 ml-4">
            <Link href="/login" className="transition-colors hover:text-foreground/80 text-foreground/60 font-semibold">
              Login
            </Link>
            <Link href="/events">
              <Button>Register</Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <Button 
          variant="ghost" 
          className="md:hidden" 
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur absolute top-16 left-0 w-full shadow-lg">
          <nav className="flex flex-col p-4 space-y-4 text-center font-bold">
            <Link href="/" onClick={() => setMobileOpen(false)} className="py-2 border-b">
              Home
            </Link>
            <Link href="/events" onClick={() => setMobileOpen(false)} className="py-2 border-b">
              Events
            </Link>
            <Link href="/gallery" onClick={() => setMobileOpen(false)} className="py-2 border-b">
              Gallery
            </Link>
            <Link href="/login" onClick={() => setMobileOpen(false)} className="py-2 border-b">
              Login
            </Link>
            <Link href="/events" onClick={() => setMobileOpen(false)} className="py-2">
              <Button className="w-full">Register</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <Trophy className="h-6 w-6 text-yellow-500" />
            BHARATIYA KRIDA VAIBHAVAM
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/events" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Events
          </Link>
          <Link href="/hall-of-fame" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Hall of Fame
          </Link>
          <Link href="/gallery" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Gallery
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/events">
              <Button>Register</Button>
            </Link>
          </div>
        </nav>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

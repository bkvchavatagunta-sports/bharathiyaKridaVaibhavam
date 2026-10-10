import prisma from "@/lib/db";
import Link from "next/link";

export async function Footer() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "global" } }) || {
    phone: "+91 75696 04988",
    email: "bkv.chavatagunta@gmail.com",
    latitude: "13.43995",
    longitude: "79.31484",
    address: "Chavatagunta, Vedurukuppam, Tirupati"
  };

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');

  return (
    <footer className="print:hidden border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="font-semibold">BHARATIYA KRIDA VAIBHAVAM</h3>
            <p className="text-sm text-muted-foreground">
              Empowering grassroots athletes and digitizing rural sports events founded by national medalists.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/events" className="hover:text-primary">Upcoming Events</Link></li>
              <li><Link href="/hall-of-fame" className="hover:text-primary">Hall of Fame</Link></li>
              <li><Link href="/gallery" className="hover:text-primary">Gallery</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground flex flex-col gap-2">
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">
                  📧 {settings.email}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  💬 {settings.phone}
                </a>
              </li>
              <li>
                <a href={`https://www.google.com/maps/search/?api=1&query=${settings.latitude},${settings.longitude}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors block leading-tight">
                  📍 {settings.address}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BHARATIYA KRIDA VAIBHAVAM. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

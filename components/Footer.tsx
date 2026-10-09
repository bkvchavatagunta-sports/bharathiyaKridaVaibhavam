export function Footer() {
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
              <li><a href="/events" className="hover:text-primary">Upcoming Events</a></li>
              <li><a href="/hall-of-fame" className="hover:text-primary">Hall of Fame</a></li>
              <li><a href="/gallery" className="hover:text-primary">Gallery</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/terms" className="hover:text-primary">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-primary">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>bkv.chavatagunta@gmail.com</li>
              <li>+91 75696 04988</li>
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

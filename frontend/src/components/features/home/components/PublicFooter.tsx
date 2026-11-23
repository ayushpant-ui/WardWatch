import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <ShieldCheck size={22} />
              </div>

              <h2 className="text-xl font-bold text-foreground">
                WardWatch
              </h2>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-7 text-muted">
              Connecting citizens with local government through
              transparency, accountability, and participation.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-bold text-foreground">
              Platform
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-muted">
              <Link href="/" className="hover:text-primary">Home</Link>
              <Link href="/transparency" className="hover:text-primary">Transparency</Link>
              <Link href="/complaints" className="hover:text-primary">Report an Issue</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-bold text-foreground">
              Account
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-muted">
              <Link href="/login" className="hover:text-primary">Login</Link>
              <Link href="/register" className="hover:text-primary">Register</Link>
            </div>
          </div>

          {/* Mission */}
          <div>
            <h3 className="font-bold text-foreground">
              Our Mission
            </h3>

            <p className="mt-5 text-sm leading-7 text-muted">
              Building more transparent, accountable, and
              connected communities through technology.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-7 text-center">
          <p className="text-sm text-muted">
            © 2026 WardWatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
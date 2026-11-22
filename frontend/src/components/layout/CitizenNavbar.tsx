import Link from 'next/link';
import ThemeSwitcher from '@/components/shared/ThemeSwitcher';

export default function CitizenNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-xl font-bold text-primary"
        >
          WardWatch
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm font-medium">

          <Link href="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>

          <Link href="/complaints" className="hover:text-primary">
            My Complaints
          </Link>

          <Link href="/complaints/new" className="hover:text-primary">
            Report Issue
          </Link>

          <Link href="/transparency" className="hover:text-primary">
            Transparency
          </Link>

        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          {/* Add profile/logout dropdown here later */}
        </div>

      </nav>
    </header>
  );
}
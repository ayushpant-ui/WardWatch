'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import ThemeSwitcher from '@/components/shared/ThemeSwitcher';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Transparency', href: '/transparency' },
  { name: 'Report Issue', href: '/complaints' },
];

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold">
            W
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              WardWatch
            </h1>
            <p className="text-xs text-muted">
              Smart Governance Platform
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeSwitcher />

          <Link
            href="/login"
            className="text-sm font-semibold text-foreground hover:text-primary"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-foreground hover:bg-secondary md:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-foreground"
              >
                {item.name}
              </Link>
            ))}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Appearance</span>
              <ThemeSwitcher />
            </div>

            <Link
              href="/login"
              className="rounded-lg border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
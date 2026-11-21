import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import ThemeSwitcher from '@/components/shared/ThemeSwitcher';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-background">

      <header className="flex items-center justify-between px-6 py-5 lg:px-12">

        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold">
            W
          </div>

          <span className="text-xl font-bold">
            WardWatch
          </span>
        </Link>

        <ThemeSwitcher />

      </header>

      <section className="flex min-h-[85vh] items-center justify-center px-4 py-10">

        <div className="w-full max-w-md">

          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">

            <div className="mb-6 text-center">

              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck size={26} />
              </div>

              <h1 className="text-2xl font-bold">
                {title}
              </h1>

              <p className="mt-2 text-sm text-muted">
                {description}
              </p>

            </div>

            {children}

          </div>

        </div>

      </section>

    </main>
  );
}
import Link from 'next/link';
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">

        {/* Left Content */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
            <ShieldCheck size={16} />
            Building Transparent Communities
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your Ward.
            <br />
            Your Voice.
            <br />

            <span className="text-primary">
              Your Progress.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
            WardWatch connects citizens with local government.
            Report community problems, track development projects,
            and monitor how public resources are being used.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-semibold text-white transition hover:opacity-90"
            >
              Report an Issue
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/transparency"
              className="flex items-center justify-center gap-2 rounded-xl border border-border px-7 py-3.5 font-semibold text-foreground transition hover:bg-secondary"
            >
              Explore Transparency
            </Link>
          </div>

          {/* Highlights */}
          <div className="mt-12 flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 text-green-700 dark:bg-green-950 dark:text-green-400">
                <Users size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Citizen First
                </p>
                <p className="text-xs text-muted">
                  Community participation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 text-green-700 dark:bg-green-950 dark:text-green-400">
                <MapPin size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Location Based
                </p>
                <p className="text-xs text-muted">
                  Report local problems
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="relative">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-xl sm:p-8">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">
                  Community Overview
                </p>
                <h2 className="mt-1 text-xl font-bold text-foreground">
                  Local Development
                </h2>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-400">
                WardWatch
              </span>
            </div>

            {/* Project Card */}
            <div className="rounded-2xl border border-border bg-secondary p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">
                    Development Project
                  </p>
                  <h3 className="mt-1 font-semibold text-foreground">
                    Community Road Construction
                  </h3>
                </div>

                <div className="rounded-xl bg-green-100 p-3 text-green-700 dark:bg-green-950 dark:text-green-400">
                  <MapPin size={22} />
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted">
                    Project progress
                  </span>
                  <span className="font-semibold text-primary">
                    65%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div className="h-full w-[65%] rounded-full bg-primary" />
                </div>
              </div>
            </div>

            {/* Complaint Card */}
            <div className="mt-4 rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    Complaint Tracking
                  </p>
                  <p className="text-sm text-muted">
                    Follow your submitted reports.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-lg bg-secondary p-3">
                <span className="text-sm text-muted">
                  Complaint #WW-001
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  In Progress
                </span>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-muted">
              Illustrative preview — sample data, not live government records.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
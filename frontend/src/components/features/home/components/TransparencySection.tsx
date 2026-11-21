import Link from 'next/link';
import {
  ArrowRight,
  ChartPie,
  Wallet,
  Building2,
  TrendingUp,
} from 'lucide-react';

export default function TransparencySection() {
  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">

        {/* Left Content */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Open Governance
          </span>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Know Where Your
            <span className="text-primary"> Community Is Heading.</span>
          </h2>

          <p className="mt-6 leading-8 text-muted">
            Transparency builds trust. WardWatch provides citizens
            with access to local development information, budget
            utilization, and ward performance.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              'Monitor development projects.',
              'Explore public budget allocation.',
              'Compare ward performance.',
              'View community complaint information.',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-primary dark:bg-green-950">
                  <TrendingUp size={14} />
                </div>

                <span className="text-sm text-foreground">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/transparency"
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition hover:opacity-90"
          >
            Explore Transparency Portal
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Right Cards */}
        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
              <Wallet size={24} />
            </div>

            <h3 className="font-bold text-foreground">
              Budget Overview
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              Explore public funds and expenditure.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <Building2 size={24} />
            </div>

            <h3 className="font-bold text-foreground">
              Development Projects
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              Follow local development activities.
            </p>
          </div>

          <div className="-mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">
              <ChartPie size={24} />
            </div>

            <h3 className="font-bold text-foreground">
              Ward Statistics
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              Understand local performance.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              <TrendingUp size={24} />
            </div>

            <h3 className="font-bold text-foreground">
              Public Accountability
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted">
              Follow government progress.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
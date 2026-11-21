import { ShieldCheck } from 'lucide-react';

export default function TransparencyHeader() {
  return (
    <section className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <ShieldCheck size={17} />
          Public Transparency Portal
        </div>

        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          See Where Your Public Money Goes.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
          Explore municipal budgets, monitor development projects,
          and understand how your ward is performing.
          Government information should be accessible to every citizen.
        </p>

        <div className="mt-7 text-sm text-muted">
          <span className="font-medium text-foreground">
            Transparency Dashboard
          </span>
          {' '} / Fiscal Year 2083/84
        </div>

      </div>
    </section>
  );
}
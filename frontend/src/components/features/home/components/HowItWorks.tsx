import {
  FileText,
  Search,
  ClipboardCheck,
  CheckCircle2,
} from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Report an Issue',
    description:
      'Submit a complaint with a description, photograph, and location.',
  },
  {
    number: '02',
    icon: Search,
    title: 'Review and Verification',
    description:
      'The responsible ward administrator reviews and verifies your complaint.',
  },
  {
    number: '03',
    icon: ClipboardCheck,
    title: 'Action Taken',
    description:
      'The complaint is assigned and the responsible team works on the issue.',
  },
  {
    number: '04',
    icon: CheckCircle2,
    title: 'Track Resolution',
    description:
      'Follow the complaint status and see when the issue is resolved.',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Simple Process
          </span>

          <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            How WardWatch Works
          </h2>

          <p className="mt-5 text-muted">
            From reporting a problem to tracking its resolution.
          </p>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative text-center">

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-primary dark:bg-green-950">
                  <Icon size={28} />

                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 font-bold text-foreground">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
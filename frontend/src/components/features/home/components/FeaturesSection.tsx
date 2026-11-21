import {
  MessageSquareWarning,
  Landmark,
  ChartNoAxesCombined,
  MapPinned,
  ArrowUpRight,
  Wallet,
} from 'lucide-react';

const features = [
  {
    icon: MessageSquareWarning,
    title: 'Report Community Issues',
    description:
      'Report problems such as damaged roads, water supply issues, drainage, and sanitation directly to your local authorities.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Track Complaints',
    description:
      'Follow the progress of submitted complaints and see how local authorities respond to community concerns.',
  },
  {
    icon: Landmark,
    title: 'Government Transparency',
    description:
      'Access information about local development activities, public projects, and government initiatives.',
  },
  {
    icon: Wallet,
    title: 'Budget Monitoring',
    description:
      'Explore allocated budgets, expenditure, and public resource utilization.',
  },
  {
    icon: MapPinned,
    title: 'Location-Based Reporting',
    description:
      'Select the location of community problems on a map so authorities can identify where action is required.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Ward Performance',
    description:
      'Explore ward-level statistics, development progress, and complaint resolution performance.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            What We Offer
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything for a More
            <span className="text-primary"> Connected Community</span>
          </h2>

          <p className="mt-5 leading-7 text-muted">
            One platform to connect citizens, local authorities,
            development projects, and public information.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-bold text-foreground">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                  Learn more
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
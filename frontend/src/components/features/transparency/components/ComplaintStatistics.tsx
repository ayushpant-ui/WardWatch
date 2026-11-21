import {
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

const statistics = [
  {
    title: 'Total Complaints',
    value: '450',
    icon: MessageSquare,
  },
  {
    title: 'Resolved',
    value: '320',
    icon: CheckCircle2,
  },
  {
    title: 'In Progress',
    value: '85',
    icon: Clock,
  },
  {
    title: 'Pending Review',
    value: '45',
    icon: AlertCircle,
  },
];

export default function ComplaintStatistics() {
  return (
    <section className="rounded-xl border border-border bg-card p-6">

      <div className="mb-6">

        <h2 className="text-xl font-bold">
          Public Complaint Statistics
        </h2>

        <p className="mt-2 text-sm text-muted">
          An overview of citizen complaints and their resolution status.
        </p>

      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl bg-secondary p-5"
            >

              <div className="flex items-center justify-between">

                <p className="text-sm text-muted">
                  {item.title}
                </p>

                <Icon size={20} className="text-primary" />

              </div>

              <h3 className="mt-4 text-2xl font-bold">
                {item.value}
              </h3>

            </div>
          );
        })}

      </div>

      <div className="mt-6 rounded-lg bg-primary/5 p-4">

        <p className="text-sm text-muted">
          Complaint Resolution Rate
        </p>

        <div className="mt-2 flex items-center justify-between">

          <span className="text-2xl font-bold text-primary">
            71.1%
          </span>

          <span className="text-xs text-muted">
            320 out of 450 complaints resolved
          </span>

        </div>

      </div>

    </section>
  );
}
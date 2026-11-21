import {
  FileText,
  Clock,
  LoaderCircle,
  CheckCircle2,
} from 'lucide-react';

interface DashboardStatsProps {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

const statsConfig = [
  {
    key: 'total',
    title: 'Total Complaints',
    icon: FileText,
  },
  {
    key: 'pending',
    title: 'Pending Review',
    icon: Clock,
  },
  {
    key: 'inProgress',
    title: 'In Progress',
    icon: LoaderCircle,
  },
  {
    key: 'resolved',
    title: 'Resolved',
    icon: CheckCircle2,
  },
] as const;

export default function DashboardStats({
  total,
  pending,
  inProgress,
  resolved,
}: DashboardStatsProps) {
  const values = {
    total,
    pending,
    inProgress,
    resolved,
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

      {statsConfig.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="rounded-xl border border-border bg-card p-5"
          >

            <div className="flex items-center justify-between">

              <p className="text-sm text-muted">
                {item.title}
              </p>

              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Icon size={20} />
              </div>

            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {values[item.key]}
            </h2>

          </div>
        );
      })}

    </div>
  );
}
import {
  MessageSquare,
  Clock,
  CheckCircle,
  Building2,
  TrendingUp,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Complaints',
    value: '120',
    description: 'All complaints received',
    icon: MessageSquare,
  },
  {
    title: 'Pending Complaints',
    value: '25',
    description: 'Awaiting review',
    icon: Clock,
  },
  {
    title: 'In Progress',
    value: '35',
    description: 'Currently being addressed',
    icon: TrendingUp,
  },
  {
    title: 'Resolved',
    value: '60',
    description: 'Successfully resolved',
    icon: CheckCircle,
  },
  {
    title: 'Active Projects',
    value: '8',
    description: 'Development projects',
    icon: Building2,
  },
];

const recentComplaints = [
  {
    id: 'WW-001',
    title: 'Damaged road near school',
    category: 'Road',
    status: 'Pending',
    date: '21 Nov 2026',
  },
  {
    id: 'WW-002',
    title: 'Water supply interruption',
    category: 'Water',
    status: 'In Progress',
    date: '20 Nov 2026',
  },
  {
    id: 'WW-003',
    title: 'Street light not working',
    category: 'Electricity',
    status: 'Resolved',
    date: '19 Nov 2026',
  },
];

export default function WardDashboardPage() {
  return (
    <div className="space-y-8">

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted">
          Overview of your ward's activities and performance.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-border bg-background p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-foreground">
                    {stat.value}
                  </h2>
                </div>

                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Icon size={23} />
                </div>
              </div>

              <p className="mt-3 text-xs text-muted">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Complaints */}
      <section className="rounded-xl border border-border bg-background">

        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="font-semibold text-foreground">
              Recent Complaints
            </h2>

            <p className="mt-1 text-xs text-muted">
              Recently submitted citizen complaints
            </p>
          </div>

          <a
            href="/ward/complaints"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View All
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-muted">
              <tr>
                <th className="px-5 py-4">Complaint ID</th>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {recentComplaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  className="border-t border-border"
                >
                  <td className="px-5 py-4 font-medium">
                    {complaint.id}
                  </td>

                  <td className="px-5 py-4">
                    {complaint.title}
                  </td>

                  <td className="px-5 py-4 text-muted">
                    {complaint.category}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        complaint.status === 'Resolved'
                          ? 'bg-green-100 text-green-700'
                          : complaint.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-muted">
                    {complaint.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
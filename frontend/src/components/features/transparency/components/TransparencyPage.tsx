import TransparencyHeader from './TransparencyHeader';
import TransparencyStats from './TransparencyStats';
import BudgetOverview from './BudgetOverview';
import PublicProjects from './PublicProjects';
import WardPerformance from './WardPerformance';
import ComplaintStatistics from './ComplaintStatistics';

export default function TransparencyPage() {
  return (
    <main className="min-h-screen bg-background">

      <TransparencyHeader />

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-12 lg:px-8">

        {/* Statistics */}
        <TransparencyStats />

        {/* Budget */}
        <BudgetOverview />

        {/* Development Projects */}
        <PublicProjects />

        {/* Ward Comparison */}
        <WardPerformance />

        {/* Complaint Statistics */}
        <ComplaintStatistics />

        {/* Disclaimer */}
        <div className="rounded-xl border border-border bg-secondary p-5">

          <h3 className="font-semibold">
            About This Information
          </h3>

          <p className="mt-2 text-sm leading-6 text-muted">
            The figures currently displayed are illustrative sample
            data for the WardWatch demonstration. Actual financial
            information, project progress, and complaint statistics
            should be published and verified by the responsible
            municipal authorities.
          </p>

        </div>

      </div>

    </main>
  );
}
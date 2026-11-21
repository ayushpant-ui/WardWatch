export default function ComplaintsPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-foreground">
        Complaint Management
      </h1>

      <p className="text-sm text-muted">
        Review citizen complaints, investigate issues and update their status.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-background p-8">
        <h2 className="font-semibold">All Ward Complaints</h2>
        <p className="mt-2 text-sm text-muted">
          Complaint table will be implemented here.
        </p>
      </div>
    </div>
  );
}
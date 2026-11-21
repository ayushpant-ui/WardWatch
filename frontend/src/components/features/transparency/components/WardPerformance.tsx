import { wardPerformance } from '../transparency.data';

export default function WardPerformance() {
  return (
    <section className="rounded-xl border border-border bg-card p-6">

      <div className="mb-6">

        <h2 className="text-xl font-bold">
          Ward Performance
        </h2>

        <p className="mt-2 text-sm text-muted">
          Compare project completion and budget utilization across wards.
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full min-w-[600px] text-left text-sm">

          <thead>
            <tr className="border-b border-border text-muted">

              <th className="px-4 py-4 font-medium">
                Ward
              </th>

              <th className="px-4 py-4 font-medium">
                Total Projects
              </th>

              <th className="px-4 py-4 font-medium">
                Completed
              </th>

              <th className="px-4 py-4 font-medium">
                Budget Utilization
              </th>

            </tr>
          </thead>

          <tbody>

            {wardPerformance.map((ward) => (

              <tr
                key={ward.ward}
                className="border-b border-border last:border-0"
              >

                <td className="px-4 py-4 font-semibold">
                  {ward.ward}
                </td>

                <td className="px-4 py-4">
                  {ward.projects}
                </td>

                <td className="px-4 py-4">
                  {ward.completed}
                </td>

                <td className="px-4 py-4">

                  <div className="flex items-center gap-3">

                    <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${ward.budgetUtilization}%`,
                        }}
                      />
                    </div>

                    <span className="font-medium">
                      {ward.budgetUtilization}%
                    </span>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}
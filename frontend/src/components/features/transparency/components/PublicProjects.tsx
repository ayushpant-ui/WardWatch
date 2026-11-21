import {
  CalendarDays,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';

import Link from 'next/link';

import { publicProjects } from '../transparency.data';

export default function PublicProjects() {
  return (
    <section>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold">
            Development Projects
          </h2>

          <p className="mt-2 text-sm text-muted">
            Track ongoing and completed public development projects.
          </p>
        </div>

        <Link
          href="/transparency/projects"
          className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          View all projects
          <ArrowUpRight size={17} />
        </Link>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {publicProjects.map((project) => (

          <div
            key={project.id}
            className="rounded-xl border border-border bg-card p-5 transition hover:shadow-md"
          >

            <div className="flex items-start justify-between gap-3">

              <div>
                <h3 className="font-semibold">
                  {project.name}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <MapPin size={15} />
                  {project.ward}
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  project.status === 'Completed'
                    ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                }`}
              >
                {project.status}
              </span>

            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">

              <div>
                <p className="text-xs text-muted">
                  Project Budget
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {project.budget}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted">
                  Expected Completion
                </p>

                <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
                  <CalendarDays size={14} />
                  {project.expectedDate}
                </p>
              </div>

            </div>

            <div className="mt-6">

              <div className="mb-2 flex justify-between text-sm">

                <span className="text-muted">
                  Project Progress
                </span>

                <span className="font-semibold">
                  {project.progress}%
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${project.progress}%` }}
                />
              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}
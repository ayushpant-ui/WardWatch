import WardOfficialRegisterForm from '@/components/features/auth/components/WardOfficialRegisterForm';

export default function WardOfficialRegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16 dark:bg-gray-900">

      <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800 dark:bg-green-950 dark:text-green-400">
            WardWatch Officials
          </span>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            Join Your Ward's Digital Governance Platform
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            Register as a ward official to manage citizen complaints,
            monitor development activities, and improve transparency
            in your ward.
          </p>
        </div>

        <div className="flex justify-center">
          <WardOfficialRegisterForm />
        </div>

      </div>

    </main>
  );
}
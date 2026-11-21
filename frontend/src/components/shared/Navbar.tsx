import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
      <h1 className="text-xl font-bold text-foreground">
        WardWatch
      </h1>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        <button className="rounded-lg bg-primary px-4 py-2 text-white">
          Login
        </button>
      </div>
    </nav>
  );
}
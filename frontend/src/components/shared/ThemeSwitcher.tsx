'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

const themes = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon,
  },
  {
    value: 'system',
    label: 'System',
    icon: Monitor,
  },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-lg border border-border" />
    );
  }

  return (
    <div className="relative group">
      <button
        type="button"
        aria-label="Change theme"
        title="Change theme"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary"
      >
        {theme === 'dark' ? (
          <Moon size={19} />
        ) : theme === 'light' ? (
          <Sun size={19} />
        ) : (
          <Monitor size={19} />
        )}
      </button>

      <div className="invisible absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-border bg-card p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        {themes.map((item) => {
          const Icon = item.icon;
          const isActive = theme === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setTheme(item.value)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              <span className="flex items-center gap-3">
                <Icon size={16} />
                {item.label}
              </span>

              {isActive && (
                <Check size={15} className="text-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

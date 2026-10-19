import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CloudSun, Compass, Home, ListChecks, Sailboat, SlidersVertical } from "lucide-react";

const NAV = [
  { to: "/", label: "Session", icon: Home, end: true },
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/rigging", label: "Rigging", icon: SlidersVertical },
  { to: "/checklist", label: "Checklist", icon: ListChecks },
  { to: "/boats", label: "Boats", icon: Sailboat },
];

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-line bg-ink/90 backdrop-blur pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <span className="grid size-10 place-items-center rounded-xl bg-amber text-amber-ink">
            <Compass className="size-6" strokeWidth={2.2} />
          </span>
          <div className="leading-tight">
            <div className="font-serif text-2xl">Tacktical</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Sailor's console</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-6 pb-32 sm:px-6 sm:pt-8">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-ink/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <ul className="mx-auto grid max-w-3xl grid-cols-5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-3 text-xs transition-colors ${isActive ? "text-amber" : "text-muted hover:text-fg"}`
                }
              >
                <Icon className="size-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sailboat } from "lucide-react";

export function PageHeading({ eyebrow, title, sub, action }: { eyebrow: string; title: string; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
      <div className="min-w-0">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="mt-2 font-serif text-5xl leading-none sm:text-6xl">{title}</h1>
        {sub && <p className="mt-3 text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Meter({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-well" role="presentation">
      <div className="h-full rounded-full bg-amber transition-[width] duration-300" style={{ width: `${value}%` }} />
    </div>
  );
}

export function NeedsBoat({ what }: { what: string }) {
  return (
    <div className="card flex flex-col items-start gap-4">
      <Sailboat className="size-8 text-amber" />
      <div>
        <h2 className="font-serif text-3xl">Pick a boat first</h2>
        <p className="mt-1 text-muted">{what} is tailored to your boat. Add one and choose it on the session page.</p>
      </div>
      <Link to="/boats/new" className="btn-ghost">
        Add a boat
      </Link>
    </div>
  );
}

export function Stat({ icon, label, value }: { icon?: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-panel px-4 py-4">
      <div className="eyebrow flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div className="mt-2 font-mono text-lg">{value}</div>
    </div>
  );
}

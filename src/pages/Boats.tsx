import { Link } from "react-router-dom";
import { Pencil, Plus } from "lucide-react";
import { useStore } from "../lib/store";
import { boatSubtitle } from "../lib/boats";
import { PageHeading } from "../components/ui";

export default function Boats() {
  const { boats, boatId, selectBoat } = useStore();

  return (
    <>
      <PageHeading
        eyebrow="Your fleet"
        title="Boats"
        action={
          <Link to="/boats/new" className="btn-ghost shrink-0">
            <Plus className="size-4" /> Add
          </Link>
        }
      />

      {boats.length === 0 ? (
        <div className="card">
          <p className="text-muted">No boats yet. Add the boat you sail and the app tunes everything to it.</p>
          <Link to="/boats/new" className="btn-primary mt-5">
            Add your first boat
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {boats.map((b) => {
            const active = b.id === boatId;
            return (
              <li key={b.id} className={`card flex items-center gap-4 !p-4 sm:!p-5 ${active ? "border-amber" : ""}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-lg">{b.name}</span>
                    {active && <span className="rounded-full bg-amber/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber">Sailing</span>}
                  </div>
                  <div className="text-sm text-muted">
                    {boatSubtitle(b)} · {b.sails.join(", ")}
                  </div>
                </div>
                {!active && (
                  <button onClick={() => selectBoat(b.id)} className="btn-ghost">
                    Sail this
                  </button>
                )}
                <Link to={`/boats/${b.id}`} className="btn-ghost !px-3" aria-label={`Edit ${b.name}`}>
                  <Pencil className="size-4" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

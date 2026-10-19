import { Link } from "react-router-dom";
import { Check, RotateCcw } from "lucide-react";
import { useStore } from "../lib/store";
import { CHECKLIST_INTRO, checklistFor } from "../lib/checklist";
import { sailTypeName } from "../lib/session";
import { Meter, NeedsBoat, PageHeading } from "../components/ui";

export default function Checklist() {
  const { boat, sailType, checks, toggleCheck, clearChecks } = useStore();
  if (!boat) {
    return (
      <>
        <PageHeading eyebrow="Crew checklist" title="Checklist" />
        <NeedsBoat what="The checklist" />
      </>
    );
  }

  const prefix = `${boat.id}:${sailType}:`;
  const sections = checklistFor(sailType, boat.rig);
  const keyOf = (s: string, i: string) => `${prefix}${s}:${i}`;
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const done = sections.reduce((n, s) => n + s.items.filter((i) => checks[keyOf(s.id, i.id)]).length, 0);

  return (
    <>
      <PageHeading eyebrow="Crew checklist" title={sailTypeName(sailType)} sub={`${boat.name} — ${CHECKLIST_INTRO[sailType]}`} />

      <div className="space-y-5">
        <section className="card sticky top-[4.75rem] z-10">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-lg">
              {done === total ? "All done — have a good sail" : `${done} / ${total} complete`}
            </span>
            <button onClick={() => clearChecks(prefix)} disabled={done === 0} className="btn-ghost">
              <RotateCcw className="size-4" /> Reset
            </button>
          </div>
          <Meter value={(done / total) * 100} />
        </section>

        {sections.map((s) => {
          const sDone = s.items.filter((i) => checks[keyOf(s.id, i.id)]).length;
          return (
            <section key={s.id} className="card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="eyebrow">{s.title}</h2>
                <span className={`font-mono text-xs ${sDone === s.items.length ? "text-teal" : "text-faint"}`}>
                  {sDone}/{s.items.length}
                </span>
              </div>
              <ul className="space-y-2.5">
                {s.items.map((i) => {
                  const on = !!checks[keyOf(s.id, i.id)];
                  return (
                    <li key={i.id}>
                      <button
                        role="checkbox"
                        aria-checked={on}
                        onClick={() => toggleCheck(keyOf(s.id, i.id))}
                        className="flex w-full items-center gap-4 rounded-xl border border-line bg-well px-4 py-4 text-left transition-colors hover:border-line-strong"
                      >
                        <span
                          className={`grid size-6 shrink-0 place-items-center rounded-md border transition-colors ${on ? "border-teal bg-teal text-ink" : "border-line-strong"}`}
                        >
                          {on && <Check className="size-4" strokeWidth={3} />}
                        </span>
                        <span className={on ? "text-muted line-through decoration-faint" : ""}>{i.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <p className="text-sm text-muted">
          Change your sail type on the{" "}
          <Link to="/" className="text-amber hover:underline">
            session page
          </Link>{" "}
          and this list rebuilds itself.
        </p>
      </div>
    </>
  );
}

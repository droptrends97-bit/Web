import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useStore } from "../lib/store";
import { BOAT_CLASSES, RIG_LABEL, classById, type Boat, type RigType } from "../lib/boats";
import { PageHeading } from "../components/ui";

export default function BoatForm() {
  const { id } = useParams();
  const { boats, saveBoat, deleteBoat } = useStore();
  const navigate = useNavigate();
  const existing = boats.find((b) => b.id === id);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [classId, setClassId] = useState(existing?.classId ?? "");
  const [name, setName] = useState(existing?.name ?? "");
  const [rig, setRig] = useState<RigType>(existing?.rig ?? "una");
  const [pointing, setPointing] = useState(String(existing?.pointing ?? 45));
  const [sails, setSails] = useState(existing?.sails.join(", ") ?? "Main");

  if (id && !existing) {
    return (
      <div className="card">
        That boat doesn't exist any more.{" "}
        <Link to="/boats" className="text-amber hover:underline">
          Back to boats
        </Link>
      </div>
    );
  }

  const cls = classById(classId);

  const pickClass = (cid: string) => {
    const c = classById(cid)!;
    setClassId(cid);
    setRig(c.rig);
    setPointing(String(c.pointing));
    setSails(c.sails.join(", "));
  };

  const angle = Number(pointing);
  const angleOk = Number.isFinite(angle) && angle >= 30 && angle <= 60;
  const canSave = !!cls && angleOk;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    const boat: Boat = {
      id: existing?.id ?? crypto.randomUUID(),
      classId,
      name: name.trim() || cls.name,
      rig,
      pointing: angle,
      sails: sails.split(",").map((s) => s.trim()).filter(Boolean),
    };
    saveBoat(boat);
    navigate(existing ? "/boats" : "/");
  };

  return (
    <form onSubmit={submit}>
      <Link to="/boats" className="mb-5 inline-flex items-center gap-2 text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Back
      </Link>
      <PageHeading eyebrow={existing ? "Edit boat" : "New boat"} title={existing ? existing.name : "Add a boat"} />

      <div className="space-y-5">
        <section className="card">
          <h2 className="eyebrow mb-4">Class</h2>
          <div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="Boat class">
            {BOAT_CLASSES.map((c) => (
              <button type="button" key={c.id} role="radio" aria-checked={c.id === classId} onClick={() => pickClass(c.id)} className="choice px-5 py-3.5">
                {c.name}
              </button>
            ))}
          </div>
        </section>

        <section className={`card space-y-5 transition-opacity ${cls ? "" : "pointer-events-none opacity-50"}`} aria-disabled={!cls}>
          {!cls && <p className="text-sm text-muted">Pick a class first — it fills in sensible defaults.</p>}
          <label className="block">
            <span className="eyebrow">Boat name</span>
            <input className="field mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder={cls?.name ?? ""} maxLength={40} />
            <span className="mt-1 block text-sm text-faint">Optional — leave blank to use the class name.</span>
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow">Rig</span>
              <select className="field mt-2" value={rig} onChange={(e) => setRig(e.target.value as RigType)}>
                {(Object.keys(RIG_LABEL) as RigType[]).map((r) => (
                  <option key={r} value={r}>
                    {RIG_LABEL[r]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="eyebrow">Upwind pointing angle (°)</span>
              <input className="field mt-2 font-mono" inputMode="numeric" value={pointing} onChange={(e) => setPointing(e.target.value)} aria-invalid={!angleOk} />
              {!angleOk && <span className="mt-1 block text-sm text-danger">Use a number between 30 and 60.</span>}
            </label>
          </div>
          <label className="block">
            <span className="eyebrow">Sail inventory (comma-separated)</span>
            <input className="field mt-2" value={sails} onChange={(e) => setSails(e.target.value)} />
          </label>
        </section>

        <button type="submit" className="btn-primary" disabled={!canSave}>
          Save boat
        </button>

        {existing &&
          (confirmDelete ? (
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <span>Delete {existing.name}? This can't be undone.</span>
              <button
                type="button"
                onClick={() => {
                  deleteBoat(existing.id);
                  navigate("/boats");
                }}
                className="btn-ghost border-danger/60 text-danger"
              >
                <Trash2 className="size-4" /> Delete
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="btn-ghost">
                Keep it
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="mx-auto flex items-center gap-2 text-sm text-danger hover:underline"
            >
              <Trash2 className="size-4" /> Delete boat
            </button>
          ))}
      </div>
    </form>
  );
}

import type { RigType } from "../lib/boats";
import type { ControlId } from "../lib/rigging";

/** Where each control acts on the drawing (bow to the right). */
const ANCHORS: Record<ControlId, [number, number]> = {
  outhaul: [134, 248],
  cunningham: [298, 236],
  vang: [282, 266],
  mainsheet: [180, 252],
  jib: [334, 234],
};

const stroke = { stroke: "var(--color-muted)", strokeWidth: 1.4, strokeLinejoin: "round" as const };

export default function RigDiagram({ rig, controls }: { rig: RigType; controls: ControlId[] }) {
  const hasJib = rig !== "una";
  return (
    <svg viewBox="90 20 450 340" className="w-full" role="img" aria-label="Side view of the boat with numbered control points">
      {/* foils */}
      <path d="M282 306 L298 306 L300 352 L288 354 Z" fill="var(--color-well)" {...stroke} />
      <path d="M116 284 L128 284 L132 338 L120 340 Z" fill="var(--color-well)" {...stroke} />
      {/* hull */}
      <path d="M110 280 L470 275 Q462 300 430 306 L140 308 Q114 302 110 280 Z" fill="var(--color-well)" {...stroke} />
      {rig === "sloop-kite" && <line x1={468} y1={276} x2={522} y2={271} {...stroke} strokeWidth={2} />}
      {/* shrouds */}
      {hasJib && <line x1={292} y1={96} x2={316} y2={278} stroke="var(--color-line-strong)" />}
      {/* mainsail */}
      <path d="M291 42 L298 246 L136 248 Q176 128 291 42 Z" fill="var(--color-fg)" fillOpacity={0.06} {...stroke} />
      {[0.3, 0.55, 0.78].map((t) => {
        const y = 42 + t * 206;
        const x = 291 - t * 150;
        return <line key={t} x1={x} y1={y} x2={x + 46} y2={y + 2} stroke="var(--color-line-strong)" strokeDasharray="3 3" />;
      })}
      {/* jib */}
      {hasJib && <path d="M294 100 L464 276 Q396 246 334 236 Z" fill="var(--color-fg)" fillOpacity={0.04} {...stroke} />}
      {/* mast and boom */}
      <line x1={290} y1={30} x2={300} y2={280} stroke="var(--color-fg)" strokeWidth={3} strokeLinecap="round" />
      <line x1={300} y1={250} x2={128} y2={252} stroke="var(--color-fg)" strokeWidth={3} strokeLinecap="round" />

      {controls.map((id, i) => {
        const [x, y] = ANCHORS[id];
        return (
          <g key={id}>
            <circle cx={x} cy={y} r={12} fill="var(--color-teal)" stroke="var(--color-ink)" strokeWidth={3} />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="var(--color-ink)" className="font-mono text-[12px] font-medium">
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

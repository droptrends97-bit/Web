const C = 110;
const R = 96;

function polar(deg: number, r: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
}

function sector(from: number, to: number, r: number): string {
  const [x1, y1] = polar(from, r);
  const [x2, y2] = polar(to, r);
  const large = (to - from + 360) % 360 > 180 ? 1 : 0;
  return `M${C} ${C} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

/**
 * Wind rose. The shaded wedge is the no-go zone centred on where the wind comes FROM;
 * the arrow points the way the wind is blowing, as on a weather chart.
 */
export default function WindCompass({ dir, noGo }: { dir: number; noGo: number }) {
  const [tailX, tailY] = polar(dir, R - 14);
  const [headX, headY] = polar(dir + 180, R - 18);
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);

  return (
    <svg viewBox="0 0 220 220" className="mx-auto w-full max-w-[260px]" role="img" aria-label={`Wind from ${Math.round(dir)} degrees`}>
      <circle cx={C} cy={C} r={R} fill="var(--color-well)" stroke="var(--color-line-strong)" />
      <path d={sector(dir - noGo, dir + noGo, R)} fill="var(--color-danger)" opacity={0.22} />
      {ticks.map((t) => {
        const [x1, y1] = polar(t, R);
        const [x2, y2] = polar(t, t % 90 === 0 ? R - 10 : R - 5);
        return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-line-strong)" />;
      })}
      {(["N", "E", "S", "W"] as const).map((l, i) => {
        const [x, y] = polar(i * 90, R - 20);
        return (
          <text key={l} x={x} y={y} textAnchor="middle" dominantBaseline="central" className="fill-muted font-mono text-[10px]">
            {l}
          </text>
        );
      })}
      <line x1={tailX} y1={tailY} x2={headX} y2={headY} stroke="var(--color-amber)" strokeWidth={3} strokeLinecap="round" />
      <g transform={`translate(${headX} ${headY}) rotate(${dir})`}>
        <path d="M0 6 L-7 -6 L7 -6 Z" fill="var(--color-amber)" />
      </g>
      <circle cx={tailX} cy={tailY} r={4} fill="var(--color-amber)" />
    </svg>
  );
}

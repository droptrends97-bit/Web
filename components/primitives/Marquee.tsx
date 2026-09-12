type Props = {
  children: React.ReactNode;
  /** Seconds for one full pass. Larger = slower. */
  duration?: number;
  reverse?: boolean;
  className?: string;
};

/**
 * Infinite horizontal ticker.
 *
 * The track holds the content twice and translates by exactly -50%, so the loop
 * is seamless at any content width. CSS-only — it costs nothing on the main
 * thread and keeps running while JS is busy hydrating.
 */
export default function Marquee({
  children,
  duration = 38,
  reverse = false,
  className,
}: Props) {
  return (
    <div className={`marquee relative overflow-hidden ${className ?? ""}`}>
      <div
        className="marquee-track"
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          ["--marquee-direction" as string]: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

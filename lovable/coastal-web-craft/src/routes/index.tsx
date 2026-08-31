import { createFileRoute } from "@tanstack/react-router";
import {
  memo,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useServerFn } from "@tanstack/react-start";
import { useSiteContent, telHref } from "@/lib/site-content";
import { sendContactEnquiry } from "@/lib/contact.functions";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ------------------------------------------------------------------ *
 * The ports along the left-hand rail. Order must match the DOM order
 * of the sections they point at — the rail reads their real positions.
 * ------------------------------------------------------------------ */
const PORTS = [
  { id: "top", label: "Dublin 53.3498°N" },
  { id: "problem", label: "Skerries 53.5747°N" },
  { id: "work", label: "Greystones 53.1424°N" },
  { id: "who", label: "Malahide 53.4508°N" },
  { id: "process", label: "Wicklow 52.9808°N" },
  { id: "pricing", label: "Arklow 52.7956°N" },
  { id: "contact", label: "Next stop — you" },
] as const;

/* A drawn coastline rather than a ruled line: 40 x 1000 user units,
   stretched to the rail box with a non-scaling stroke. */
const COAST =
  "M27 0 C15 62 31 118 21 186 S34 296 22 368 C11 438 30 498 20 568 S33 686 23 758 C13 828 30 884 25 1000";

const delay = (i: number) => ({ "--i": i }) as unknown as CSSProperties;

/* ------------------------------------------------------------------ *
 * Reveal helpers
 * ------------------------------------------------------------------ */
function useInView<T extends Element>(cls: string) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add(cls);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(cls);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [cls]);
  return ref;
}

/** A line of display type that rises out of a clipped box. */
function RiseLine({ children, i = 0 }: { children: ReactNode; i?: number }) {
  const ref = useInView<HTMLSpanElement>("rise-in");
  return (
    <span ref={ref} className="rise block" style={delay(i)}>
      <span>{children}</span>
    </span>
  );
}

/** A block that fades and drifts up once. */
function Drift({
  children,
  i = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  i?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const ref = useInView<HTMLElement>("drift-in");
  const cls = `drift ${className}`;
  if (as === "li") {
    return (
      <li ref={ref as React.RefObject<HTMLLIElement>} className={cls} style={delay(i)}>
        {children}
      </li>
    );
  }
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={cls} style={delay(i)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Coast rail — a fixed chart of the whole page down the left edge.
 * Ports sit at each section's true position; the rust pip is you.
 * All positioning is imperative so scrolling never re-renders React.
 * ------------------------------------------------------------------ */
function CoastRail() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const progRef = useRef<SVGPathElement | null>(null);
  const hereRef = useRef<HTMLDivElement | null>(null);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    let raf = 0;

    const pointAt = (p: number) => {
      const len = path.getTotalLength();
      const pt = path.getPointAtLength(Math.max(0, Math.min(1, p)) * len);
      return { x: (pt.x / 40) * 100, y: (pt.y / 1000) * 100 };
    };

    const range = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const place = () => {
      const r = range();
      PORTS.forEach((port, i) => {
        const el = document.getElementById(port.id);
        const wrap = wrapRefs.current[i];
        if (!wrap) return;
        const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
        const { x, y } = pointAt(top / r);
        wrap.style.left = `${x}%`;
        wrap.style.top = `${y}%`;
      });
    };

    const track = () => {
      raf = 0;
      const p = Math.max(0, Math.min(1, window.scrollY / range()));
      if (progRef.current) {
        progRef.current.style.strokeDashoffset = String(1000 * (1 - p));
      }
      if (hereRef.current) {
        const { x, y } = pointAt(p);
        hereRef.current.style.left = `${x}%`;
        hereRef.current.style.top = `${y}%`;
      }
      let current = 0;
      PORTS.forEach((port, i) => {
        const el = document.getElementById(port.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.42) current = i;
      });
      dotRefs.current.forEach((d, i) => {
        if (d) d.dataset.active = String(i === current);
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(track);
    };

    place();
    track();

    const ro = new ResizeObserver(() => {
      place();
      onScroll();
    });
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", place);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav className="rail hidden lg:block" aria-label="Jump to section">
      <svg
        className="rail-svg"
        viewBox="0 0 40 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d={COAST}
          pathLength={1000}
          fill="none"
          stroke="var(--rail-line)"
          strokeWidth="1.75"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={progRef}
          d={COAST}
          pathLength={1000}
          fill="none"
          stroke="var(--teal)"
          strokeWidth="1.75"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {PORTS.map((port, i) => (
        <div
          key={port.id}
          ref={(el) => {
            wrapRefs.current[i] = el;
          }}
          className="absolute"
        >
          <button
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            type="button"
            className="rail-port"
            data-active="false"
            onClick={() => {
              document.getElementById(port.id)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="sr-only">{port.label}</span>
          </button>
          <span className="rail-label" aria-hidden="true">
            {port.label}
          </span>
        </div>
      ))}

      <div ref={hereRef} className="rail-here" aria-hidden="true" />
    </nav>
  );
}

/* ------------------------------------------------------------------ *
 * Tide — the boundary between a paper section and an ink one.
 * Two tiles, 1200 units wide each, drifting at different rates.
 * ------------------------------------------------------------------ */
const TIDE_A =
  "M0,44 C160,12 300,74 600,48 C900,22 1050,70 1200,44 L1200,90 L0,90 Z " +
  "M1200,44 C1360,12 1500,74 1800,48 C2100,22 2250,70 2400,44 L2400,90 L1200,90 Z";
const TIDE_B =
  "M0,58 C220,30 340,84 620,58 C880,34 1020,80 1200,58 L1200,90 L0,90 Z " +
  "M1200,58 C1420,30 1540,84 1820,58 C2080,34 2220,80 2400,58 L2400,90 L1200,90 Z";

function Tide({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`pointer-events-none relative h-[54px] overflow-hidden md:h-[84px] ${
        flip ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <svg
        className="tide-b absolute bottom-0 left-0 h-full"
        style={{ width: "200%" }}
        viewBox="0 0 2400 90"
        preserveAspectRatio="none"
      >
        <path d={TIDE_B} fill="var(--ink)" opacity="0.35" />
      </svg>
      <svg
        className="tide-a absolute bottom-0 left-0 h-full"
        style={{ width: "200%" }}
        viewBox="0 0 2400 90"
        preserveAspectRatio="none"
      >
        <path d={TIDE_A} fill="var(--ink)" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Section scaffolding — an eyebrow marker and the measured column.
 * ------------------------------------------------------------------ */
function Shell({
  children,
  marker,
  className = "",
}: {
  children: ReactNode;
  marker: string;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 lg:pl-28 lg:pr-8 ${className}`}>
      <Drift className="mb-9 flex items-center gap-3">
        <span className="h-px w-8 bg-teal" />
        <span className="eyebrow">{marker}</span>
      </Drift>
      {children}
    </div>
  );
}

/** Primary call to action that leans a little toward the pointer. */
function Magnet({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.14}px, ${dy * 0.22}px)`;
    };
    const reset = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);
  return (
    <a ref={ref} href={href} className={className} style={{ transition: "transform 0.25s ease-out" }}>
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ *
 * Header
 * ------------------------------------------------------------------ */
function Nav() {
  const { data: content } = useSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.max(0, Math.min(1, window.scrollY / range));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      setScrolled(window.scrollY > 12);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const links = [
    { href: "#problem", label: "The problem" },
    { href: "#work", label: "Work" },
    { href: "#process", label: "Process" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-ink/10 bg-paper/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 lg:pl-28 lg:pr-8">
        <a
          href="#top"
          className="shrink-0 font-display text-xl font-extrabold uppercase tracking-tight text-ink"
        >
          East<span className="text-teal">Coast</span> Digital
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="wipe whitespace-nowrap pb-0.5 text-sm font-medium text-slate transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <a
            href={telHref(content.phone)}
            className="wipe hidden whitespace-nowrap pb-0.5 font-mono text-xs tracking-wider text-ink lg:block"
          >
            {content.phone}
          </a>
          <a
            href="#contact"
            className="whitespace-nowrap rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5"
          >
            Get a quote
          </a>
        </nav>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-ink/20 text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span
              className={`h-0.5 w-5 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`h-0.5 w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`h-0.5 w-5 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-paper md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-slate hover:bg-sand"
              >
                {l.label}
              </a>
            ))}
            <a
              href={telHref(content.phone)}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 font-mono text-xs tracking-wider text-ink hover:bg-sand"
            >
              {content.phone}
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-ink px-4 py-3 text-center text-sm font-semibold text-paper"
            >
              Get a quote
            </a>
          </div>
        </div>
      )}

      <div
        ref={barRef}
        className="h-px origin-left bg-teal"
        style={{ transform: "scaleX(0)" }}
        aria-hidden="true"
      />
    </header>
  );
}

/* ------------------------------------------------------------------ *
 * Hero
 * ------------------------------------------------------------------ */
function Clock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IE", {
      timeZone: "Europe/Dublin",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{now ?? "--:--:--"}</span>;
}

function Hero() {
  const { data: content } = useSiteContent();
  const drawRef = useInView<SVGSVGElement>("drawn");

  return (
    <section id="top" className="relative scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-5 pt-14 pb-16 lg:pl-28 lg:pr-8 lg:pt-24 lg:pb-24">
        <Drift className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="eyebrow flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="pip-ring absolute inset-0 rounded-full bg-teal" />
              <span className="relative h-2 w-2 rounded-full bg-teal" />
            </span>
            Taking on work now
          </span>
          <span className="eyebrow">53.3498°N, 6.2603°W — Dublin, Ireland</span>
          <span className="eyebrow">
            Local time <Clock />
          </span>
        </Drift>

        <h1 className="mt-8 max-w-5xl text-[clamp(2.75rem,8vw,6.5rem)] font-black leading-[1.02] text-ink">
          <RiseLine i={0}>
            Your business{" "}
            <span className="relative inline-block text-teal">
              deserves
              <svg
                ref={drawRef}
                className="draw-line pointer-events-none absolute"
                style={{ left: "-3%", width: "106%", bottom: "-0.05em", height: "0.13em" }}
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8 C 44 2, 76 11, 112 5 S 172 3, 197 7"
                  fill="none"
                  stroke="var(--rust)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </span>
          </RiseLine>
          <RiseLine i={1}>a website that doesn't</RiseLine>
          <RiseLine i={2}>embarrass you.</RiseLine>
        </h1>

        <Drift i={3} className="mt-8 max-w-2xl">
          <p className="text-lg text-slate md:text-xl">
            We build fast, clean, working websites for Irish businesses who've outgrown no website —
            or never liked the one they have. Based on the east coast. Building for clients
            nationwide.
          </p>
        </Drift>

        <Drift i={4} className="mt-9 flex flex-wrap items-center gap-3">
          <Magnet
            href="#contact"
            className="inline-block rounded-md bg-ink px-7 py-4 text-sm font-semibold uppercase tracking-wide text-paper"
          >
            Get a free quote
          </Magnet>
          <a
            href="#work"
            className="fillup inline-block rounded-md border-2 border-ink px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:text-paper"
          >
            See a site we built
          </a>
        </Drift>

        <Drift i={5} className="mt-14 max-w-2xl">
          <dl className="grid grid-cols-3 divide-x divide-ink/12 border-y border-ink/12">
            {[
              [content.price, "to build"],
              ["€30/mo", "hosting & support"],
              ["7 days", "to going live"],
            ].map(([n, l]) => (
              <div key={l} className="px-4 py-5 first:pl-0">
                <dt className="font-mono text-2xl font-medium text-ink md:text-3xl">{n}</dt>
                <dd className="eyebrow mt-1.5 block">{l}</dd>
              </div>
            ))}
          </dl>
        </Drift>
      </div>
      <Tide />
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Marquee band
 * ------------------------------------------------------------------ */
const TICKER = [
  "Built, not templated",
  "Live in under a week",
  "€30 a month, everything in",
  "Two people, no account managers",
  "Ireland's east coast",
  "Working nationwide",
];

function Ticker() {
  return (
    <div className="bg-ink py-4 text-paper">
      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {TICKER.map((t) => (
                <span key={t} className="flex items-center whitespace-nowrap">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper/85 md:text-sm">
                    {t}
                  </span>
                  <span className="mx-7 h-1.5 w-1.5 rotate-45 bg-teal md:mx-10" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Before / after — drag to compare
 * ------------------------------------------------------------------ */
const OldPane = memo(function OldPane() {
  const nav = ["Home", "About Us", "Products", "Contact", "Guestbook", "Links"];
  return (
    <div className="cmp-pane oldweb flex flex-col">
      <div className="oldweb-chrome flex shrink-0 items-center gap-2 px-2 py-1.5 text-[10px] text-black sm:text-xs">
        <span className="h-2.5 w-2.5 border border-black/50 bg-white" />
        <span className="truncate">Hartnett and Sons - Home Page - Microsoft Internet Explorer</span>
      </div>

      <div className="flex flex-1 flex-col p-2 sm:p-4">
        <div className="shrink-0 border border-[#999] bg-[#f0f0f0] py-1.5 text-center sm:py-2">
          <div className="text-[12px] font-bold leading-tight sm:text-[20px]">
            HARTNETT AND SONS FAMILY BUTCHERS LTD.
          </div>
          <div className="mt-0.5 text-[8px] text-[#444] sm:text-[12px]">
            Quality Meats Since 1962 &nbsp;-&nbsp; Midleton, Co. Cork
          </div>
        </div>

        <div className="mt-2 flex min-h-0 flex-1 gap-2 sm:mt-3 sm:gap-3">
          <div className="w-[86px] shrink-0 border border-[#999] bg-[#f6f6f6] p-1.5 sm:w-[168px] sm:p-3">
            <div className="text-[9px] font-bold underline sm:text-[13px]">Navigation</div>
            <ul className="mt-1 space-y-0.5 sm:mt-2 sm:space-y-1">
              {nav.map((n) => (
                <li key={n} className="text-[8px] sm:text-[12px]">
                  <a href="#0">{n}</a>
                </li>
              ))}
            </ul>
            <div className="mt-2 grid h-8 place-items-center border border-[#999] bg-[#eee] text-[7px] text-[#777] sm:mt-3 sm:h-14 sm:text-[10px]">
              image not found
            </div>
            <div className="mt-2 text-[8px] font-bold leading-tight text-[#b00000] sm:mt-3 sm:text-[11px]">
              *** UNDER CONSTRUCTION ***
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col border border-[#999] p-2 sm:p-3">
            <div className="text-[10px] font-bold sm:text-[14px]">Welcome to our web site!!!</div>
            <p className="mt-1 text-[8px] leading-snug text-black sm:mt-2 sm:text-[12px]">
              We are a family butchers based in Midleton Co. Cork. Please click the links on the
              left for more infomation about our produts. We have been in buisness for over 50
              years.
            </p>
            <p className="mt-1.5 hidden text-[8px] leading-snug text-black sm:mt-2 sm:block sm:text-[12px]">
              Opening Hours: Mon-Sat 8.00am till 6.00pm. Closed Sundays and bank holidays.
            </p>
            <div className="mt-2 grid min-h-0 flex-1 place-items-center border border-[#999] bg-[#eee] text-[7px] text-[#777] sm:mt-3 sm:text-[10px]">
              image not found
            </div>
          </div>
        </div>

        <div className="mt-2 hidden shrink-0 border-t border-[#c0c0c0] pt-1.5 text-center text-[7px] text-[#555] sm:mt-3 sm:block sm:text-[10px]">
          Best viewed in 1024x768 &nbsp;·&nbsp; Visitors: 0004213 &nbsp;·&nbsp; Last updated
          14/03/2011
        </div>
      </div>

      <span className="absolute bottom-2 left-2 rounded bg-black/65 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-white sm:bottom-4 sm:left-4 sm:text-[10px]">
        Before
      </span>
    </div>
  );
});

const NewPane = memo(function NewPane() {
  return (
    <div className="cmp-pane flex flex-col bg-[#F6F1E4] text-[#14342A]">
      <div className="flex shrink-0 items-center justify-between border-b border-[#14342A]/12 px-4 py-3 sm:px-7 sm:py-4">
        <span className="font-display text-sm font-extrabold uppercase tracking-tight sm:text-xl">
          Hartnett &amp; Sons
        </span>
        <span className="hidden items-center gap-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#14342A]/70 sm:flex">
          <span>Counter</span>
          <span>Story</span>
          <span>Visit</span>
        </span>
        <span className="rounded-full bg-[#14342A] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#F6F1E4] sm:px-4 sm:py-1.5 sm:text-[11px]">
          Order ahead
        </span>
      </div>

      <div className="grid flex-1 grid-cols-[1.05fr_0.95fr] gap-3 px-4 py-4 sm:gap-6 sm:px-7 sm:py-6">
        <div className="flex min-w-0 flex-col justify-center">
          <div className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#14342A]/60 sm:text-[11px]">
            Est. 1962 — Midleton, Co. Cork
          </div>
          <div className="mt-1.5 font-display text-[clamp(1.05rem,3.6vw,2.5rem)] font-black uppercase leading-[0.92] text-[#14342A] sm:mt-3">
            Cork&apos;s family
            <br />
            butcher since 1962
          </div>
          <div className="mt-2 text-[9px] leading-snug text-[#14342A]/75 sm:mt-4 sm:text-[14px]">
            Beef hung twenty-eight days. Cut by hand, at the block, every morning.
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:mt-5 sm:gap-3">
            <span className="rounded-md bg-[#14342A] px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-wider text-[#F6F1E4] sm:px-5 sm:py-2.5 sm:text-[11px]">
              Order for collection
            </span>
            <span className="rounded-md border border-[#14342A]/35 px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-wider sm:px-5 sm:py-2.5 sm:text-[11px]">
              Today&apos;s cuts
            </span>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-lg"
          style={{
            background:
              "linear-gradient(150deg, #1F4B3F 0%, #14342A 42%, #6B2F22 100%)",
          }}
        >
          <span className="absolute left-2 top-2 rounded-full bg-[#F6F1E4]/90 px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.18em] text-[#14342A] sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-[10px]">
            28-day dry-aged
          </span>
          <span className="absolute bottom-2 left-2 font-display text-[11px] font-extrabold uppercase leading-none text-[#F6F1E4] sm:bottom-4 sm:left-4 sm:text-[19px]">
            Sirloin
            <span className="ml-1.5 font-mono text-[8px] font-normal tracking-wider text-[#F6F1E4]/75 sm:ml-2.5 sm:text-[12px]">
              €22.50/kg
            </span>
          </span>
        </div>
      </div>

      <div className="hidden shrink-0 grid-cols-3 gap-2 px-4 pb-4 sm:grid sm:gap-3 sm:px-7 sm:pb-7">
        {["Dry-aged beef", "Free-range pork", "Made on site"].map((t) => (
          <span
            key={t}
            className="rounded-md border border-[#14342A]/15 bg-white/50 px-2 py-2 text-[8px] font-medium uppercase tracking-wider text-[#14342A]/80 sm:px-4 sm:py-3.5 sm:text-[11px]"
          >
            {t}
          </span>
        ))}
      </div>

      <span className="absolute bottom-2 right-2 rounded bg-[#14342A] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-[#F6F1E4] sm:bottom-4 sm:right-4 sm:text-[10px]">
        After
      </span>
    </div>
  );
});

function Compare() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [x, setX] = useState(48);
  const dragging = useRef(false);

  const fromClientX = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setX(Math.max(3, Math.min(97, pct)));
  };

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    fromClientX(e.clientX);
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    fromClientX(e.clientX);
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };
  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === "ArrowLeft") setX((v) => Math.max(3, v - step));
    else if (e.key === "ArrowRight") setX((v) => Math.min(97, v + step));
    else if (e.key === "Home") setX(3);
    else if (e.key === "End") setX(97);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={wrapRef}
      className="cmp aspect-[7/6] w-full rounded-lg border border-ink/15 shadow-[0_24px_60px_-30px_rgba(14,34,51,0.5)] sm:aspect-[3/2] lg:aspect-[16/10]"
      style={{ "--x": `${x}%` } as CSSProperties}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <OldPane />
      <div className="cmp-pane cmp-after">
        <NewPane />
      </div>
      <div className="cmp-bar" aria-hidden="true" />
      <div
        className="cmp-grip"
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare an old website with one we build"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(x)}
        aria-valuetext={`${Math.round(x)}% of the new site shown`}
        onKeyDown={onKey}
      >
        <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
          <path
            d="M7.5 2 L2.5 7 L7.5 12 M12.5 2 L17.5 7 L12.5 12"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

const FAULTS = [
  {
    n: "01",
    t: "No site at all",
    d: "Customers search, find nothing, and assume you're not trading or not serious.",
  },
  {
    n: "02",
    t: "Built years ago",
    d: "Outdated design, broken layout on mobile, no way to update it without ringing someone.",
  },
  {
    n: "03",
    t: "Slow and cluttered",
    d: "Heavy templates that take ten seconds to load lose visitors before they see anything.",
  },
];

function Problem() {
  return (
    <section id="problem" className="scroll-mt-24 bg-sand py-20 md:py-28">
      <Shell marker="Skerries 53.5747°N">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <h2 className="max-w-3xl text-[clamp(2rem,4.8vw,3.5rem)] text-ink">
            <RiseLine i={0}>Most small business</RiseLine>
            <RiseLine i={1}>
              websites are working <span className="text-rust">against</span> them.
            </RiseLine>
          </h2>
          <Drift i={2}>
            <p className="max-w-md text-base text-slate md:text-lg">
              Slow to load, broken on phones, three years out of date, or simply missing. Every one
              of those is a customer who gave up and rang a competitor instead.
            </p>
            <p className="eyebrow mt-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rust" />
              Drag the handle
            </p>
          </Drift>
        </div>

        <Drift className="mt-10">
          <Compare />
        </Drift>

        <ul className="mt-14 border-t border-ink/12">
          {FAULTS.map((f, i) => (
            <Drift
              as="li"
              key={f.n}
              i={i}
              className="grid items-baseline gap-2 border-b border-ink/12 py-6 md:grid-cols-[80px_minmax(0,300px)_1fr] md:gap-8 md:py-7"
            >
              <span className="font-mono text-sm text-teal">{f.n}</span>
              <h3 className="text-2xl text-ink md:text-3xl">{f.t}</h3>
              <p className="max-w-xl text-sm text-slate md:text-base">{f.d}</p>
            </Drift>
          ))}
        </ul>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Work — the live example, resizable
 * ------------------------------------------------------------------ */
const VIEWS = [
  { id: "desktop", label: "Desktop", w: "100%" },
  { id: "tablet", label: "Tablet", w: "834px" },
  { id: "phone", label: "Phone", w: "390px" },
] as const;

function Work() {
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("desktop");
  const current = VIEWS.find((v) => v.id === view) ?? VIEWS[0];

  return (
    <section id="work" className="scroll-mt-24 bg-ink text-paper">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 lg:pl-28 lg:pr-8 md:py-28">
        <Drift className="mb-9 flex items-center gap-3">
          <span className="h-px w-8 bg-teal" />
          <span className="eyebrow text-teal">Greystones 53.1424°N</span>
        </Drift>

        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="text-[clamp(2rem,5.2vw,3.9rem)] text-paper">
            <RiseLine i={0}>A whole site, not</RiseLine>
            <RiseLine i={1}>
              a <span className="text-teal">thumbnail</span>.
            </RiseLine>
          </h2>
          <Drift i={2} className="max-w-md">
            <p className="text-base text-paper/70 md:text-lg">
              This is a real build for a fictional Cork butcher — running live below, in the page.
              Scroll it, poke it, then squash it down to a phone and watch it hold together.
            </p>
          </Drift>
        </div>

        <Drift className="mt-10">
          <div className="rounded-lg border border-paper/15 bg-paper/5 p-2 sm:p-3">
            {/* browser chrome */}
            <div className="mb-2 flex items-center gap-3 px-2 py-1.5 sm:mb-3">
              <span className="flex shrink-0 gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
              </span>
              <span className="min-w-0 flex-1 truncate rounded-full bg-paper/8 px-3 py-1 text-center font-mono text-[10px] tracking-wider text-paper/55 sm:text-xs">
                hartnettbutchers.ie
              </span>
              <div
                className="hidden shrink-0 gap-1 rounded-full bg-paper/8 p-1 sm:flex"
                role="group"
                aria-label="Preview width"
              >
                {VIEWS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setView(v.id)}
                    aria-pressed={view === v.id}
                    className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors sm:px-3.5 sm:text-[10px] ${
                      view === v.id
                        ? "bg-teal text-ink"
                        : "text-paper/60 hover:bg-paper/10 hover:text-paper"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="device overflow-hidden rounded-md bg-paper"
              style={{ maxWidth: current.w }}
            >
              <iframe
                src="/examples/hartnett-butchers.html"
                title="Hartnett & Sons Butchers — a full example site we built"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                className="block h-[520px] w-full border-0 md:h-[720px]"
              />
            </div>
          </div>
        </Drift>

        <Drift className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
          <a
            href="/examples/hartnett-butchers"
            target="_blank"
            rel="noopener noreferrer"
            className="wipe inline-flex items-center gap-2 pb-0.5 text-sm font-semibold uppercase tracking-wide text-teal"
          >
            Open it full size <span aria-hidden="true">↗</span>
          </a>
          <span className="eyebrow text-paper/45">
            Concept build · Hartnett &amp; Sons, Midleton, Co. Cork
          </span>
        </Drift>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Who we are
 * ------------------------------------------------------------------ */
function Who() {
  const { data: content } = useSiteContent();
  return (
    <section id="who" className="scroll-mt-24 py-20 md:py-28">
      <Shell marker="Malahide 53.4508°N">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
          <div aria-hidden="true" className="font-display text-7xl leading-[0.6] text-teal md:text-9xl">
            &ldquo;
          </div>
          <div>
            <Drift>
              <blockquote className="max-w-3xl font-display text-[clamp(1.5rem,3.4vw,2.75rem)] font-extrabold uppercase leading-[1.06] text-ink">
                {content.who_we_are}
              </blockquote>
            </Drift>
            <Drift i={1} className="mt-8 flex flex-wrap items-center gap-4">
              <span className="h-px w-10 bg-ink/30" />
              <span className="eyebrow">The two of us — East Coast Digital</span>
            </Drift>
          </div>
        </div>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Process
 * ------------------------------------------------------------------ */
function Process() {
  const { data: content } = useSiteContent();
  const steps = [
    { n: "01", stage: content.process_1_stage, head: content.process_1_head, body: content.process_1_body },
    { n: "02", stage: content.process_2_stage, head: content.process_2_head, body: content.process_2_body },
    { n: "03", stage: content.process_3_stage, head: content.process_3_head, body: content.process_3_body },
  ];
  return (
    <section id="process" className="scroll-mt-24 bg-sand py-20 md:py-28">
      <Shell marker="Wicklow 52.9808°N">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="text-[clamp(2rem,5.2vw,3.9rem)] text-ink">
            <RiseLine i={0}>How it runs</RiseLine>
          </h2>
          <Drift i={1} className="max-w-md">
            <p className="text-base text-slate md:text-lg">
              Three stages. No jargon, no waiting six weeks to see a first draft.
            </p>
          </Drift>
        </div>

        <div className="relative mt-16">
          {/* the passage line */}
          <div
            aria-hidden="true"
            className="absolute left-[7px] top-2 bottom-2 w-px border-l border-dashed border-ink/25 md:left-0 md:right-0 md:top-[7px] md:bottom-auto md:h-px md:w-auto md:border-l-0 md:border-t md:border-dashed"
          />
          <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <Drift as="li" key={s.n} i={i} className="relative pl-9 md:pl-0">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-ink bg-sand md:relative md:top-0 md:block"
                />
                <div className="md:mt-7">
                  <span className="numeral font-display text-6xl font-black md:text-7xl">{s.n}</span>
                  <h3 className="-mt-3 font-display text-4xl font-black uppercase text-teal md:text-5xl">
                    {s.stage}
                  </h3>
                  <div className="mt-4 font-display text-xl font-extrabold uppercase leading-tight text-ink md:text-2xl">
                    {s.head}
                  </div>
                  <p className="mt-3 max-w-sm text-sm text-slate md:text-base">{s.body}</p>
                </div>
              </Drift>
            ))}
          </ol>
        </div>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Pricing — one ticket
 * ------------------------------------------------------------------ */
const INCLUDED = [
  "Custom design built around your business",
  "Written for your customers, not filler text",
  "Fast and readable on every phone",
  "Contact form straight to your inbox",
  "Domain and hosting set up for you",
  "Live within a week",
];

function Pricing() {
  const { data: content } = useSiteContent();
  return (
    <section id="pricing" className="scroll-mt-24 py-20 md:py-28">
      <Shell marker="Arklow 52.7956°N">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="text-[clamp(2rem,5.2vw,3.9rem)] text-ink">
            <RiseLine i={0}>One site. One price.</RiseLine>
          </h2>
          <Drift i={1} className="max-w-md">
            <p className="text-base text-slate md:text-lg">
              No tiers, no upsells, no hourly surprises. Agreed before any work starts.
            </p>
          </Drift>
        </div>

        <Drift className="mt-12">
          <div className="relative overflow-hidden rounded-lg bg-ink text-paper shadow-[0_30px_70px_-34px_rgba(14,34,51,0.75)]">
            <span className="ticket-notch hidden md:block" style={{ top: -13, right: 247 }} aria-hidden="true" />
            <span className="ticket-notch hidden md:block" style={{ bottom: -13, right: 247 }} aria-hidden="true" />

            <div className="grid md:grid-cols-[1fr_260px]">
              <div className="p-8 md:p-12">
                <div className="eyebrow text-teal">A complete website</div>
                <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-1">
                  <span className="font-mono text-[clamp(3rem,9vw,5.5rem)] font-medium leading-none text-paper">
                    {content.price}
                  </span>
                  <span className="pb-2 text-sm text-paper/60">one-off, all in</span>
                </div>
                <p className="mt-4 max-w-md text-sm text-paper/70 md:text-base">
                  Then €30 a month for hosting, updates and someone at the end of the phone.
                </p>

                <ul className="mt-9 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {INCLUDED.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-paper/90">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        className="mt-1 shrink-0"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 7.5 L5.5 11 L12 3"
                          fill="none"
                          stroke="var(--teal)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Magnet
                  href="#contact"
                  className="mt-10 inline-block rounded-md bg-teal px-7 py-4 text-sm font-semibold uppercase tracking-wide text-ink"
                >
                  Start yours
                </Magnet>
              </div>

              {/* stub */}
              <div className="border-t border-dashed border-paper/25 p-8 md:border-l md:border-t-0 md:p-10">
                <div className="eyebrow text-paper/45">Admit one</div>
                <dl className="mt-6 space-y-5">
                  {[
                    ["Build", content.price],
                    ["Hosting", "€30/mo"],
                    ["Live in", "7 days"],
                    ["Templates used", "None"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="eyebrow text-paper/45">{k}</dt>
                      <dd className="mt-1 font-mono text-lg text-paper">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-9 flex h-9 items-end gap-[3px]" aria-hidden="true">
                  {[3, 1, 2, 1, 4, 1, 2, 3, 1, 1, 3, 2, 1, 4, 1, 2, 1, 3].map((w, i) => (
                    <span
                      key={i}
                      className="block h-full bg-paper/35"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <div className="mt-3 font-mono text-[10px] tracking-[0.2em] text-paper/35">
                  ECD-{content.price.replace(/[^\d]/g, "") || "500"}-IE
                </div>
              </div>
            </div>
          </div>
        </Drift>

        <Drift className="mt-8">
          <p className="max-w-2xl text-sm text-slate">
            Need an online shop, a booking system, or something bigger? We'll talk it through and
            quote separately — same flat-fee way.
          </p>
        </Drift>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Contact
 * ------------------------------------------------------------------ */
function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-slate">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-ink/20 bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-slate/60 focus:border-teal focus:outline-none"
      />
    </div>
  );
}

function Contact() {
  const { data: content } = useSiteContent();
  const [sent, setSent] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitEnquiry = useServerFn(sendContactEnquiry);

  useEffect(() => {
    if (!sent) return;
    const t1 = setTimeout(() => setLeaving(true), 5000);
    const t2 = setTimeout(() => {
      setSent(false);
      setLeaving(false);
    }, 5450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [sent]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSending(true);
    setError(null);
    try {
      await submitEnquiry({
        data: {
          name: String(fd.get("name") ?? ""),
          business: String(fd.get("business") ?? ""),
          email: String(fd.get("email") ?? ""),
          message: String(fd.get("msg") ?? ""),
        },
      });
      form.reset();
      setSent(true);
    } catch {
      setError("Something went wrong sending that. Please call or email us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 bg-sand py-20 md:py-28">
      <Shell marker="Next stop — your business">
        <h2 className="text-[clamp(2rem,5.2vw,3.9rem)] text-ink">
          <RiseLine i={0}>Tell us about</RiseLine>
          <RiseLine i={1}>the business.</RiseLine>
        </h2>
        <Drift i={2} className="mt-6 max-w-xl">
          <p className="text-base text-slate md:text-lg">{content.contact_subtext}</p>
        </Drift>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Drift>
            <a
              href={telHref(content.phone)}
              className="block whitespace-nowrap font-display text-[clamp(1.85rem,5vw,3.5rem)] font-black uppercase leading-none text-ink transition-colors hover:text-teal"
            >
              {content.phone}
            </a>
            <p className="eyebrow mt-4">Ring us — we answer</p>

            <dl className="mt-12 space-y-6 border-t border-ink/12 pt-8">
              <div>
                <dt className="eyebrow">Email</dt>
                <dd className="mt-1.5">
                  <a href={`mailto:${content.email}`} className="wipe pb-0.5 text-lg text-ink">
                    {content.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Based</dt>
                <dd className="mt-1.5 text-lg text-slate">
                  Ireland's east coast — working nationwide
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Hours</dt>
                <dd className="mt-1.5 text-lg text-slate">
                  Weekdays 9–6, and most evenings if you catch us
                </dd>
              </div>
            </dl>
          </Drift>

          <Drift i={1}>
            {sent ? (
              <div
                role="status"
                aria-live="polite"
                className={`rounded-lg border-2 border-teal bg-paper p-8 text-center ${
                  leaving ? "success-block-leaving" : "success-block"
                }`}
              >
                <div className="eyebrow text-teal">Received</div>
                <div className="relative mx-auto mt-6 flex h-12 w-12 items-center justify-center">
                  <span
                    aria-hidden="true"
                    className="success-ring absolute h-6 w-6 rounded-full border-2 border-teal"
                  />
                  <span
                    aria-hidden="true"
                    className="success-ring success-ring-2 absolute h-6 w-6 rounded-full border-2 border-teal"
                  />
                  <span aria-hidden="true" className="success-dot relative h-3 w-3 rounded-full bg-teal" />
                </div>
                <p className="success-text mt-5 font-display text-xl font-extrabold uppercase text-ink">
                  Thanks — we'll be in touch shortly.
                </p>
                <p className="success-subtext eyebrow mt-3 block">Usually within a day</p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="space-y-3 rounded-lg border border-ink/12 bg-paper p-6 shadow-[0_20px_50px_-32px_rgba(14,34,51,0.55)] md:p-7"
              >
                <div className="eyebrow">Or send a message</div>
                <Field label="Name" name="name" required />
                <Field label="Business name" name="business" required />
                <Field label="Email" name="email" type="email" required />
                <div>
                  <label
                    htmlFor="msg"
                    className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-slate"
                  >
                    What do you need?
                  </label>
                  <textarea
                    id="msg"
                    name="msg"
                    rows={4}
                    required
                    placeholder="e.g. We don't have a site yet, or ours is old and hard to update..."
                    className="w-full rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm text-ink placeholder:text-slate/60 focus:border-teal focus:outline-none"
                  />
                </div>
                {error && <p className="text-sm text-rust">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="fillup w-full rounded-md border-2 border-ink px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:text-paper disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send enquiry"}
                </button>
              </form>
            )}
          </Drift>
        </div>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Footer
 * ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="relative">
      <div className="bg-sand">
        <Tide />
      </div>
      <div className="bg-ink pb-10 pt-4 text-paper">
        <div className="overflow-hidden px-5 lg:pl-28 lg:pr-8">
          <div className="whitespace-nowrap font-display text-[clamp(2.6rem,13.5vw,12rem)] font-black uppercase leading-[0.85] tracking-tight text-paper">
            East<span className="text-teal">Coast</span> Digital
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between lg:pl-28 lg:pr-8">
          <span className="eyebrow text-paper/45">
            © 2026 East Coast Digital — built on the east coast, for businesses everywhere in
            Ireland
          </span>
          <a href="#top" className="wipe eyebrow pb-0.5 text-paper/70">
            Back to the top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */
function Index() {
  return (
    <div className="grain min-h-screen bg-paper text-ink">
      <CoastRail />
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Problem />
        <div className="bg-sand">
          <Tide />
        </div>
        <Work />
        <div className="bg-paper">
          <Tide flip />
        </div>
        <Who />
        <Process />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

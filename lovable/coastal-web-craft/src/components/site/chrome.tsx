import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSiteContent, telHref } from "@/lib/site-content";
import { sendContactEnquiry } from "@/lib/contact.functions";

/* ------------------------------------------------------------------ *
 * Shared chrome and motion primitives.
 * The header, the footer and the reveal helpers are used by every
 * page, so they live here rather than inside the home route.
 * ------------------------------------------------------------------ */

export const delay = (i: number) => ({ "--i": i }) as unknown as CSSProperties;

/* ------------------------------------------------------------------ *
 * Reveal helpers
 * ------------------------------------------------------------------ */
export function useInView<T extends Element>(cls: string) {
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
export function RiseLine({ children, i = 0 }: { children: ReactNode; i?: number }) {
  const ref = useInView<HTMLSpanElement>("rise-in");
  return (
    <span ref={ref} className="rise block" style={delay(i)}>
      <span>{children}</span>
    </span>
  );
}

/** A block that fades and drifts up once. */
export function Drift({
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
 * Tide — the boundary between a paper section and an ink one.
 * Two tiles, 1200 units wide each, drifting at different rates.
 * ------------------------------------------------------------------ */
const TIDE_A =
  "M0,44 C160,12 300,74 600,48 C900,22 1050,70 1200,44 L1200,90 L0,90 Z " +
  "M1200,44 C1360,12 1500,74 1800,48 C2100,22 2250,70 2400,44 L2400,90 L1200,90 Z";
const TIDE_B =
  "M0,58 C220,30 340,84 620,58 C880,34 1020,80 1200,58 L1200,90 L0,90 Z " +
  "M1200,58 C1420,30 1540,84 1820,58 C2080,34 2220,80 2400,58 L2400,90 L1200,90 Z";

export function Tide({ flip = false }: { flip?: boolean }) {
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
export function Shell({
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
export function Magnet({
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
export function Nav() {
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
    { to: "/work", label: "Work" },
    { to: "/process", label: "Process" },
    { to: "/pricing", label: "Pricing" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-ink/10 bg-paper/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 lg:pl-28 lg:pr-8">
        <Link
          to="/"
          className="shrink-0 font-display text-xl font-extrabold uppercase tracking-tight text-ink"
        >
          East<span className="text-teal">Coast</span> Digital
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-ink" }}
              className="wipe whitespace-nowrap pb-0.5 text-sm font-medium text-slate transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={telHref(content.phone)}
            className="wipe hidden whitespace-nowrap pb-0.5 font-mono text-xs tracking-wider text-ink lg:block"
          >
            {content.phone}
          </a>
          <Link
            to="/contact"
            className="whitespace-nowrap rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5"
          >
            Get a quote
          </Link>
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
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-slate hover:bg-sand"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={telHref(content.phone)}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 font-mono text-xs tracking-wider text-ink hover:bg-sand"
            >
              {content.phone}
            </a>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-ink px-4 py-3 text-center text-sm font-semibold text-paper"
            >
              Get a quote
            </Link>
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

export function Field({
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

/* ------------------------------------------------------------------ *
 * The enquiry form and its confirmation state. Used on the home page
 * and on /contact, so it owns its own state and lives here.
 * ------------------------------------------------------------------ */
export function EnquiryForm() {
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
    <>
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
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Page furniture shared by the inner pages.
 * ------------------------------------------------------------------ */
export function PageHero({
  marker,
  title,
  lede,
}: {
  marker: string;
  title: ReactNode;
  lede: string;
}) {
  return (
    <section className="pb-14 pt-12 md:pb-20 md:pt-20">
      <Shell marker={marker}>
        <h1 className="max-w-4xl text-[clamp(2.3rem,6.2vw,4.75rem)] font-black leading-[1.02] text-ink">
          {title}
        </h1>
        <Drift i={2} className="mt-7 max-w-2xl">
          <p className="text-lg text-slate md:text-xl">{lede}</p>
        </Drift>
      </Shell>
    </section>
  );
}

/** The closing ask. Sand, so the footer's tide still reads underneath it. */
export function EndCTA({ heading, blurb }: { heading: string; blurb: string }) {
  const { data: content } = useSiteContent();
  return (
    <section className="bg-sand py-16 md:py-24">
      <Shell marker="Next stop — your business">
        <div className="grid gap-9 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <h2 className="max-w-xl text-[clamp(1.9rem,4.6vw,3.4rem)] text-ink">
              <RiseLine i={0}>{heading}</RiseLine>
            </h2>
            <Drift i={1} className="mt-5 max-w-lg">
              <p className="text-base text-slate md:text-lg">{blurb}</p>
            </Drift>
          </div>
          <Drift i={2} className="flex flex-wrap items-center gap-3">
            <Magnet
              href={telHref(content.phone)}
              className="inline-block rounded-md bg-ink px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-paper"
            >
              Ring {content.phone}
            </Magnet>
            <Link
              to="/contact"
              className="fillup inline-block rounded-md border-2 border-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:text-paper"
            >
              Send a message
            </Link>
          </Drift>
        </div>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Footer — the wordmark, plus the details a real company puts in one:
 * where to reach us, where we are, and what the pages are.
 * ------------------------------------------------------------------ */
const FOOTER_PAGES = [
  { to: "/work", label: "Work" },
  { to: "/process", label: "Process" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

export function Footer() {
  const { data: content } = useSiteContent();
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

        <div className="mx-auto mt-10 grid max-w-6xl gap-9 px-5 sm:grid-cols-3 lg:pl-28 lg:pr-8">
          <div>
            <div className="eyebrow text-teal">Pages</div>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_PAGES.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="wipe pb-0.5 text-sm text-paper/85 hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow text-teal">Get in touch</div>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={telHref(content.phone)} className="wipe pb-0.5 text-sm text-paper/85 hover:text-paper">
                  {content.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${content.email}`} className="wipe pb-0.5 text-sm text-paper/85 hover:text-paper">
                  {content.email}
                </a>
              </li>
              <li className="text-sm text-paper/60">Weekdays 9–6</li>
            </ul>
          </div>

          <div>
            <div className="eyebrow text-teal">Where</div>
            <address className="mt-4 space-y-1 text-sm not-italic text-paper/85">
              <div>Ireland&apos;s east coast</div>
              <div className="text-paper/60">Working nationwide</div>
            </address>
            <div className="eyebrow mt-4 block text-paper/40">53.3498°N, 6.2603°W</div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-4 border-t border-paper/12 px-5 pt-7 sm:flex-row sm:items-center sm:justify-between lg:pl-28 lg:pr-8">
          <span className="eyebrow text-paper/45">
            © 2026 East Coast Digital — built on the east coast, for businesses everywhere in
            Ireland
          </span>
          <Link to="/" hash="top" className="wipe eyebrow pb-0.5 text-paper/70">
            Back to the top ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}

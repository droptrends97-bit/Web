import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Drift,
  EndCTA,
  Footer,
  Nav,
  PageHero,
  RiseLine,
  Shell,
  Tide,
} from "@/components/site/chrome";
import { pageHead } from "@/lib/seo";

const TITLE = "Our work — a full example build | East Coast Digital";
const DESCRIPTION =
  "See a complete site we built for a Cork family butcher, running live in the page and resizable down to a phone. Not a thumbnail — the whole thing.";

export const Route = createFileRoute("/work")({
  head: () => pageHead({ path: "/work", title: TITLE, description: DESCRIPTION }),
  component: WorkPage,
});

const VIEWS = [
  { id: "desktop", label: "Desktop", w: "100%" },
  { id: "tablet", label: "Tablet", w: "834px" },
  { id: "phone", label: "Phone", w: "390px" },
] as const;

const BUILT = [
  {
    n: "01",
    t: "A hero you can rub away",
    d: "Drag a finger or the cursor across the top of the page and the colour wipes off to reveal the photograph underneath, then heals back over behind you. Hand-written on a canvas — no library, and it works the same on an iPad as it does on a desktop.",
  },
  {
    n: "02",
    t: "Order for collection, end to end",
    d: "Pick cuts, set weights, choose a collection slot from a real calendar that knows the shop is shut on Sundays, and get a confirmation. The whole flow works — it is not a picture of a form.",
  },
  {
    n: "03",
    t: "Opening hours that know the time",
    d: "The shop's status reads Open or Closed based on the actual hour you are looking at it, and tells you when it next opens. Small thing. It is the first thing a customer wants to know.",
  },
  {
    n: "04",
    t: "Built to be read on a phone",
    d: "Every layout is drawn for the small screen first and then allowed to grow. Use the toggles above and watch it hold its shape — nothing reflows into a mess, nothing needs pinching.",
  },
];

function WorkPage() {
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("desktop");
  const current = VIEWS.find((v) => v.id === view) ?? VIEWS[0];

  return (
    <div className="grain min-h-screen bg-paper text-ink">
      <Nav />
      <main>
        <PageHero
          marker="Greystones 53.1424°N"
          title={
            <>
              <RiseLine i={0}>A whole site,</RiseLine>
              <RiseLine i={1}>
                not a <span className="text-teal">thumbnail</span>.
              </RiseLine>
            </>
          }
          lede="Most studios show you a screenshot and ask you to imagine the rest. Here is a complete build, running live in the page below. Scroll it, poke it, then squash it down to a phone and watch it hold together."
        />

        <Tide />

        <section className="bg-ink text-paper">
          <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20 lg:pl-28 lg:pr-8">
            <Drift>
              <div className="rounded-lg border border-paper/15 bg-paper/5 p-2 sm:p-3">
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

                <div className="device overflow-hidden rounded-md bg-paper" style={{ maxWidth: current.w }}>
                  <iframe
                    src="/examples/hartnett-butchers.html"
                    title="Hartnett & Sons Butchers — a full example site we built"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                    className="block h-[520px] w-full border-0 md:h-[760px]"
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
                Hartnett &amp; Sons · Family butcher · Midleton, Co. Cork
              </span>
            </Drift>
          </div>
        </section>

        <div className="bg-paper">
          <Tide flip />
        </div>

        <section className="py-16 md:py-24">
          <Shell marker="What is actually in it">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <h2 className="text-[clamp(1.9rem,4.6vw,3.4rem)] text-ink">
                <RiseLine i={0}>Everything on that page</RiseLine>
                <RiseLine i={1}>was built by hand.</RiseLine>
              </h2>
              <Drift i={2} className="max-w-md">
                <p className="text-base text-slate md:text-lg">
                  No page builder, no bought theme, nothing dragged in from a marketplace. That is
                  why it loads fast and why it does not look like the other four butchers in the
                  county.
                </p>
              </Drift>
            </div>

            <ul className="mt-14 border-t border-ink/12">
              {BUILT.map((b, i) => (
                <Drift
                  as="li"
                  key={b.n}
                  i={Math.min(i, 3)}
                  className="grid items-baseline gap-2 border-b border-ink/12 py-6 md:grid-cols-[80px_minmax(0,320px)_1fr] md:gap-8 md:py-7"
                >
                  <span className="font-mono text-sm text-teal">{b.n}</span>
                  <h3 className="text-2xl text-ink md:text-3xl">{b.t}</h3>
                  <p className="max-w-xl text-sm text-slate md:text-base">{b.d}</p>
                </Drift>
              ))}
            </ul>
          </Shell>
        </section>

        <section className="pb-16 md:pb-24">
          <Shell marker="Being straight with you">
            <Drift>
              <div className="max-w-3xl rounded-lg border-l-2 border-rust bg-sand/60 p-7 md:p-9">
                <h2 className="text-2xl text-ink md:text-3xl">This one is a concept build</h2>
                <p className="mt-4 text-base leading-relaxed text-slate md:text-lg">
                  Hartnett &amp; Sons is not a real shop. We built the site to show what we would do
                  for a butcher, a physio, a plumber — anyone running a small business who needs
                  people to find them and get in touch. It is the standard of work you would get, on
                  a business we invented so nobody's real trade is being used as a shop window.
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate md:text-lg">
                  We would rather tell you that than dress up a mockup as a client. Real client work
                  goes up here as it lands.
                </p>
              </div>
            </Drift>
          </Shell>
        </section>

        <EndCTA
          heading="Want one that looks like it was made for you?"
          blurb="Tell us what the business does and who you are trying to reach. We will tell you what we would build and what it costs, on the call."
        />
      </main>
      <Footer />
    </div>
  );
}

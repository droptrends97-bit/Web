import { createFileRoute } from "@tanstack/react-router";
import {
  Drift,
  EndCTA,
  Footer,
  Nav,
  PageHero,
  RiseLine,
  Shell,
} from "@/components/site/chrome";
import { useSiteContent } from "@/lib/site-content";
import { pageHead } from "@/lib/seo";

const TITLE = "How we work — from a call to live in a week | East Coast Digital";
const DESCRIPTION =
  "Three stages: a short call about the business, a build you can watch happen, then live with the keys handed over. Usually under a week, start to finish.";

export const Route = createFileRoute("/process")({
  head: () => pageHead({ path: "/process", title: TITLE, description: DESCRIPTION }),
  component: ProcessPage,
});

const DETAIL = [
  {
    n: "01",
    when: "Day one, about twenty minutes",
    need: ["What the business does", "Who you want ringing you", "Anything you already have — logo, photos, a domain"],
    happens:
      "A phone call, not a meeting. We ask what you do, who your customers are, and what the site actually needs to achieve — bookings, calls, enquiries, or just being findable when someone searches your name. By the end of it you will have a price and a date, both fixed.",
  },
  {
    n: "02",
    when: "Days two to five",
    need: ["Photos if you have them", "A read of the draft copy", "One round of honest feedback"],
    happens:
      "We design and build, and you get a link to the real thing early — a working draft you can open on your phone, not a picture of one. Tell us what to change and we change it while you are on the phone. There is no big reveal at the end, because you have been watching it the whole way.",
  },
  {
    n: "03",
    when: "Day six or seven",
    need: ["Your domain details, if you already have one"],
    happens:
      "Domain connected, hosting and the certificate set up, the contact form pointed at your inbox, and the site submitted to Google. Then a five-minute walkthrough so you can change your own text and photos. Anything you cannot fix yourself, ring us — that is what the monthly covers.",
  },
];

function ProcessPage() {
  const { data: content } = useSiteContent();
  const stages = [content.process_1_stage, content.process_2_stage, content.process_3_stage];
  const heads = [content.process_1_head, content.process_2_head, content.process_3_head];

  return (
    <div className="grain min-h-screen bg-paper text-ink">
      <Nav />
      <main>
        <PageHero
          marker="Wicklow 52.9808°N"
          title={
            <>
              <RiseLine i={0}>How it runs.</RiseLine>
            </>
          }
          lede="Three stages, no jargon, and no waiting six weeks to see a first draft. Most businesses we build for are live inside a week of the first phone call."
        />

        <section className="bg-sand py-16 md:py-24">
          <Shell marker="Stage by stage">
            <ol className="space-y-14 md:space-y-20">
              {DETAIL.map((d, i) => (
                <Drift as="li" key={d.n} i={Math.min(i, 2)}>
                  <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] md:gap-14">
                    <div>
                      <span className="numeral font-display text-7xl font-black md:text-8xl">{d.n}</span>
                      <h2 className="-mt-3 font-display text-4xl font-black uppercase text-teal md:text-6xl">
                        {stages[i]}
                      </h2>
                      <div className="eyebrow mt-4 block">{d.when}</div>
                    </div>

                    <div>
                      <h3 className="font-display text-2xl font-extrabold uppercase leading-tight text-ink md:text-3xl">
                        {heads[i]}
                      </h3>
                      <p className="mt-4 max-w-xl text-base leading-relaxed text-slate md:text-lg">
                        {d.happens}
                      </p>
                      <div className="mt-7">
                        <div className="eyebrow">What we need from you</div>
                        <ul className="mt-3 space-y-2">
                          {d.need.map((x) => (
                            <li key={x} className="flex items-start gap-3 text-sm text-slate md:text-base">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-teal" aria-hidden="true" />
                              <span>{x}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Drift>
              ))}
            </ol>
          </Shell>
        </section>

        <section className="py-16 md:py-24">
          <Shell marker="And after that">
            <div className="grid gap-9 lg:grid-cols-[1fr_1fr] lg:gap-16">
              <div>
                <h2 className="text-[clamp(1.9rem,4.6vw,3.4rem)] text-ink">
                  <RiseLine i={0}>We do not</RiseLine>
                  <RiseLine i={1}>disappear.</RiseLine>
                </h2>
                <Drift i={2} className="mt-6 max-w-lg">
                  <p className="text-base leading-relaxed text-slate md:text-lg">
                    The thirty a month is not a maintenance plan with a ticket queue. It is two
                    people who answer the phone. Prices changed, new photos, a paragraph that reads
                    badly, closed for a week in August — ring us and it is done the same day.
                  </p>
                </Drift>
              </div>

              <Drift i={1}>
                <dl className="divide-y divide-ink/12 border-y border-ink/12">
                  {[
                    ["Small text and photo changes", "Same day, included"],
                    ["Hosting, certificate, backups", "Included"],
                    ["A new page or section", "Quoted, flat fee"],
                    ["A shop or booking system", "Quoted separately"],
                    ["Leaving us", "A month's notice, files handed over"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-6 py-4">
                      <dt className="text-sm text-ink md:text-base">{k}</dt>
                      <dd className="shrink-0 font-mono text-xs tracking-wide text-slate md:text-sm">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Drift>
            </div>
          </Shell>
        </section>

        <EndCTA
          heading="Start with the call."
          blurb="Twenty minutes on the phone and you will know what we would build, what it costs and when it would be live. No obligation and no follow-up sequence."
        />
      </main>
      <Footer />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import {
  Drift,
  EnquiryForm,
  Footer,
  Nav,
  PageHero,
  RiseLine,
  Shell,
} from "@/components/site/chrome";
import { useSiteContent, telHref } from "@/lib/site-content";
import { pageHead } from "@/lib/seo";

const TITLE = "Contact — get a quote | East Coast Digital";
const DESCRIPTION =
  "Ring us or send a few details about the business and we will come back with a fixed price within a day or two. Based on Ireland's east coast, working nationwide.";

export const Route = createFileRoute("/contact")({
  head: () => pageHead({ path: "/contact", title: TITLE, description: DESCRIPTION }),
  component: ContactPage,
});

const NEXT = [
  {
    n: "01",
    t: "We ring you back",
    d: "Usually the same day, always within two working days. Twenty minutes, no pitch deck.",
  },
  {
    n: "02",
    t: "You get a price and a date",
    d: "Both fixed, both in writing, before anyone starts. If we are not the right fit we will say so.",
  },
  {
    n: "03",
    t: "You see it being built",
    d: "A link to the real thing within a couple of days, not a mockup at the end of a month.",
  },
];

function ContactPage() {
  const { data: content } = useSiteContent();

  return (
    <div className="grain min-h-screen bg-paper text-ink">
      <Nav />
      <main>
        <PageHero
          marker="Next stop — your business"
          title={
            <>
              <RiseLine i={0}>Tell us about</RiseLine>
              <RiseLine i={1}>the business.</RiseLine>
            </>
          }
          lede={content.contact_subtext}
        />

        <section className="pb-16 md:pb-24">
          <Shell marker="Two ways to reach us">
            <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
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
                      Ireland&apos;s east coast — working nationwide
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
                <EnquiryForm />
              </Drift>
            </div>
          </Shell>
        </section>

        <section className="bg-sand py-16 md:py-24">
          <Shell marker="What happens next">
            <h2 className="text-[clamp(1.9rem,4.6vw,3.4rem)] text-ink">
              <RiseLine i={0}>No black hole.</RiseLine>
            </h2>
            <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {NEXT.map((s, i) => (
                <Drift as="li" key={s.n} i={i}>
                  <span className="font-mono text-sm text-teal">{s.n}</span>
                  <h3 className="mt-3 text-2xl text-ink md:text-3xl">{s.t}</h3>
                  <p className="mt-3 max-w-sm text-sm text-slate md:text-base">{s.d}</p>
                </Drift>
              ))}
            </ol>
          </Shell>
        </section>
      </main>
      <Footer />
    </div>
  );
}

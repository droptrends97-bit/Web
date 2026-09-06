import { createFileRoute } from "@tanstack/react-router";
import {
  Drift,
  EndCTA,
  Footer,
  Magnet,
  Nav,
  PageHero,
  RiseLine,
  Shell,
} from "@/components/site/chrome";
import { useSiteContent } from "@/lib/site-content";
import { pageHead, SITE_URL } from "@/lib/seo";

const TITLE = "Pricing — €500 for a complete website | East Coast Digital";
const DESCRIPTION =
  "One price, agreed before any work starts. €500 to build your website, €30 a month for hosting, updates and support. No tiers, no hourly surprises.";

const FAQ: { q: string; a: string }[] = [
  {
    q: "What exactly do I get for €500?",
    a: "A complete website, designed around your business rather than dropped into a template. However many pages you actually need — for most small businesses that is somewhere between one and six. Written for your customers, not filled with placeholder text. Set up on your domain with hosting configured, a contact form that lands in your inbox, and the basics done properly so you can be found. One flat fee, agreed before we start.",
  },
  {
    q: "What is the €30 a month for, and can I stop it?",
    a: "Hosting, the SSL certificate, backups, keeping the thing patched, and us making small changes when you ring — new prices, new photos, changed opening hours, a paragraph rewritten. It is not a contract. Give us a month's notice and it stops; we will hand over the site files and point your domain wherever you want it.",
  },
  {
    q: "Do I own the site?",
    a: "Yes. You own the domain, the content and the finished site. If you ever want to move to someone else, you take it with you — we will export it and hand it over. We have no interest in holding anyone's website hostage.",
  },
  {
    q: "How long does it take?",
    a: "Usually under a week from the first call to going live, assuming you can get us your details and photos reasonably quickly. The build itself is a couple of days. What slows projects down is almost always waiting on content, so we will chase you for it.",
  },
  {
    q: "What if I need an online shop or a booking system?",
    a: "That is beyond the flat fee, but we build them. Tell us what you need on the call and we will quote it separately — still a fixed price agreed up front, still no hourly billing. Have a look at the example build: the ordering and booking flows in it are the sort of thing we mean.",
  },
  {
    q: "Do I have to write the content?",
    a: "No. Most people would rather not, and it shows when they have. Talk us through the business on the call and we will write it, then you tell us what we got wrong. If you would rather write it yourself, that is fine too and it will not change the price.",
  },
  {
    q: "I already have a domain — is that a problem?",
    a: "Not at all. We will point it at the new site and set up the certificate. If you do not have one yet we will register it for you; the cost of the domain itself is passed straight through at whatever it costs, usually around €15 to €25 a year.",
  },
  {
    q: "What if I do not like it?",
    a: "You see a working draft early, not a static mockup, so there is no big reveal at the end to be disappointed by. You tell us what to change and we change it. Nothing is due until you are happy with what is in front of you.",
  },
];

const INCLUDED = [
  "Custom design built around your business",
  "Written for your customers, not filler text",
  "Fast and readable on every phone",
  "Contact form straight to your inbox",
  "Domain and hosting set up for you",
  "Live within a week",
];

export const Route = createFileRoute("/pricing")({
  head: () => {
    const base = pageHead({ path: "/pricing", title: TITLE, description: DESCRIPTION });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${SITE_URL}/pricing#faq`,
            mainEntity: FAQ.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  component: PricingPage,
});

function PricingPage() {
  const { data: content } = useSiteContent();

  return (
    <div className="grain min-h-screen bg-paper text-ink">
      <Nav />
      <main>
        <PageHero
          marker="Arklow 52.7956°N"
          title={
            <>
              <RiseLine i={0}>One site.</RiseLine>
              <RiseLine i={1}>One price.</RiseLine>
            </>
          }
          lede="No tiers, no upsells, no hourly surprises. You know the number before anyone starts work — and it does not move unless you ask for something we did not agree."
        />

        <section className="pb-16 md:pb-24">
          <div className="mx-auto w-full max-w-6xl px-5 lg:pl-28 lg:pr-8">
            <Drift>
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
                          <svg width="14" height="14" viewBox="0 0 14 14" className="mt-1 shrink-0" aria-hidden="true">
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
                      href="/contact"
                      className="mt-10 inline-block rounded-md bg-teal px-7 py-4 text-sm font-semibold uppercase tracking-wide text-ink"
                    >
                      Start yours
                    </Magnet>
                  </div>

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
                        <span key={i} className="block h-full bg-paper/35" style={{ width: `${w}px` }} />
                      ))}
                    </div>
                    <div className="mt-3 font-mono text-[10px] tracking-[0.2em] text-paper/35">
                      ECD-{content.price.replace(/[^\d]/g, "") || "500"}-IE
                    </div>
                  </div>
                </div>
              </div>
            </Drift>
          </div>
        </section>

        <section className="bg-sand py-16 md:py-24">
          <Shell marker="The small print, in plain English">
            <h2 className="text-[clamp(1.9rem,4.6vw,3.4rem)] text-ink">
              <RiseLine i={0}>Questions people</RiseLine>
              <RiseLine i={1}>actually ask.</RiseLine>
            </h2>

            <div className="mt-11 max-w-3xl border-t border-ink/12">
              {FAQ.map((f, i) => (
                <Drift key={f.q} i={Math.min(i, 4)}>
                  <details className="group border-b border-ink/12">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 md:py-6">
                      <h3 className="max-w-2xl text-lg text-ink md:text-2xl">{f.q}</h3>
                      <span
                        aria-hidden="true"
                        className="mt-1 shrink-0 font-mono text-xl leading-none text-teal transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-6 text-sm leading-relaxed text-slate md:text-base">{f.a}</p>
                  </details>
                </Drift>
              ))}
            </div>
          </Shell>
        </section>

        <EndCTA
          heading="Know the number. Now see the work."
          blurb="Ring us and we will tell you in five minutes whether we are the right fit and what it will cost. No proposal deck, no follow-up sequence."
        />
      </main>
      <Footer />
    </div>
  );
}

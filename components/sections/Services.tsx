import { services, site } from "@/lib/content";
import Marquee from "@/components/primitives/Marquee";

/**
 * A single running line of services between two rules.
 *
 * No rotation, no counter-running second row, no hollow-outline alternation —
 * a ticker is a masthead device borrowed from print, and print sets it straight.
 */
export default function Services() {
  return (
    <section aria-label="Services" className="hairline-t hairline-b py-5 md:py-7">
      <Marquee duration={54}>
        {services.map((service, i) => (
          <span key={`${service}-${i}`} className="flex shrink-0 items-center">
            <span className="display px-[0.45em] text-[clamp(1.5rem,3.4vw,2.75rem)] whitespace-nowrap text-paper-2">
              {service}
            </span>
            <span aria-hidden className="size-[3px] shrink-0 rotate-45 bg-vermillion" />
          </span>
        ))}
        <span className="flex shrink-0 items-center">
          <span className="display px-[0.45em] text-[clamp(1.5rem,3.4vw,2.75rem)] whitespace-nowrap text-paper-2 italic">
            {site.city}
          </span>
          <span aria-hidden className="size-[3px] shrink-0 rotate-45 bg-vermillion" />
        </span>
      </Marquee>
    </section>
  );
}

import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import Manifesto from "@/components/sections/Manifesto";
import Work from "@/components/sections/Work";
import Capabilities from "@/components/sections/Capabilities";
import Process from "@/components/sections/Process";
import Metrics from "@/components/sections/Metrics";
import CallToAction from "@/components/sections/CallToAction";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Manifesto />
      <Work />
      <Capabilities />
      <Process />
      <Metrics />
      <CallToAction />
      <Footer />
    </>
  );
}

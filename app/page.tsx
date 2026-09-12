import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Manifesto from "@/components/sections/Manifesto";
import Work from "@/components/sections/Work";
import Disciplines from "@/components/sections/Disciplines";
import Process from "@/components/sections/Process";
import Index from "@/components/sections/Index";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Manifesto />
      <Work />
      <Disciplines />
      <Process />
      <Index />
      <Contact />
      <Footer />
    </>
  );
}

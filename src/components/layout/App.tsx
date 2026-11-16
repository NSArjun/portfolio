import { PROJECTS, type Project } from "@/lib/data";
import { ScrollProvider } from "@/lib/scroll";
import { MiniUI } from "@/components/ui/MiniUI";
import { Hero } from "@/components/sections/Hero";
import { Navigation } from "@/components/layout/Navigation";
import { About } from "@/components/sections/About";
import { Achievements } from "@/components/sections/Achievements";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { RevealObserver } from "@/components/ui/RevealObserver";

export function App() {
  return (
    <ScrollProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Work
          previews={Object.fromEntries(PROJECTS.map((p) => [p.id, <MiniUI key={p.id} id={p.id} />])) as Record<
            Project["id"],
            React.ReactNode
          >}
        />
        <Certifications />
        <Achievements />
        <Contact />
      </main>
      <RevealObserver />
    </ScrollProvider>
  );
}

import { getPortfolioData } from "@/lib/getPortfolioData";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Posters from "@/components/Posters";
import PORs from "@/components/PORs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const data = getPortfolioData();

  return (
    <main className="min-h-screen">
      <Navbar personal={data.personal} links={data.navLinks} />
      <Hero personal={data.personal} socials={data.socials} />
      <About about={data.about} />
      <Projects projects={data.projects} />
      <Posters posters={data.posters} />
      <PORs pors={data.pors} />
      <Contact contact={data.contact} />
      <Footer links={data.navLinks} copyright={data.footer.copyright} />
    </main>
  );
}

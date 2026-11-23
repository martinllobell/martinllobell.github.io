import About from "./components/About";
import Ai from "./components/Ai";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Motion from "./components/Motion";
import Nav from "./components/Nav";
import Projects from "./components/Projects";
import Stack from "./components/Stack";

export default function Home() {
  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <Motion />
      <Nav />
      <main>
        <Hero />
        <About />
        <Ai />
        <Experience />
        <Projects />
        <Stack />
        <Contact />
      </main>
    </>
  );
}

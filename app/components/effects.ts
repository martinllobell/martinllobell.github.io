import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const animate = () => {
  const ctx = gsap.context(() => {
    for (const el of gsap.utils.toArray<HTMLElement>("[data-parallax]")) {
      const depth = `${el.dataset.parallax}vh`;
      const section = el.closest("section")!;
      if (section.id !== "top") {
        gsap.fromTo(el, { "--py": depth }, { "--py": "0vh", ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "top top", scrub: 0.4 } });
      }
      gsap.fromTo(el, { "--py": "0vh" }, { "--py": `-${depth}`, ease: "none", immediateRender: false, scrollTrigger: { trigger: section, start: "bottom bottom", end: "bottom top", scrub: 0.4 } });
    }
    for (const el of gsap.utils.toArray<SVGElement>(".guilloche")) {
      gsap.fromTo(el, { rotation: -50, yPercent: 25 }, { rotation: 50, yPercent: -25, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    }
    for (const el of gsap.utils.toArray<HTMLElement>("h2.title")) {
      const { chars } = new SplitText(el, { type: "words,chars" });
      gsap.from(chars, {
        yPercent: 60,
        rotationX: -80,
        opacity: 0,
        transformPerspective: 500,
        duration: 0.7,
        ease: "back.out(1.6)",
        stagger: 0.03,
        scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none reset" },
      });
    }
  });
  return () => ctx.revert();
};

export function revealText(root: HTMLElement) {
  const letters = new SplitText(root.querySelectorAll("[data-letters]"), { type: "words,chars", aria: "none" });
  const words = new SplitText(root.querySelectorAll("[data-words]"), { type: "words", aria: "none" });
  const undo = () => {
    timeline.kill();
    letters.revert();
    words.revert();
  };
  const timeline = gsap
    .timeline({ onComplete: undo })
    .from(letters.chars, { opacity: 0, yPercent: 40, duration: 0.35, ease: "power2.out", stagger: { amount: 0.3 } }, 0.1)
    .from(words.words, { opacity: 0, y: 6, filter: "blur(4px)", duration: 0.35, ease: "power2.out", stagger: { amount: 0.8 } }, 0.2)
    .from(root.querySelectorAll("li"), { opacity: 0, duration: 0.3, stagger: { amount: 0.6 } }, 0.3);
  return undo;
}

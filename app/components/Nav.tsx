"use client";

import { useEffect, useState } from "react";
import s from "./Nav.module.css";

const sections = [
  ["top", "Intro"],
  ["about", "Approach"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["stack", "Stack"],
  ["contact", "Contact"],
];

const toggleTheme = () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
};

const setMotion = (paused: boolean) => {
  const root = document.documentElement;
  if (paused) root.dataset.motion = "paused";
  else delete root.dataset.motion;
  document.querySelectorAll<SVGSVGElement>(paused ? "svg" : ".is-live svg").forEach((svg) => (paused ? svg.pauseAnimations() : svg.unpauseAnimations()));
};

export default function Nav() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const live = new IntersectionObserver((entries) => {
      for (const e of entries) {
        e.target.classList.toggle("is-live", e.isIntersecting);
        e.target.querySelectorAll("svg").forEach((svg) => (e.isIntersecting && !still && !document.documentElement.dataset.motion ? svg.unpauseAnimations() : svg.pauseAnimations()));
      }
    });
    const dots = new Map([...document.querySelectorAll<HTMLAnchorElement>(`.${s.dots} a`)].map((a) => [a.hash.slice(1), a]));
    const spy = new IntersectionObserver(
      (entries) => {
        const current = entries.find((e) => e.isIntersecting)?.target.id;
        if (current) dots.forEach((a, id) => a.toggleAttribute("aria-current", id === current));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-live]").forEach((el) => live.observe(el));
    dots.forEach((_, id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
    return () => {
      live.disconnect();
      spy.disconnect();
    };
  }, []);

  return (
    <>
      <header className={s.bar}>
        <a href="#top" className={s.mark} aria-label="Back to top">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M5 9q7 0 11 7M5 23q7 0 11-7M16 16q4-7 11-7M16 16q4 7 11 7" />
            <circle cx="16" cy="16" r="3" />
          </svg>
        </a>
        <div className={s.actions}>
          <button
            type="button"
            className={s.theme}
            aria-pressed={paused}
            aria-label="Pause animations"
            onClick={() => {
              setMotion(!paused);
              setPaused(!paused);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {paused ? <path d="M8 5v14l11-7z" /> : <path d="M9 5v14M15 5v14" />}
            </svg>
          </button>
          <button type="button" className={s.theme} onClick={toggleTheme} aria-label="Switch between light and dark theme">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="5" className={s.sun} />
              <path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" className={s.rays} />
              <path d="M21 13.5A9 9 0 1 1 10.5 3a7 7 0 0 0 10.5 10.5z" className={s.moon} />
            </svg>
          </button>
          <a className={s.cta} href="#contact">
            Book a call
          </a>
        </div>
      </header>
      <nav className={s.dots} aria-label="Sections">
        {sections.map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}

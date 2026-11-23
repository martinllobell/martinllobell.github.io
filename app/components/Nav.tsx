"use client";

import { useEffect, useState } from "react";
import s from "./Nav.module.css";

const sections = [
  ["top", "Intro"],
  ["about", "Approach"],
  ["ai", "Working with AI"],
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

const modes = ["full", "lite", "paused"] as const;
type Mode = (typeof modes)[number];

const setMotion = (mode: Mode) => {
  const root = document.documentElement;
  if (mode === "full") delete root.dataset.motion;
  else root.dataset.motion = mode;
  try {
    localStorage.setItem("motion", mode === "lite" ? "lite" : "full");
  } catch {}
  const paused = mode === "paused";
  document.querySelectorAll<SVGSVGElement>(paused ? "svg" : ".is-live svg").forEach((svg) => (paused ? svg.pauseAnimations() : svg.unpauseAnimations()));
};

export default function Nav() {
  const [mode, setMode] = useState<Mode>("full");

  useEffect(() => {
    if (document.documentElement.dataset.motion === "lite") setMode("lite");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const live = new IntersectionObserver((entries) => {
      for (const e of entries) {
        e.target.classList.toggle("is-live", e.isIntersecting);
        e.target.querySelectorAll("svg").forEach((svg) => (e.isIntersecting && !still && document.documentElement.dataset.motion !== "paused" ? svg.unpauseAnimations() : svg.pauseAnimations()));
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
            aria-label={`Animations: ${mode}. Change`}
            title={`Animations: ${mode}`}
            onClick={() => {
              const next = modes[(modes.indexOf(mode) + 1) % modes.length];
              setMotion(next);
              setMode(next);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className={s.bars} data-mode={mode}>
              <path d="M5 19v-5" />
              <path d="M12 19V9" />
              <path d="M19 19V4" />
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

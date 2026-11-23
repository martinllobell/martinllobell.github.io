"use client";

import { useEffect, useRef, useState } from "react";
import { experience } from "../content";
import BusinessCard from "./BusinessCard";
import Scene from "./Scene";
import TechIcon from "./TechIcon";
import s from "./Experience.module.css";

const last = experience.length - 1;
const pad = (n: number) => String(n).padStart(2, "0");

export default function Experience() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState<number | null>(null);

  const left = (i: number) => {
    const t = track.current!;
    const el = t.children[i] as HTMLElement;
    return el.offsetLeft - (t.clientWidth - el.offsetWidth) / 2;
  };
  const go = (i: number) => track.current?.scrollTo({ left: left(i), behavior: "smooth" });

  useEffect(() => {
    const sec = section.current;
    const t = track.current;
    if (!sec || !t) return;
    let frame = 0;
    let quiet = 0;
    let locked = false;
    let target = 0;

    const progress = () => {
      const max = t.scrollWidth - t.clientWidth;
      return max > 0 ? Math.min(1, Math.max(0, t.scrollLeft / max)) : 0;
    };
    const update = () => {
      frame = 0;
      const k = progress();
      sec.style.setProperty("--p", String(k));
      setActive(Math.round(k * last));
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };

    const step = (e: WheelEvent) => {
      if (Math.abs(sec.getBoundingClientRect().top) > 2 || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      clearTimeout(quiet);
      quiet = window.setTimeout(() => (locked = false), 240);
      if (locked) return;
      locked = true;
      const moving = Math.abs(t.scrollLeft - left(target)) > 2;
      const next = (moving ? target : Math.round(progress() * last)) + Math.sign(e.deltaY);
      if (next >= 0 && next <= last) {
        target = next;
        go(next);
        return;
      }
      const out = next < 0 ? sec.previousElementSibling : sec.nextElementSibling;
      if (out) scrollTo({ top: out.getBoundingClientRect().top + scrollY, behavior: "smooth" });
    };

    update();
    t.addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    sec.addEventListener("wheel", step, { passive: false });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(quiet);
      t.removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      sec.removeEventListener("wheel", step);
    };
  }, []);

  return (
    <section id="experience" ref={section} className={`panel ${s.experience}`} data-live>
      <header className={s.head}>
        <h2 className="title">Experience</h2>
        <p className={s.counter} aria-hidden="true">
          <span key={active}>{pad(active + 1)}</span> / {pad(experience.length)}
        </p>
      </header>
      <div className={s.rail}>
        <ol ref={track} className={s.track}>
          {experience.map((r, i) => (
            <li key={r.when} className={s.slide} aria-current={i === active || undefined}>
              <div className={s.flip} data-flipped={flipped === i || undefined} onClick={() => setFlipped(flipped === i ? null : i)}>
                <div className={s.face} aria-hidden={flipped === i || undefined}>
                  <BusinessCard className={s.card}>
                    <span className={s.cardTop}>
                      {r.logo ? <img src={`/clients/${r.logo}`} alt="" className={`logo ${s.logo}`} /> : <span className={s.wordmark}>{r.company}</span>}
                      <span>{r.when}</span>
                    </span>
                    <span className={s.cardCenter}>
                      <span className={s.title}>{r.title}</span>
                      <span className={s.company}>{r.company}</span>
                    </span>
                    <span className={s.cardBottom}>
                      {r.viaAvenga ? (
                        <span className={s.via}>
                          via <img src="/clients/avenga.svg" alt="Avenga" className="logo" />
                        </span>
                      ) : (
                        <span>Remote</span>
                      )}
                      <button type="button" className={s.turn} tabIndex={flipped === i ? -1 : 0} aria-label={`Show the impact at ${r.company}`}>
                        Impact ↻
                      </button>
                    </span>
                  </BusinessCard>
                </div>
                <div className={`${s.face} ${s.back}`} aria-hidden={flipped !== i || undefined}>
                  <BusinessCard className={s.card}>
                    <span className={s.cardTop}>
                      <span>Impact</span>
                      <span>{r.company}</span>
                    </span>
                    <span className={s.impact}>{r.impact}</span>
                    <span className={s.cardBottom}>
                      <span>{r.when}</span>
                      <button type="button" className={s.turn} tabIndex={flipped === i ? 0 : -1} aria-label="Back to the card">
                        ↻
                      </button>
                    </span>
                  </BusinessCard>
                </div>
              </div>
              <div className={s.details}>
                <Scene kind={r.scene} className={s.scene} />
                <h3 className={s.role}>
                  {r.title}, {r.url ? <a href={r.url}>{r.company}</a> : r.company}
                </h3>
                <ul className={s.points}>
                  {r.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <ul className={s.tech} aria-label="Stack">
                  {r.tech.map((t) => (
                    <li key={t}>
                      <TechIcon name={t} size={13} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className={s.progress}>
        <span className={s.fill} />
        {experience.map((r, i) => (
          <button
            key={r.when}
            type="button"
            className={i <= active ? `${s.stop} ${s.lit}` : s.stop}
            style={{ left: `${(i / last) * 100}%` }}
            aria-label={`${r.company}, ${r.when}`}
            aria-current={i === active || undefined}
            onClick={() => go(i)}
          >
            <span className={s.stopLabel}>{r.when.split(" – ")[0]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

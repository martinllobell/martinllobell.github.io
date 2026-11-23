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
  const pin = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState<number | null>(null);

  useEffect(() => {
    const sec = section.current;
    const p = pin.current;
    const r = rail.current;
    const t = track.current;
    if (!sec || !p || !r || !t) return;
    let frame = 0;
    let quiet = 0;
    let locked = false;
    let target = 0;

    const travel = () => sec.offsetHeight - p.offsetHeight;
    const progress = () => (travel() > 0 ? Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / travel())) : 0);
    const stopTop = (i: number) => sec.getBoundingClientRect().top + scrollY + (i / last) * travel();

    const update = () => {
      frame = 0;
      const k = progress();
      t.style.transform = `translate3d(${-k * (t.scrollWidth - r.clientWidth)}px,0,0)`;
      sec.style.setProperty("--p", String(k));
      setActive(Math.round(k * last));
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };

    const step = (e: WheelEvent) => {
      const box = sec.getBoundingClientRect();
      if (travel() <= 0 || box.top > 1 || box.bottom < innerHeight - 1 || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      clearTimeout(quiet);
      quiet = window.setTimeout(() => (locked = false), 240);
      if (locked) return;
      locked = true;
      const moving = Math.abs(scrollY - stopTop(target)) > 2;
      const next = (moving ? target : Math.round(progress() * last)) + Math.sign(e.deltaY);
      if (next >= 0 && next <= last) {
        target = next;
        scrollTo({ top: stopTop(next), behavior: "smooth" });
        return;
      }
      const out = next < 0 ? sec.previousElementSibling : sec.nextElementSibling;
      if (out) scrollTo({ top: out.getBoundingClientRect().top + scrollY, behavior: "smooth" });
    };

    const focus = (e: FocusEvent) => {
      const i = Number((e.target as HTMLElement).closest<HTMLElement>("[data-i]")?.dataset.i);
      if (!Number.isNaN(i)) scrollTo({ top: stopTop(i), behavior: "instant" });
    };

    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener("wheel", step, { passive: false });
    sec.addEventListener("focusin", focus);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(quiet);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      removeEventListener("wheel", step);
      sec.removeEventListener("focusin", focus);
    };
  }, []);

  return (
    <section id="experience" ref={section} className={s.experience} style={{ "--n": experience.length } as React.CSSProperties} data-live>
      {experience.map((r, i) => (
        <span key={r.when} className={s.snap} style={{ top: `calc(${i} * var(--step))` }} />
      ))}
      <div ref={pin} className={`panel ${s.pin}`}>
        <header className={s.head}>
          <h2 className="title">Experience</h2>
          <p className={s.counter} aria-hidden="true">
            <span key={active}>{pad(active + 1)}</span> / {pad(experience.length)}
          </p>
        </header>
        <div ref={rail} className={s.rail}>
          <ol ref={track} className={s.track}>
            {experience.map((r, i) => (
              <li key={r.when} data-i={i} className={s.slide} aria-current={i === active || undefined}>
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
        <div className={s.progress} aria-hidden="true">
          <span className={s.fill} />
          {experience.map((r, i) => (
            <span key={r.when} className={i <= active ? `${s.stop} ${s.lit}` : s.stop} style={{ left: `${(i / last) * 100}%` }}>
              <span className={s.stopLabel}>{r.when.split(" – ")[0]}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

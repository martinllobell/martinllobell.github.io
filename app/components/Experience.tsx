"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { experience } from "../content";
import BusinessCard from "./BusinessCard";
import Scene from "./Scene";
import Sculpture from "./Sculpture";
import TechIcon from "./TechIcon";
import { effects } from "./Motion";
import RoleDialog from "./RoleDialog";
import Guilloche from "./Guilloche";
import s from "./Experience.module.css";

const last = experience.length - 1;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const still = () => !!document.documentElement.dataset.motion || reduced();
const pad = (n: number) => String(n).padStart(2, "0");

export default function Experience() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const undoReveal = useRef<() => void>(undefined);
  const lifted = useRef<HTMLElement>(null);

  const left = (i: number) => {
    const t = track.current!;
    const el = t.children[i] as HTMLElement;
    return el.offsetLeft - (t.clientWidth - el.offsetWidth) / 2;
  };
  const go = (i: number) => track.current?.scrollTo({ left: left(i), behavior: "smooth" });

  const morph = (swap: () => void) => {
    if (!document.startViewTransition || still()) {
      swap();
      return Promise.resolve();
    }
    const run = document.startViewTransition(swap);
    run.ready.catch(() => {});
    return run.finished;
  };

  const fit = () => {
    const d = dialog.current!;
    delete d.dataset.fit;
    delete d.dataset.tight;
    const over = () => d.scrollHeight > d.clientHeight + 1;
    const shrink = () => {
      for (let k = 1; k > 0.745; k -= 0.02) {
        d.style.setProperty("--k", String(k));
        if (!over()) return;
      }
      if ("tight" in d.dataset) return;
      d.dataset.tight = "";
      shrink();
    };
    shrink();
    if (!over()) d.dataset.fit = "";
  };

  const open = (i: number, card: HTMLElement) => {
    if (dialog.current?.open || lifted.current?.style.viewTransitionName) return;
    lifted.current = card;
    card.style.viewTransitionName = "role-card";
    morph(() => {
      card.style.viewTransitionName = "";
      undoReveal.current?.();
      flushSync(() => setShown(i));
      const d = dialog.current!;
      d.showModal();
      d.scrollTop = 0;
      fit();
      if (document.documentElement.dataset.motion === "paused" || reduced()) d.querySelectorAll("svg").forEach((svg) => svg.pauseAnimations());
      if (!still()) undoReveal.current = effects.current?.revealText(d);
    });
  };

  const close = () => {
    const card = lifted.current;
    if (!card || !dialog.current?.open) return;
    morph(() => {
      dialog.current!.close();
      card.querySelector("button")!.focus({ preventScroll: true });
      card.style.viewTransitionName = "role-card";
    }).finally(() => {
      card.style.viewTransitionName = "";
    });
  };

  useEffect(() => {
    const sec = section.current;
    const t = track.current;
    if (!sec || !t) return;
    let frame = 0;
    let quiet = 0;
    let locked = false;
    let target = 0;
    let armed = false;

    const arm = (e: PointerEvent) => {
      armed = e.pointerType === "mouse" && Math.abs(sec.getBoundingClientRect().top) <= 2;
    };
    const disarm = () => {
      if (Math.abs(sec.getBoundingClientRect().top) > 2) armed = false;
    };

    const progress = () => {
      const max = t.scrollWidth - t.clientWidth;
      return max > 0 ? Math.min(1, Math.max(0, t.scrollLeft / max)) : 0;
    };
    const update = () => {
      frame = 0;
      const k = progress();
      sec.style.setProperty("--p", String(k));
      setActive(Math.round(k * last));
      for (const el of t.children as HTMLCollectionOf<HTMLElement>) {
        const away = (el.offsetLeft + el.offsetWidth / 2 - t.scrollLeft) / t.clientWidth - 0.5;
        el.style.setProperty("--d", String(Math.max(-1, Math.min(1, away))));
      }
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };

    const step = (e: WheelEvent) => {
      if (dialog.current?.open || !armed || !(e.target as Element).closest(`.${s.lift}`)) return;
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

    if (!document.documentElement.dataset.motion) for (const r of experience) if (r.image) new Image().src = `/work/${r.image}`;
    update();
    t.addEventListener("scroll", schedule, { passive: true });
    let fitting = 0;
    const refit = () => {
      cancelAnimationFrame(fitting);
      if (dialog.current?.open) fitting = requestAnimationFrame(fit);
    };
    addEventListener("resize", schedule);
    addEventListener("resize", refit);
    sec.addEventListener("wheel", step, { passive: false });
    t.addEventListener("pointermove", arm, { passive: true });
    addEventListener("scroll", disarm, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(fitting);
      clearTimeout(quiet);
      t.removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      removeEventListener("resize", refit);
      sec.removeEventListener("wheel", step);
      t.removeEventListener("pointermove", arm);
      removeEventListener("scroll", disarm);
    };
  }, []);

  return (
    <section id="experience" ref={section} className={`panel ${s.experience}`} data-live>
      <Guilloche lines={48} ratio={0.5} side="left" />
      <header className={s.head}>
        <Sculpture shape="watch" className={s.watch} />
        <h2 className="title">Experience</h2>
        <p className={s.counter} aria-hidden="true">
          <span key={active}>{pad(active + 1)}</span> / {pad(experience.length)}
        </p>
      </header>
      <div className={s.rail}>
        <ol ref={track} className={s.track}>
          {experience.map((r, i) => (
            <li key={r.when} className={s.slide} aria-current={i === active || undefined}>
              <div className={s.lift} onClick={(e) => open(i, e.currentTarget)}>
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
                    <button type="button" className={s.turn} aria-haspopup="dialog" aria-label={`Read more about ${r.company}`}>
                      Read more
                    </button>
                  </span>
                </BusinessCard>
              </div>
              <div className={s.details}>
                <Scene kind={r.scene} className={s.scene} />
                <h3 className={s.role}>
                  {r.title}, {r.url ? <a href={r.url} target="_blank" rel="noreferrer">{r.company}</a> : r.company}
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
      <RoleDialog ref={dialog} role={experience[shown]} onClose={close} />
      <div className={s.steps}>
        <button type="button" aria-label="Previous role" disabled={active === 0} onClick={() => go(active - 1)}>
          ←
        </button>
        <button type="button" aria-label="Next role" disabled={active === last} onClick={() => go(active + 1)}>
          →
        </button>
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

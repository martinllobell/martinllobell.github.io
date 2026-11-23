"use client";

import { projects } from "../content";
import { tilt } from "./BusinessCard";
import Scene from "./Scene";
import Sculpture from "./Sculpture";
import TechIcon from "./TechIcon";
import Guilloche from "./Guilloche";
import s from "./Projects.module.css";

export default function Projects() {
  return (
    <section id="projects" className={`panel ${s.projects}`} data-live>
      <Guilloche lines={24} ratio={0.24} side="right" />
      <div className={s.heading}>
        <h2 className="title reveal">Projects</h2>
        <Sculpture shape="links" className={s.links} />
      </div>
      <div className={s.row}>
        {projects.map((p, i) => (
          <article key={p.name} className={`reveal ${s.project}`} style={{ "--i": i + 1 } as React.CSSProperties} data-parallax={6 + i * 7} {...tilt}>
            <Scene kind={p.scene} className={s.scene} />
            <header className={s.head}>
              <h3>{p.href ? <a className={s.open} href={p.href} target="_blank" rel="noreferrer">{p.name}</a> : p.name}</h3>
              <span className={s.status}>{p.status}</span>
            </header>
            <p>{p.text}</p>
            <p className={s.detail}>{p.detail}</p>
            <ul className={s.tech} aria-label="Built with">
              {p.tech.map((t) => (
                <li key={t}>
                  <TechIcon name={t} size={14} />
                  {t}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

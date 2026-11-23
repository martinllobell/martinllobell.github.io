"use client";

import { projects } from "../content";
import { tilt } from "./BusinessCard";
import Scene from "./Scene";
import TechIcon from "./TechIcon";
import s from "./Projects.module.css";

export default function Projects() {
  return (
    <section id="projects" className={`panel ${s.projects}`} data-live>
      <h2 className="title reveal">Projects</h2>
      <div className={s.row}>
        {projects.map((p, i) => (
          <article key={p.name} className={`reveal ${s.project}`} style={{ "--i": i + 1 } as React.CSSProperties} {...tilt}>
            <Scene kind={p.scene} className={s.scene} />
            <header className={s.head}>
              <h3>{p.href ? <a href={p.href}>{p.name}</a> : p.name}</h3>
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

import { profile } from "../content";
import BusinessCard from "./BusinessCard";
import Guilloche from "./Guilloche";
import Sculpture from "./Sculpture";
import s from "./Contact.module.css";

const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Let's talk")}`;

function Envelope() {
  return (
    <svg className={s.envelope} viewBox="0 0 64 44" aria-hidden="true">
      <rect x="1" y="1" width="62" height="42" rx="3" />
      <path d="M1 41 L24 21 M63 41 L40 21" />
      <path d="M1 3 L32 27 L63 3" className={s.flap} />
    </svg>
  );
}

export default function Contact() {
  const booking = profile.calendarUrl || mailto;
  return (
    <section id="contact" className={`panel ${s.contact}`} data-live>
      <Guilloche lines={40} ratio={0.72} side="right" />
      <Sculpture shape="bowtie" tone="--ink" className={s.bowtie} />
      <h2 className={`title reveal ${s.heading}`}>Let&apos;s talk</h2>
      <p className="muted reveal" style={{ "--i": 1 } as React.CSSProperties}>
        Open to remote roles in backend, platform and AI engineering.
      </p>
      <div data-parallax="14" className={`reveal ${s.cardWrap}`} style={{ "--i": 2 } as React.CSSProperties}>
        <BusinessCard className={s.card}>
          <div className={s.cardTop}>
            <span>{profile.role}</span>
            <span>Remote</span>
          </div>
          <div className={s.cardCenter}>
            <Envelope />
            <h3 className={s.cardTitle}>Write to me</h3>
            <a className={s.email} href={mailto}>
              {profile.email}
            </a>
          </div>
          <div className={s.cardBottom}>
            <span>{profile.location}</span>
            <span>UTC−3</span>
          </div>
        </BusinessCard>
      </div>
      <p data-parallax="22" className={`reveal ${s.actions}`} style={{ "--i": 3 } as React.CSSProperties}>
        <a className="btn" href={booking} {...(profile.calendarUrl && { target: "_blank", rel: "noreferrer" })}>
          {profile.calendarUrl ? "Pick a time" : "Request a call"}
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </p>
      <footer className={s.foot}>© {new Date().getFullYear()}</footer>
    </section>
  );
}

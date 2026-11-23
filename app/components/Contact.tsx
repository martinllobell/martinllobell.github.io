import { profile } from "../content";
import BusinessCard from "./BusinessCard";
import s from "./Contact.module.css";

const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Let's talk")}`;

function Calendar() {
  return (
    <svg className={s.calendar} viewBox="0 0 220 120" aria-hidden="true">
      {Array.from({ length: 15 }, (_, i) => (
        <rect key={i} x={8 + (i % 5) * 42} y={8 + Math.floor(i / 5) * 36} width="36" height="28" rx="3" className={s.slot} style={{ animationDelay: `${((i * 7) % 15) * 0.4}s` }} />
      ))}
    </svg>
  );
}

export default function Contact() {
  const booking = profile.calendarUrl || mailto;
  return (
    <section id="contact" className={`panel ${s.contact}`} data-live>
      <h2 className={`title reveal ${s.heading}`}>Let&apos;s talk</h2>
      <p className="muted reveal" style={{ "--i": 1 } as React.CSSProperties}>
        Open to remote roles in backend, platform and AI engineering.
      </p>
      <div className={`reveal ${s.cardWrap}`} style={{ "--i": 2 } as React.CSSProperties}>
        <BusinessCard className={s.card}>
          <div className={s.cardTop}>
            <span>30 minutes</span>
            <span>Video call</span>
          </div>
          <div className={s.cardCenter}>
            <Calendar />
            <h3 className={s.cardTitle}>Book a call</h3>
            <a className={s.email} href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>
          <div className={s.cardBottom}>
            <span>{profile.location}</span>
            <span>UTC−3</span>
          </div>
        </BusinessCard>
      </div>
      {profile.calendarUrl && <iframe className={`reveal ${s.frame}`} src={profile.calendarUrl} title="Pick a time for a call" loading="lazy" />}
      <p className={`reveal ${s.actions}`} style={{ "--i": 3 } as React.CSSProperties}>
        <a className="btn" href={booking} {...(profile.calendarUrl && { target: "_blank", rel: "noreferrer" })}>
          {profile.calendarUrl ? "Pick a time" : "Request a call"}
        </a>
        <a href={profile.github}>GitHub</a>
        <a href={profile.linkedin}>LinkedIn</a>
      </p>
      <footer className={s.foot}>© {new Date().getFullYear()}</footer>
    </section>
  );
}

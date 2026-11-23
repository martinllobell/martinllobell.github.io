import { ai, profile } from "../content";
import Guilloche from "./Guilloche";
import Sculpture from "./Sculpture";
import s from "./Ai.module.css";

export default function Ai() {
  return (
    <section id="ai" className={`panel ${s.ai}`} data-live>
      <Guilloche lines={30} ratio={0.62} side="left" />
      <h2 className="title reveal">Working with AI</h2>
      <div className={s.grid}>
        <Sculpture shape="lattice" className={s.sculpture} />
        <div className={s.text} data-parallax="8">
          {ai.map((p, i) => (
            <p key={i} className="reveal" style={{ "--i": i + 1 } as React.CSSProperties}>
              {p}
            </p>
          ))}
          <p className={`reveal ${s.more}`} style={{ "--i": 5 } as React.CSSProperties}>
            <span>Want to know more about how I work with agents?</span>
            <a className="btn" href={profile.calendarUrl} target="_blank" rel="noreferrer">
              Book 15 minutes
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

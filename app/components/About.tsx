import { approach, profile } from "../content";
import s from "./About.module.css";

const log = [
  ["chat", "anthropic", "200", "412ms"],
  ["embed", "openai", "200", "88ms"],
  ["chat", "bedrock", "429", "retry"],
  ["chat", "anthropic", "200", "390ms"],
  ["usage", "ledger", "200", "12ms"],
  ["chat", "vertex", "200", "530ms"],
  ["tools", "snowflake", "200", "241ms"],
  ["chat", "openai", "200", "305ms"],
];

export default function About() {
  return (
    <section id="about" className={`panel ${s.about}`} data-live>
      <h2 className="title reveal">Approach</h2>
      <div className={s.grid}>
        <div className={s.text}>
          {approach.map((p, i) => (
            <p key={i} className="reveal" style={{ "--i": i + 1 } as React.CSSProperties}>
              {p}
            </p>
          ))}
          <p className={`muted reveal ${s.place}`} style={{ "--i": 4 } as React.CSSProperties}>
            Based in {profile.location}, working remotely with teams in the US.
          </p>
        </div>
        <figure className={`reveal ${s.receipt}`} style={{ "--i": 2 } as React.CSSProperties}>
          <p className={s.head}>gateway.log</p>
          <div className={s.window}>
            <div className={s.roll}>
              {[...log, ...log].map(([route, provider, code, time], i) => (
                <p key={i} className={code === "200" ? s.row : `${s.row} ${s.warn}`}>
                  <span>/v1/{route}</span>
                  <span className={s.leader}>{provider}</span>
                  <span>{code}</span>
                  <span>{time}</span>
                </p>
              ))}
            </div>
          </div>
          <figcaption>Illustration of gateway traffic: routing, retries and cost per request.</figcaption>
        </figure>
      </div>
    </section>
  );
}

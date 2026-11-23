import { clientLogos, profile } from "../content";
import RoutingField from "./RoutingField";
import Sculpture from "./Sculpture";
import s from "./Hero.module.css";

function Letters({ word, offset }: { word: string; offset: number }) {
  return (
    <span className={s.line} aria-hidden="true">
      {[...word].map((ch, i) => (
        <span key={i} style={{ animationDelay: `${offset + i * 0.045}s` }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const [first, last] = profile.name.split(" ");
  return (
    <section id="top" className={`panel ${s.hero}`} data-live>
      <RoutingField className={s.field} />
      <Sculpture shape="gateway" className={s.core} />
      <div className={s.text} data-parallax="14">
        <p className={s.role}>
          <span className={s.live} aria-hidden="true" />
          {profile.role}
        </p>
        <h1 className={s.name} aria-label={profile.name}>
          <Letters word={first} offset={0.1} />
          <Letters word={last} offset={0.35} />
        </h1>
        <p className={s.pitch}>{profile.pitch}</p>
        <p className={s.links}>
          <a className="btn" href="#contact">
            Book a call
          </a>
          <a href={profile.github}>GitHub</a>
          <a href={profile.linkedin}>LinkedIn</a>
        </p>
      </div>
      <div className={s.marquee} aria-label="Teams I have shipped with">
        <div className={s.track}>
          {[...clientLogos, ...clientLogos].map((c, i) => (
            <img key={i} src={`/clients/${c.file}`} alt={i < clientLogos.length ? c.name : ""} className="logo" />
          ))}
        </div>
      </div>
      <p className={s.caption}>Each dot is a request routed through a gateway. Click to send more.</p>
    </section>
  );
}

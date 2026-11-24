import type { Role } from "../content";
import Scene from "./Scene";
import TechIcon from "./TechIcon";
import s from "./RoleDialog.module.css";

export default function RoleDialog({ ref, role: r, onClose }: { ref: React.Ref<HTMLDialogElement>; role: Role; onClose: () => void }) {
  return (
    <dialog
      ref={ref}
      className={s.dialog}
      style={{ viewTransitionName: "role-card" }}
      aria-labelledby="role-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <article key={r.company} className={s.sheet}>
        <header className={s.top}>
          {r.logo ? <img src={`/clients/${r.logo}`} alt="" className={`logo ${s.logo}`} /> : <span className={s.wordmark}>{r.company}</span>}
          <button type="button" className={s.close} aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        <div className={s.media}>
          <img src={`/work/${r.image}`} alt={`${r.company} cover`} width="1200" height="627" decoding="sync" className={s.photo} />
          <Scene kind={r.scene} className={s.scene} />
        </div>
        <div className={s.text}>
          <div>
            <h3 id="role-title" className={s.title} data-letters>
              {r.title}
            </h3>
            <p className={s.company} data-words>{r.url ? <a href={r.url} target="_blank" rel="noreferrer">{r.company}</a> : r.company}</p>
            <p className={s.when}>
              {r.when}
              {r.viaAvenga && (
                <span className={s.via}>
                  via <img src="/clients/avenga.svg" alt="Avenga" className="logo" />
                </span>
              )}
            </p>
          </div>
          <p data-words>{r.about}</p>
          <div>
            <h4 className={s.label}>What I did</h4>
            <ul className={s.points}>
              {[...r.points, ...r.more].map((point) => (
                <li key={point} data-words>{point}</li>
              ))}
            </ul>
          </div>
          <ul className={s.tech} aria-label="Stack">
            {r.tech.map((t) => (
              <li key={t}>
                <TechIcon name={t} size={13} />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className={s.outcome}>
          <h4 className={s.label}>Impact</h4>
          <p className={s.impact} data-words>{r.impact}</p>
        </div>
      </article>
    </dialog>
  );
}

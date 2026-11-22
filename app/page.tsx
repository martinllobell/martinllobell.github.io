import RoutingField from "./RoutingField";
import { about, experience, profile, projects, stack } from "./content";

export default function Home() {
  const [first, last] = profile.name.split(" ");
  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <header className="nav">
        <a href="#top" className="mark" aria-label="Back to top">
          ML
        </a>
        <nav aria-label="Sections">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <RoutingField />
          <div className="hero-text">
            <h1>
              <span className="line">
                <span>{first}</span>
              </span>
              <span className="line">
                <span>{last}</span>
              </span>
            </h1>
            <p className="role">{profile.role}</p>
            <p className="pitch">{profile.pitch}</p>
            <p className="links">
              <a href={`mailto:${profile.email}`}>Email me</a>
              <a href={profile.github}>GitHub</a>
              <a href={profile.linkedin}>LinkedIn</a>
            </p>
          </div>
          <p className="caption">Each dot is a request routed through a gateway. Click to send more.</p>
        </section>

        <section id="about" className="block">
          <h2>About</h2>
          <div className="prose">
            {about.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <p className="muted">{profile.location}</p>
          </div>
        </section>

        <section id="experience" className="block">
          <h2>Experience</h2>
          <ol className="timeline">
            {experience.map((r) => (
              <li key={r.when}>
                <p className="when">{r.when}</p>
                <div>
                  <h3>
                    {r.title}
                    <span className="company">{r.company}</span>
                  </h3>
                  <ul>
                    {r.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="projects" className="block">
          <h2>Projects</h2>
          <div className="projects">
            {projects.map((p) => (
              <article key={p.name}>
                <h3>{p.href ? <a href={p.href}>{p.name}</a> : p.name}</h3>
                <p className="muted">{p.when}</p>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="stack" className="block">
          <h2>Stack</h2>
          <dl className="stack">
            {stack.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="contact" className="block contact">
          <h2>Contact</h2>
          <div>
            <p className="prose">Open to remote roles in backend, platform and AI engineering.</p>
            <a className="email" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <p className="links">
              <a href={profile.github}>GitHub</a>
              <a href={profile.linkedin}>LinkedIn</a>
            </p>
          </div>
        </section>
      </main>

      <footer className="foot">© {new Date().getFullYear()} Martín Llobell</footer>
    </>
  );
}

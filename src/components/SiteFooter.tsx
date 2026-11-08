import { Link } from "react-router";
import { GATHERING_RHYTHM, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="shell foot-grid">
        <div className="foot-brand">
          <img src="/brand/logo-mark.png" alt={SITE.fullName} width={110} height={59} />
          <p>A family where grace is not a theory but a daily reality.</p>
        </div>
        <div className="foot-col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/about">About the ministry</Link></li>
            <li><Link to="/visit">Your first visit</Link></li>
            <li><Link to="/gatherings">Gatherings</Link></li>
            <li><Link to="/live">Watch live</Link></li>
            <li><Link to="/believe">What we believe</Link></li>
            <li><Link to="/give">Give</Link></li>
          </ul>
        </div>
        <div className="foot-col">
          <h4>Gather</h4>
          <ul>
            {GATHERING_RHYTHM.map((g) => (
              <li key={g.day}>
                {g.day} · {g.time}
              </li>
            ))}
          </ul>
        </div>
        <div className="foot-col">
          <h4>Connect</h4>
          <ul>
            {SITE.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="shell foot-bottom">
        <nav aria-label="Legal">
          <Link to="/privacy">Privacy</Link>
          <Link to="/prayer">Prayer and counselling</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/account">Members</Link>
        </nav>
        <span className="foot-madeby">
          © {new Date().getFullYear()} {SITE.fullName} · Created by{" "}
          <a href="https://genfeel.com" target="_blank" rel="noopener noreferrer">
            genfeel
          </a>
        </span>
      </div>
    </footer>
  );
}

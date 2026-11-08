import { Link } from "react-router";
import { useLang } from "@/i18n";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="site-foot">
      <div className="shell foot-grid">
        <div className="foot-brand">
          <img src="/brand/logo-mark.png" alt={`${t.brand.name} ${t.brand.suffix}`} width={110} height={59} />
          <p>{t.footer.line}</p>
        </div>
        <div className="foot-col">
          <h4>{t.footer.explore}</h4>
          <ul>
            <li><Link to="/about">{t.footer.aboutMinistry}</Link></li>
            <li><Link to="/visit">{t.footer.firstVisit}</Link></li>
            <li><Link to="/gatherings">{t.footer.gatherings}</Link></li>
            <li><Link to="/live">{t.footer.watchLive}</Link></li>
            <li><Link to="/believe">{t.footer.believe}</Link></li>
            <li><Link to="/give">{t.footer.give}</Link></li>
          </ul>
        </div>
        <div className="foot-col">
          <h4>{t.footer.gather}</h4>
          <ul>
            <li>{t.footer.rhythmSunday}</li>
            <li>{t.footer.rhythmWednesday}</li>
            <li>{t.footer.rhythmFriday}</li>
          </ul>
        </div>
        <div className="foot-col">
          <h4>{t.footer.connect}</h4>
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
          <Link to="/privacy">{t.footer.legalPrivacy}</Link>
          <Link to="/prayer">{t.footer.legalPrayer}</Link>
          <Link to="/contact">{t.footer.legalContact}</Link>
          <Link to="/account">{t.footer.legalMembers}</Link>
        </nav>
        <span className="foot-madeby">
          © {new Date().getFullYear()} {t.footer.copyright} · {t.footer.createdBy}{" "}
          <a href="https://genfeel.com" target="_blank" rel="noopener noreferrer">
            genfeel
          </a>
        </span>
      </div>
    </footer>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { LANGS, useLang } from "@/i18n";
import { LangSwitch } from "./LangSwitch";

export function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const location = useLocation();
  const onDark = location.pathname === "/" || location.pathname === "/live";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      if (y > lastY.current + 6 && y > 140) setHidden(true);
      else if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { to: "/about", label: t.nav.about },
    { to: "/visit", label: t.nav.visit },
    { to: "/gatherings", label: t.nav.gatherings },
    { to: "/live", label: t.nav.live },
    { to: "/messages", label: t.nav.messages },
    { to: "/ministries", label: t.nav.ministries },
    { to: "/believe", label: t.nav.believe },
    { to: "/prayer", label: t.nav.prayer },
    { to: "/contact", label: t.nav.contact },
  ];

  return (
    <>
      <header
        className={[
          "site-head",
          hidden && !open ? "site-head--hidden" : "",
          solid ? "site-head--solid" : "",
          onDark ? "site-head--on-dark" : "",
        ].join(" ")}
      >
        <div className="shell--wide head-bar" style={{ marginInline: "auto" }}>
          <Link to="/" className="brand" aria-label={`${t.brand.name} ${t.brand.suffix}`}>
            <img src="/brand/logo-mark.png" alt="" width={58} height={30} />
            <span className="brand-word">
              <b>{t.brand.name}</b>
              <small>{t.brand.suffix}</small>
            </span>
          </Link>
          <nav className="head-nav" aria-label="Primary">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span style={{ display: "none" }} className="head-lang-desktop">
              <LangSwitch />
            </span>
            <Link to="/give" className="btn btn--gold head-give">
              {t.nav.give}
            </Link>
            <button
              type="button"
              className="head-menu-btn"
              aria-expanded={open}
              aria-controls="menu-overlay"
              onClick={() => setOpen(true)}
            >
              {t.nav.menu}
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-overlay"
        className="menu-overlay"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
      >
        <div className="menu-overlay__top">
          <Link to="/" className="brand" aria-label={`${t.brand.name} ${t.brand.suffix}`}>
            <img src="/brand/logo-mark.png" alt="" width={58} height={30} />
            <span className="brand-word">
              <b style={{ color: "var(--cream)" }}>{t.brand.name}</b>
              <small>{t.brand.suffix}</small>
            </span>
          </Link>
          <button type="button" className="menu-overlay__close" onClick={() => setOpen(false)}>
            {t.nav.close}
          </button>
        </div>
        <nav className="menu-overlay__links" aria-label={t.nav.menu}>
          {[{ to: "/", label: t.nav.home }, ...links, { to: "/give", label: t.nav.give }].map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="menu-overlay__meta" style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <div>
            <span style={{ display: "block", marginBottom: "0.4rem", letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.7rem", color: "var(--gold)" }}>
              {t.nav.language}
            </span>
            <div className="menu-langs" role="group" aria-label={t.nav.language}>
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  data-active={lang === l.code}
                  aria-pressed={lang === l.code}
                  onClick={() => setLang(l.code)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <span>
              {t.nav.callUs} <a href="tel:+447908407744">07908 407744</a>
            </span>
            <span>
              {t.nav.writeUs} <a href="mailto:info@therealityofgraceministries.com">info@therealityofgraceministries.com</a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

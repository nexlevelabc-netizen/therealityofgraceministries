import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteHeader() {
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
          <Link to="/" className="brand" aria-label={`${SITE.fullName} home`}>
            <img src="/brand/logo-mark.png" alt="" width={42} height={22} />
            <span className="brand-word">
              <b>The Reality of Grace</b>
              <small>Ministries Int'l</small>
            </span>
          </Link>
          <nav className="head-nav" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link to="/give" className="btn btn--gold head-give">
              Give
            </Link>
            <button
              type="button"
              className="head-menu-btn"
              aria-expanded={open}
              aria-controls="menu-overlay"
              onClick={() => setOpen(true)}
            >
              Menu
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
        aria-label="Site menu"
      >
        <div className="menu-overlay__top">
          <Link to="/" className="brand" aria-label={`${SITE.fullName} home`}>
            <img src="/brand/logo-mark.png" alt="" width={42} height={22} />
            <span className="brand-word">
              <b style={{ color: "var(--cream)" }}>The Reality of Grace</b>
              <small>Ministries Int'l</small>
            </span>
          </Link>
          <button type="button" className="menu-overlay__close" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <nav className="menu-overlay__links" aria-label="Menu">
          {[{ to: "/", label: "Home" }, ...NAV_LINKS, { to: "/give", label: "Give" }].map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="menu-overlay__meta">
          <span>
            Call us <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
          </span>
          <span>
            Write to us <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </span>
        </div>
      </div>
    </>
  );
}

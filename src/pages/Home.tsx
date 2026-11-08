import { Link } from "react-router";
import { MaskedLines } from "@/components/PageHero";
import { trpc } from "@/providers/trpc";
import { SITE } from "@/lib/site";
import { useLang } from "@/i18n";

export default function Home() {
  const { t, locale } = useLang();
  const gatherings = trpc.events.upcoming.useQuery({ limit: 3 });

  const rhythm = [
    { name: t.visit.r1t, note: t.visit.r1b, meta: t.visit.r1m },
    { name: t.visit.r2t, note: t.visit.r2b, meta: t.visit.r2m },
    { name: t.visit.r3t, note: t.visit.r3b, meta: t.visit.r3m },
  ];

  const funds = [
    t.funds.tithes,
    t.funds.offerings,
    t.funds.kingdom,
    t.funds.compassion,
  ];

  const fmtDate = (d: Date) =>
    d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/London" });
  const fmtTime = (d: Date) =>
    d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

  return (
    <>
      {/* ---------- hero: split editorial composition over living imagery ---------- */}
      <section className="hero">
        <div className="hero__media" aria-hidden="true">
          <img src="/img/hero-worship.jpg" alt="" fetchPriority="high" />
          <img src="/img/hero-welcome.jpg" alt="" />
          <img src="/img/hero-word.jpg" alt="" />
        </div>
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__inner">
          <div className="hero__row">
            <h1 className="display-hero hero__title">
              <MaskedLines
                lines={t.home.heroTitle.map((p, i) =>
                  p.i ? <em key={i}>{p.t}</em> : <span key={i}>{p.t}</span>
                )}
              />
            </h1>
          </div>
          <div className="hero__row hero__row--offset">
            <div className="hero__meta">
              <span className="minititle">{t.home.heroKicker}</span>
              <p>{t.home.heroMeta}</p>
            </div>
            <div className="hero__actions">
              <Link to="/visit" className="btn btn--on-dark">
                {t.home.heroVisit}
              </Link>
              <Link to="/live" className="btn btn--ghost-dark">
                {t.home.heroLive}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- statement ---------- */}
      <section className="section">
        <div className="shell">
          <span className="minititle" data-reveal>
            {t.home.whyKicker}
          </span>
          <p className="statement" style={{ marginTop: "1.8rem", maxWidth: "26ch" }} data-reveal>
            {t.home.statementA} <em>{t.home.statementEm}</em>.
          </p>
          <div style={{ marginTop: "2.4rem" }} data-reveal>
            <Link to="/about" className="tlink">
              {t.home.storyLink}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- three doors ---------- */}
      <section className="section--tight">
        <div className="shell">
          <div className="split split--lean-r" style={{ alignItems: "end", marginBottom: "3.5rem" }}>
            <div>
              <span className="minititle" data-reveal>
                {t.home.doorsKicker}
              </span>
              <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
                {t.home.doorsTitle}
              </h2>
            </div>
            <p className="body-copy" data-reveal>
              {t.home.doorsIntro}
            </p>
          </div>

          <div className="grid-3">
            <article data-reveal>
              <div className="figure" data-parallax style={{ aspectRatio: "4 / 5" }}>
                <img src="/img/hero-worship.jpg" alt={t.home.door1Alt} loading="lazy" />
              </div>
              <p className="figure-caption">{t.home.door1Tag}</p>
              <h3 className="display-3" style={{ margin: "0.5rem 0 0.8rem" }}>
                {t.home.door1Title}
              </h3>
              <p className="body-copy">{t.home.door1Body}</p>
              <p style={{ marginTop: "1.2rem" }}>
                <Link to="/gatherings" className="tlink">
                  {t.home.door1Link}
                </Link>
              </p>
            </article>
            <article data-reveal style={{ ["--reveal-delay" as string]: "0.12s" }}>
              <div className="figure" data-parallax style={{ aspectRatio: "4 / 5" }}>
                <img src="/img/hero-word.jpg" alt={t.home.door2Alt} loading="lazy" />
              </div>
              <p className="figure-caption">{t.home.door2Tag}</p>
              <h3 className="display-3" style={{ margin: "0.5rem 0 0.8rem" }}>
                {t.home.door2Title}
              </h3>
              <p className="body-copy">{t.home.door2Body}</p>
              <p style={{ marginTop: "1.2rem" }}>
                <Link to="/believe" className="tlink">
                  {t.home.door2Link}
                </Link>
              </p>
            </article>
            <article data-reveal style={{ ["--reveal-delay" as string]: "0.24s" }}>
              <div className="figure" data-parallax style={{ aspectRatio: "4 / 5" }}>
                <img src="/img/community.jpg" alt={t.home.door3Alt} loading="lazy" />
              </div>
              <p className="figure-caption">{t.home.door3Tag}</p>
              <h3 className="display-3" style={{ margin: "0.5rem 0 0.8rem" }}>
                {t.home.door3Title}
              </h3>
              <p className="body-copy">{t.home.door3Body}</p>
              <p style={{ marginTop: "1.2rem" }}>
                <Link to="/contact" className="tlink">
                  {t.home.door3Link}
                </Link>
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- watch live band ---------- */}
      <section className="band-dark section">
        <div className="shell split split--lean-l" style={{ alignItems: "center" }}>
          <div>
            <span className="minititle" data-reveal>
              {t.home.liveKicker}
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              {t.home.liveTitleA}{" "}
              <em className="serif-italic" style={{ color: "var(--gold-bright)" }}>
                {t.home.liveTitleEm}
              </em>
            </h2>
            <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
              {t.home.liveBody}
            </p>
            <div style={{ marginTop: "2rem", display: "flex", gap: "0.9rem", flexWrap: "wrap" }} data-reveal>
              <Link to="/live" className="btn btn--gold">
                {t.home.liveCta}
              </Link>
              <a
                href={SITE.socials[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost-dark"
              >
                {t.home.liveArchive}
              </a>
            </div>
          </div>
          <div className="figure" data-parallax style={{ aspectRatio: "16 / 11" }} data-reveal>
            <img src="/img/live.jpg" alt={t.home.liveAlt} loading="lazy" />
          </div>
        </div>
      </section>

      {/* ---------- gatherings preview ---------- */}
      <section className="section--tight">
        <div className="shell">
          <div className="split split--lean-r" style={{ alignItems: "end", marginBottom: "2.4rem" }}>
            <div>
              <span className="minititle" data-reveal>
                {t.home.weekKicker}
              </span>
              <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
                {t.home.weekTitle}
              </h2>
            </div>
            <div data-reveal>
              {rhythm.map((g) => (
                <p key={g.name} className="body-copy" style={{ marginBottom: "0.2rem" }}>
                  {g.meta} · {g.name}
                </p>
              ))}
            </div>
          </div>
          <div>
            {gatherings.data && gatherings.data.length > 0
              ? gatherings.data.map((e) => (
                  <div className="rowline" key={e.id} data-reveal>
                    <div>
                      <p className="rowline__title">{e.title}</p>
                      {e.description ? <p className="body-copy">{e.description}</p> : null}
                    </div>
                    <p className="rowline__meta">
                      {fmtDate(new Date(e.startsAt))}
                      {" · "}
                      {fmtTime(new Date(e.startsAt))}
                      {e.location ? ` · ${e.location}` : ""}
                    </p>
                  </div>
                ))
              : rhythm.map((g) => (
                  <div className="rowline" key={g.name} data-reveal>
                    <div>
                      <p className="rowline__title">{g.name}</p>
                      <p className="body-copy">{g.note}</p>
                    </div>
                    <p className="rowline__meta">{g.meta}</p>
                  </div>
                ))}
          </div>
          <div style={{ marginTop: "2.2rem" }} data-reveal>
            <Link to="/gatherings" className="tlink">
              {t.home.weekLink}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- giving band ---------- */}
      <section className="section--tight">
        <div className="shell">
          <div className="split split--lean-l" style={{ alignItems: "center" }}>
            <div className="figure" data-parallax style={{ aspectRatio: "5 / 4" }} data-reveal>
              <img src="/img/giving.jpg" alt={t.home.giveAlt} loading="lazy" />
            </div>
            <div>
              <span className="minititle" data-reveal>
                {t.home.giveKicker}
              </span>
              <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
                {t.home.giveTitle}
              </h2>
              <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
                {t.home.giveBody}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "1.6rem 0 0", display: "grid", gap: "0.9rem" }}>
                {funds.map((f) => (
                  <li key={f.label} data-reveal style={{ borderTop: "1px solid var(--line)", paddingTop: "0.9rem" }}>
                    <b className="font-display" style={{ fontSize: "1.25rem", fontWeight: 500 }}>
                      {f.label}
                    </b>
                    <span style={{ color: "var(--ink-soft)" }}> · {f.blurb}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "2rem" }} data-reveal>
                <Link to="/give" className="btn">
                  {t.home.giveCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- prayer strip ---------- */}
      <section className="band-wine section--tight">
        <div className="shell" style={{ textAlign: "center" }}>
          <h2 className="display-2" data-reveal>
            {t.home.prayerTitle}
          </h2>
          <p
            className="lede"
            style={{ margin: "1.4rem auto 0", maxWidth: "44ch", color: "rgba(248,245,239,0.85)" }}
            data-reveal
          >
            {t.home.prayerBody}
          </p>
          <div style={{ marginTop: "2.2rem" }} data-reveal>
            <Link to="/prayer" className="btn btn--on-dark">
              {t.home.prayerCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

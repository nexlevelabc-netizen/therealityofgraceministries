import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { gsap } from "gsap";
import { MaskedLines } from "@/components/PageHero";
import { NoticeRail } from "@/components/NoticeRail";
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
          <h1 className="display-hero hero__title">
            <MaskedLines
              lines={t.home.heroTitle.map((p, i) =>
                p.i ? <em key={i}>{p.t}</em> : <span key={i}>{p.t}</span>
              )}
            />
          </h1>
          <div className="hero__actions">
            <Link to="/visit" className="btn btn--on-dark">
              {t.home.heroVisit}
            </Link>
            <Link to="/live" className="btn btn--ghost-dark">
              {t.home.heroLive}
            </Link>
            <Link to="/gatherings" className="btn btn--ghost-dark">
              {t.home.heroSunday}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- floating notice rail ---------- */}
      <NoticeRail />

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

      {/* ---------- three doors: pinned horizontal rail ---------- */}
      <DoorsRail
        kicker={t.home.doorsKicker}
        title={t.home.doorsTitle}
        intro={t.home.doorsIntro}
        slides={[
              {
                img: "/img/hero-worship.jpg",
                alt: t.home.door1Alt,
                tag: t.home.door1Tag,
                title: t.home.door1Title,
                body: t.home.door1Body,
                link: { to: "/gatherings", label: t.home.door1Link },
              },
              {
                img: "/img/hero-word.jpg",
                alt: t.home.door2Alt,
                tag: t.home.door2Tag,
                title: t.home.door2Title,
                body: t.home.door2Body,
                link: { to: "/believe", label: t.home.door2Link },
              },
              {
                img: "/img/community.jpg",
                alt: t.home.door3Alt,
                tag: t.home.door3Tag,
                title: t.home.door3Title,
                body: t.home.door3Body,
                link: { to: "/contact", label: t.home.door3Link },
              },
            ]}
          />

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

type DoorSlide = {
  img: string;
  alt: string;
  tag: string;
  title: string;
  body: string;
  link: { to: string; label: string };
};

function DoorsRail({
  kicker,
  title,
  intro,
  slides,
}: {
  kicker: string;
  title: string;
  intro: string;
  slides: DoorSlide[];
}) {
  const { lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!section || !track || !bar) return;
    const isRtl = lang === "ar";
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.to(track, {
        x: () => {
          const viewport = track.parentElement;
          const distance = Math.max(0, track.scrollWidth - (viewport ? viewport.clientWidth : 0));
          return isRtl ? distance : -distance;
        },
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            bar.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "x" });
        bar.style.transform = "scaleX(0)";
      };
    });
    return () => mm.revert();
  }, [lang]);

  return (
    <section className="doors-hpin" ref={sectionRef} aria-label={title}>
      <div className="doors-hpin__sticky">
        <div className="shell doors-hpin__head">
          <div className="split split--lean-r" style={{ alignItems: "end" }}>
            <div>
              <span className="minititle" data-reveal>
                {kicker}
              </span>
              <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
                {title}
              </h2>
            </div>
            <p className="body-copy" data-reveal>
              {intro}
            </p>
          </div>
        </div>
        <div className="doors-hpin__viewport">
          <div className="doors-hpin__track" ref={trackRef}>
            {slides.map((s, i) => (
              <article className="doors-card" key={s.tag} data-reveal>
                <div className="doors-card__figure">
                  <img src={s.img} alt={s.alt} loading={i === 0 ? "eager" : "lazy"} />
                  <span className="doors-card__n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="doors-card__body">
                  <p className="figure-caption">{s.tag}</p>
                  <h3 className="doors-card__title">{s.title}</h3>
                  <p className="body-copy">{s.body}</p>
                  <p style={{ marginTop: "1.4rem" }}>
                    <Link to={s.link.to} className="tlink">
                      {s.link.label}
                    </Link>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="shell doors-hpin__bar" aria-hidden="true">
          <span ref={barRef} />
        </div>
      </div>
    </section>
  );
}

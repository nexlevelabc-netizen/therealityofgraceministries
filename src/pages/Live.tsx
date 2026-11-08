import { useMemo, useState } from "react";
import { Link } from "react-router";
import { LANGUAGES, SITE, type LanguageCode } from "@/lib/site";
import { useLang } from "@/i18n";

export default function Live() {
  const { t } = useLang();
  const [lang, setLang] = useState<LanguageCode>("en");

  const embedUrl = useMemo(() => {
    const cc = LANGUAGES.find((l) => l.code === lang)?.cc ?? "en";
    const params = new URLSearchParams({
      autoplay: "0",
      rel: "0",
      cc_load_policy: "1",
      cc_lang_pref: cc,
      hl: cc,
    });
    return `https://www.youtube.com/embed/live_stream?channel=${SITE.youtubeChannelId}&${params.toString()}`;
  }, [lang]);

  return (
    <>
      <section className="band-dark" style={{ paddingTop: "clamp(8rem, 14vw, 11rem)" }}>
        <div className="shell section--tight" style={{ paddingBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <span className="minititle" data-reveal>
            {t.live.kicker}
          </span>
          <h1 className="display-hero" style={{ marginTop: "1.4rem", fontSize: "clamp(2.6rem, 6vw, 5rem)" }}>
            {t.live.titleA}{" "}
            <em className="serif-italic" style={{ color: "var(--gold-bright)" }}>
              {t.live.titleEm}
            </em>
          </h1>
          <p className="lede" style={{ marginTop: "1.6rem", maxWidth: "36ch" }} data-reveal>
            {t.live.intro}
          </p>

          <div style={{ marginTop: "2.4rem" }} data-reveal>
            <p
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "var(--gold-bright)",
                marginBottom: "0.9rem",
              }}
            >
              {t.live.chooseLang}
            </p>
            <div className="lang-row" role="group" aria-label={t.live.chooseLang}>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className="lang-btn"
                  style={{ color: lang === l.code ? "var(--gold-bright)" : "rgba(248,245,239,0.7)" }}
                  data-active={lang === l.code}
                  onClick={() => setLang(l.code)}
                  aria-pressed={lang === l.code}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <p style={{ marginTop: "0.9rem", fontSize: "0.85rem", color: "rgba(248,245,239,0.6)", maxWidth: "52ch" }}>
              {t.live.captionNote}
            </p>
          </div>

          <div className="live-frame" style={{ marginTop: "2.4rem" }} data-reveal>
            <iframe
              key={lang}
              src={embedUrl}
              title={t.live.playerTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="shell split split--lean-r" style={{ alignItems: "center" }}>
          <div>
            <span className="minititle" data-reveal>
              {t.live.archiveKicker}
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              {t.live.archiveTitle}
            </h2>
            <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
              {t.live.archiveBody}
            </p>
            <div style={{ marginTop: "2rem", display: "flex", gap: "1.6rem", flexWrap: "wrap" }} data-reveal>
              <a href={SITE.socials[0].href} target="_blank" rel="noopener noreferrer" className="tlink">
                {t.live.archiveLink}
              </a>
              <Link to="/gatherings" className="tlink">
                {t.live.nextLink}
              </Link>
            </div>
          </div>
          <div className="figure" data-parallax style={{ aspectRatio: "16 / 11" }} data-reveal>
            <img src="/img/live.jpg" alt={t.live.archiveAlt} loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}

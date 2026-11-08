import { useMemo, useState } from "react";
import { Link } from "react-router";
import { LANGUAGES, SITE, type LanguageCode } from "@/lib/site";

export default function Live() {
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
            The live room
          </span>
          <h1 className="display-hero" style={{ marginTop: "1.4rem", fontSize: "clamp(2.6rem, 6vw, 5rem)" }}>
            Church, <em className="serif-italic" style={{ color: "var(--gold-bright)" }}>wherever you are</em>
          </h1>
          <p className="lede" style={{ marginTop: "1.6rem", maxWidth: "36ch" }} data-reveal>
            When we are live, the player below carries the service. When we are not, it rests until
            the next gathering.
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
              Choose your caption language
            </p>
            <div className="lang-row" role="group" aria-label="Caption language">
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
              Captions open automatically in your chosen language once the stream begins. Switch
              language at any time and the player will reload with it.
            </p>
          </div>

          <div className="live-frame" style={{ marginTop: "2.4rem" }} data-reveal>
            <iframe
              key={lang}
              src={embedUrl}
              title="The Reality of Grace Ministries live stream"
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
              Missed it live
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              The archive never closes
            </h2>
            <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
              Every service stays on our YouTube channel, free to revisit, share, or send to
              someone who needs it.
            </p>
            <div style={{ marginTop: "2rem", display: "flex", gap: "1.6rem", flexWrap: "wrap" }} data-reveal>
              <a href={SITE.socials[0].href} target="_blank" rel="noopener noreferrer" className="tlink">
                Open the YouTube archive
              </a>
              <Link to="/gatherings" className="tlink">
                When we gather next
              </Link>
            </div>
          </div>
          <div className="figure" data-parallax style={{ aspectRatio: "16 / 11" }} data-reveal>
            <img src="/img/live.jpg" alt="The stage during a live service" loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import Hls from "hls.js";
import { LANGUAGES, SITE, type LanguageCode } from "@/lib/site";
import { trpc } from "@/providers/trpc";
import { useLang } from "@/i18n";

/** Native HTML5 player for the ministry's own HLS broadcast */
function OwnStreamPlayer({ src, title }: { src: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: Hls | null = null;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari plays HLS natively
      video.src = src;
    } else if (Hls.isSupported()) {
      hls = new Hls({ liveSyncDurationCount: 3 });
      hls.loadSource(src);
      hls.attachMedia(video);
    }
    return () => {
      hls?.destroy();
    };
  }, [src]);

  return (
    <div className="live-frame">
      <video
        ref={videoRef}
        title={title}
        controls
        playsInline
        style={{ width: "100%", height: "100%", background: "#000" }}
      />
    </div>
  );
}

/* Gathering windows in London time: the channel live view is only worth
   showing when a service is plausibly on air. */
const WINDOWS: { day: number; start: number; end: number }[] = [
  { day: 0, start: 9.25, end: 14 }, // Sunday celebration
  { day: 3, start: 18.25, end: 22 }, // Wednesday word and prayer
  { day: 5, start: 18.75, end: 23.5 }, // Friday grace groups and nights of grace
  { day: 6, start: 10.25, end: 14 }, // Saturday outreach
];

function isGatheringWindow() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);
  const dayName = parts.find((p) => p.type === "weekday")?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dayName.slice(0, 3));
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const t = hour + minute / 60;
  return WINDOWS.some((w) => w.day === day && t >= w.start && t <= w.end);
}

export default function Live() {
  const { t } = useLang();
  const [lang, setLang] = useState<LanguageCode>("en");
  const streamConfig = trpc.stream.config.useQuery();
  const ownHls = streamConfig.data?.hlsUrl ?? null;
  const pinnedVideo = streamConfig.data?.youtubeVideoId ?? null;

  const embedUrl = useMemo(() => {
    const cc = LANGUAGES.find((l) => l.code === lang)?.cc ?? "en";
    const params = new URLSearchParams({
      autoplay: "0",
      rel: "0",
      cc_load_policy: "1",
      cc_lang_pref: cc,
      hl: cc,
    });
    if (pinnedVideo) {
      return `https://www.youtube.com/embed/${pinnedVideo}?${params.toString()}`;
    }
    // Channel live view when broadcasting. Between gatherings YouTube shows
    // an error there, so the player rests on the latest uploads instead.
    if (isGatheringWindow()) {
      return `https://www.youtube.com/embed/live_stream?channel=${SITE.youtubeChannelId}&${params.toString()}`;
    }
    params.set("listType", "playlist");
    params.set("list", `UU${SITE.youtubeChannelId.slice(2)}`);
    return `https://www.youtube.com/embed?${params.toString()}`;
  }, [lang, pinnedVideo]);

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

          {ownHls ? (
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
                {t.live.ownStreamBadge}
              </p>
              <p style={{ fontSize: "0.85rem", color: "rgba(248,245,239,0.6)", maxWidth: "52ch" }}>
                {t.live.ownStreamNote}
              </p>
            </div>
          ) : (
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
          )}

          <div style={{ marginTop: "2.4rem" }} data-reveal>
            {ownHls ? (
              <OwnStreamPlayer src={ownHls} title={t.live.playerTitle} />
            ) : (
              <div className="live-frame">
                <iframe
                  key={lang}
                  src={embedUrl}
                  title={t.live.playerTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
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

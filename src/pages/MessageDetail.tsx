import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { useLang } from "@/i18n";
import { MessageCard } from "./Messages";

export default function MessageDetail() {
  const { t, locale } = useLang();
  const { id } = useParams();
  const msgId = Number(id);
  const msg = trpc.messages.byId.useQuery({ id: msgId }, { enabled: Number.isFinite(msgId) });
  const related = trpc.messages.related.useQuery(
    { id: msgId, topics: msg.data?.topics ?? [] },
    { enabled: Boolean(msg.data) }
  );
  const view = trpc.messages.view.useMutation();
  const counted = useRef(false);

  useEffect(() => {
    if (msg.data && !counted.current) {
      counted.current = true;
      view.mutate({ id: msg.data.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg.data?.id]);

  if (!Number.isFinite(msgId) || (msg.isFetched && !msg.data)) {
    return (
      <section className="section">
        <div className="shell">
          <p className="body-copy">{t.library.emptyTitle}</p>
          <div style={{ marginTop: "1.4rem" }}>
            <Link to="/messages" className="tlink">
              {t.library.back}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const m = msg.data;
  if (!m) return null;

  const date = new Date(m.preachedAt).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <Link to="/messages" className="tlink">
            {t.library.back}
          </Link>
          <h1 className="display-hero" style={{ marginTop: "1.6rem", fontSize: "clamp(2.4rem, 5.4vw, 4.4rem)" }}>
            {m.title}
          </h1>
          <p className="lede" style={{ marginTop: "1.4rem", maxWidth: "52ch" }}>
            {t.library.preachedOn} {date}
            {m.speaker ? ` · ${m.speaker}` : ""}
            {m.scripture ? ` · ${m.scripture}` : ""}
          </p>
        </div>
      </section>

      <section className="section--tight">
        <div className="shell" style={{ maxWidth: "64rem" }}>
          {m.youtubeId ? (
            <div className="live-frame" data-reveal>
              <iframe
                src={`https://www.youtube.com/embed/${m.youtubeId}?rel=0`}
                title={m.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : m.audioMediaId ? (
            <div className="audio-frame" data-reveal>
              <audio controls preload="metadata" src={`/api/media/${m.audioMediaId}`} style={{ width: "100%" }}>
                {m.title}
              </audio>
            </div>
          ) : null}

          {m.description ? (
            <p className="body-copy" style={{ marginTop: "2.2rem", fontSize: "1.1rem" }} data-reveal>
              {m.description}
            </p>
          ) : null}

          {m.topics?.length ? (
            <div className="event-filters" style={{ marginTop: "1.8rem" }} data-reveal>
              {m.topics.map((topic: string) => (
                <Link key={topic} to={`/messages?topic=${encodeURIComponent(topic)}`} className="event-filter">
                  {(t.library.topics as any)[topic] ?? topic}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {related.data && related.data.length > 0 ? (
        <section className="section--tight" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
          <div className="shell">
            <span className="minititle" data-reveal>
              {t.library.relatedKicker}
            </span>
            <div className="msg-grid" style={{ marginTop: "2rem" }}>
              {related.data.map((r) => (
                <MessageCard key={r.id} m={r} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

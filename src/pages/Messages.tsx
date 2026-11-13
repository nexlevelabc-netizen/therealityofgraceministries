import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { PageHero } from "@/components/PageHero";
import { trpc } from "@/providers/trpc";
import { MESSAGE_TOPICS, SITE } from "@/lib/site";
import { useLang } from "@/i18n";

type Sort = "latest" | "trending";

export function MessageCard({ m }: { m: any }) {
  const { t, locale } = useLang();
  const date = new Date(m.preachedAt).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });
  const thumb = m.youtubeId ? `https://i.ytimg.com/vi/${m.youtubeId}/hqdefault.jpg` : null;
  return (
    <Link to={`/messages/${m.id}`} className="msg-card" data-reveal>
      <div className="msg-card__figure">
        {thumb ? (
          <img src={thumb} alt="" loading="lazy" />
        ) : (
          <span className="msg-card__audio" aria-hidden="true">
            {t.library.listenCta}
          </span>
        )}
        {m.messageOfMonth ? <span className="msg-card__flag">{t.library.momKicker}</span> : null}
      </div>
      <div className="msg-card__body">
        <p className="msg-card__meta">
          {date}
          {m.speaker ? ` · ${m.speaker}` : ""}
        </p>
        <h3 className="msg-card__title">{m.title}</h3>
        {m.scripture ? <p className="msg-card__scripture">{m.scripture}</p> : null}
        {m.topics?.length ? (
          <p className="msg-card__topics">
            {m.topics
              .map((topic: string) => (t.library.topics as any)[topic] ?? topic)
              .join(" · ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export default function Messages() {
  const { t } = useLang();
  const [params] = useSearchParams();
  const initialTopic = params.get("topic") ?? "";
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState(initialTopic);
  const [sort, setSort] = useState<Sort>("latest");

  const list = trpc.messages.list.useQuery({ search, topic, sort, limit: 60 });
  const mom = trpc.messages.ofTheMonth.useQuery();
  const momItem = mom.data ?? null;
  const items = (list.data ?? []).filter((m) => m.id !== momItem?.id);

  return (
    <>
      <PageHero
        kicker={t.library.kicker}
        title={
          <>
            {t.library.titleA}{" "}
            <em className="serif-italic" style={{ color: "var(--wine)" }}>
              {t.library.titleEm}
            </em>
          </>
        }
        intro={t.library.intro}
      />

      {momItem ? (
        <section className="band-dark" style={{ paddingBlock: "clamp(3rem, 6vw, 5rem)" }}>
          <div className="shell">
            <span className="minititle" data-reveal>
              {t.library.momKicker}
            </span>
            <div className="mom-card" data-reveal>
              <div className="mom-card__figure">
                {momItem.youtubeId ? (
                  <img src={`https://i.ytimg.com/vi/${momItem.youtubeId}/maxresdefault.jpg`} alt="" loading="lazy" />
                ) : (
                  <span className="msg-card__audio" aria-hidden="true">
                    {t.library.listenCta}
                  </span>
                )}
              </div>
              <div>
                <h2 className="display-2">{momItem.title}</h2>
                {momItem.description ? (
                  <p className="body-copy" style={{ marginTop: "1rem", color: "rgba(248,245,239,0.8)" }}>
                    {momItem.description}
                  </p>
                ) : null}
                <p className="msg-card__meta" style={{ marginTop: "1.1rem", color: "var(--gold-bright)" }}>
                  {momItem.speaker ?? ""}
                  {momItem.scripture ? ` · ${momItem.scripture}` : ""}
                </p>
                <div style={{ marginTop: "1.8rem" }}>
                  <Link to={`/messages/${momItem.id}`} className="btn btn--gold">
                    {t.library.momCta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section--tight">
        <div className="shell">
          <div className="lib-controls" data-reveal>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.library.searchPh}
              aria-label={t.library.searchPh}
              className="lib-search"
            />
            <div className="lib-sort" role="group" aria-label={t.library.byNeed}>
              <button
                type="button"
                className={`event-filter${sort === "latest" ? " is-active" : ""}`}
                onClick={() => setSort("latest")}
              >
                {t.library.sortLatest}
              </button>
              <button
                type="button"
                className={`event-filter${sort === "trending" ? " is-active" : ""}`}
                onClick={() => setSort("trending")}
              >
                {t.library.sortTrending}
              </button>
            </div>
          </div>

          <div className="event-filters" data-reveal role="group" aria-label={t.library.byNeed}>
            <button
              type="button"
              className={`event-filter${topic === "" ? " is-active" : ""}`}
              onClick={() => setTopic("")}
            >
              {t.library.allTopics}
            </button>
            {MESSAGE_TOPICS.map((id) => (
              <button
                key={id}
                type="button"
                className={`event-filter${topic === id ? " is-active" : ""}`}
                aria-pressed={topic === id}
                onClick={() => setTopic(topic === id ? "" : id)}
              >
                {(t.library.topics as any)[id]}
              </button>
            ))}
          </div>

          {list.data && list.data.length === 0 && !momItem ? (
            <div className="lib-empty" data-reveal>
              <h2 className="display-2">{t.library.libraryEmptyTitle}</h2>
              <p className="body-copy" style={{ marginTop: "1rem" }}>
                {t.library.libraryEmptyBody}
              </p>
              <div style={{ marginTop: "1.8rem" }}>
                <a href={SITE.socials[0].href} target="_blank" rel="noopener noreferrer" className="btn">
                  {t.library.youtubeCta}
                </a>
              </div>
            </div>
          ) : items.length === 0 && list.data ? (
            <div className="lib-empty" data-reveal>
              <h2 className="display-3">{t.library.emptyTitle}</h2>
              <p className="body-copy" style={{ marginTop: "0.8rem" }}>
                {t.library.emptyBody}
              </p>
            </div>
          ) : (
            <div className="msg-grid">
              {items.map((m) => (
                <MessageCard key={m.id} m={m} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

import { Link } from "react-router";
import { PageHero } from "@/components/PageHero";
import { trpc } from "@/providers/trpc";
import { useLang } from "@/i18n";

export default function Ministries() {
  const { t } = useLang();
  const ministries = trpc.ministries.list.useQuery();
  const items = ministries.data ?? [];

  return (
    <>
      <PageHero
        kicker={t.ministryPage.kicker}
        title={
          <>
            {t.ministryPage.titleA}{" "}
            <em className="serif-italic" style={{ color: "var(--wine)" }}>
              {t.ministryPage.titleEm}
            </em>
          </>
        }
        intro={t.ministryPage.intro}
      />

      <section className="section--tight">
        <div className="shell">
          {items.map((m, i) => (
            <article key={m.id} className={`min-row${i % 2 === 1 ? " min-row--flip" : ""}`} data-reveal>
              <div className="min-row__figure">
                {m.photoMediaId ? (
                  <img src={`/api/media/${m.photoMediaId}`} alt={m.name} loading="lazy" />
                ) : (
                  <span className="min-row__initial" aria-hidden="true">
                    {m.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-row__body">
                <h2 className="display-3">{m.name}</h2>
                {m.summary ? <p className="lede" style={{ marginTop: "0.9rem" }}>{m.summary}</p> : null}
                {m.body ? (
                  <p className="body-copy" style={{ marginTop: "1rem" }}>
                    {m.body}
                  </p>
                ) : null}
                <div style={{ marginTop: "1.6rem" }}>
                  <Link to="/contact" className="tlink">
                    {t.ministryPage.joinCta}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

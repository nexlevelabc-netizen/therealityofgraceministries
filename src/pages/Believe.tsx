import { Link } from "react-router";
import { PageHero } from "@/components/PageHero";
import { useLang } from "@/i18n";

export default function Believe() {
  const { t } = useLang();

  const beliefs = [
    { title: t.believe.b1t, body: t.believe.b1b },
    { title: t.believe.b2t, body: t.believe.b2b },
    { title: t.believe.b3t, body: t.believe.b3b },
    { title: t.believe.b4t, body: t.believe.b4b },
    { title: t.believe.b5t, body: t.believe.b5b },
    { title: t.believe.b6t, body: t.believe.b6b },
    { title: t.believe.b7t, body: t.believe.b7b },
  ];

  return (
    <>
      <PageHero
        kicker={t.believe.kicker}
        title={
          <>
            {t.believe.titleA}{" "}
            <em className="serif-italic" style={{ color: "var(--wine)" }}>
              {t.believe.titleEm}
            </em>
          </>
        }
        intro={t.believe.intro}
      />

      <section className="section--tight">
        <div className="shell--narrow" style={{ marginInline: "auto" }}>
          {beliefs.map((b, i) => (
            <div
              key={b.title}
              data-reveal
              style={{
                display: "grid",
                gap: "0.8rem",
                gridTemplateColumns: "1fr",
                paddingBlock: "2rem",
                borderTop: "1px solid var(--line)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "1.2rem" }}>
                <span className="minititle minititle--bare">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="display-3">{b.title}</h2>
              </div>
              <p className="body-copy">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="band-dark section--tight">
        <div className="shell--narrow" style={{ marginInline: "auto", textAlign: "center" }}>
          <p className="lede" style={{ color: "var(--cream)", maxWidth: "40ch", marginInline: "auto" }} data-reveal>
            {t.believe.ctaBody}
          </p>
          <div style={{ marginTop: "2rem", display: "flex", gap: "0.9rem", justifyContent: "center", flexWrap: "wrap" }} data-reveal>
            <Link to="/visit" className="btn btn--gold">
              {t.believe.ctaVisit}
            </Link>
            <Link to="/prayer" className="btn btn--ghost-dark">
              {t.believe.ctaTalk}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

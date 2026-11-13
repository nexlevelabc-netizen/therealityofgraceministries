import { Link } from "react-router";
import { PageHero } from "@/components/PageHero";
import { useLang } from "@/i18n";
import { trpc } from "@/providers/trpc";

export default function About() {
  const { t } = useLang();
  const leaders = trpc.leaders.list.useQuery();

  const values = [
    { n: "01", title: t.about.v1t, body: t.about.v1b },
    { n: "02", title: t.about.v2t, body: t.about.v2b },
    { n: "03", title: t.about.v3t, body: t.about.v3b },
    { n: "04", title: t.about.v4t, body: t.about.v4b },
  ];

  return (
    <>
      <PageHero
        kicker={t.about.kicker}
        title={
          <>
            {t.about.titleA}{" "}
            <em className="serif-italic" style={{ color: "var(--wine)" }}>
              {t.about.titleEm}
            </em>
          </>
        }
        intro={t.about.intro}
      />

      <section className="section--tight">
        <div className="shell split split--lean-l" style={{ alignItems: "center" }}>
          <div>
            <span className="minititle" data-reveal>
              {t.about.storyKicker}
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              {t.about.storyTitle}
            </h2>
            <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
              {t.about.storyP1}
            </p>
            <p className="body-copy" style={{ marginTop: "1.1rem" }} data-reveal>
              {t.about.storyP2}
            </p>
          </div>
          <div className="figure" data-parallax style={{ aspectRatio: "4 / 5" }} data-reveal>
            <img src="/img/hero-welcome.jpg" alt={t.about.storyAlt} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="band-dark section">
        <div className="shell">
          <span className="minititle" data-reveal>
            {t.about.valuesKicker}
          </span>
          <h2 className="display-2" style={{ marginTop: "1.2rem", marginBottom: "3rem" }} data-reveal>
            {t.about.valuesTitle}
          </h2>
          <div
            style={{
              display: "grid",
              gap: "2.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
            }}
          >
            {values.map((v, i) => (
              <div key={v.n} data-reveal style={{ ["--reveal-delay" as string]: `${i * 0.1}s` }}>
                <span className="statnum">{v.n}</span>
                <h3 className="display-3" style={{ margin: "0.8rem 0 0.7rem" }}>
                  {v.title}
                </h3>
                <p className="body-copy">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell split split--lean-r" style={{ alignItems: "center" }}>
          <div className="figure" data-parallax style={{ aspectRatio: "5 / 4" }} data-reveal>
            <img src="/img/community.jpg" alt={t.about.leadAlt} loading="lazy" />
          </div>
          <div>
            <span className="minititle" data-reveal>
              {t.about.leadKicker}
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              {t.about.leadTitle}
            </h2>
            <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
              {t.about.leadBody}
            </p>
            <div style={{ marginTop: "2rem", display: "flex", gap: "1.6rem", flexWrap: "wrap" }} data-reveal>
              <Link to="/prayer" className="tlink">
                {t.about.leadPrayer}
              </Link>
              <Link to="/believe" className="tlink">
                {t.about.leadBelieve}
              </Link>
            </div>
          </div>
        </div>
        {(leaders.data ?? []).length > 0 && (
          <div className="lead-people" style={{ marginTop: "4rem" }}>
            {(leaders.data ?? []).map((leader, i) => (
              <article className="lead-card" key={leader.id} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 4) * 0.08}s` }}>
                {leader.photoMediaId ? (
                  <span className="lead-card__photo">
                    <img src={`/api/media/${leader.photoMediaId}`} alt={leader.name} loading="lazy" />
                  </span>
                ) : (
                  <span className="lead-card__photo lead-card__initial">{leader.name.charAt(0)}</span>
                )}
                <h3 className="lead-card__name">{leader.name}</h3>
                {leader.role && <p className="lead-card__role">{leader.role}</p>}
                {leader.bio && <p className="lead-card__bio">{leader.bio}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

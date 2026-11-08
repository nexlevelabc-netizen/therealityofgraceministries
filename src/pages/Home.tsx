import { Link } from "react-router";
import { MaskedLines } from "@/components/PageHero";
import { trpc } from "@/providers/trpc";
import { GATHERING_RHYTHM, GIVE_FUNDS, LANGUAGES, SITE } from "@/lib/site";

export default function Home() {
  const gatherings = trpc.events.upcoming.useQuery({ limit: 3 });

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
                lines={[
                  <>Grace is</>,
                  <>
                    <em>a reality</em>
                  </>,
                  <>for real life.</>,
                ]}
              />
            </h1>
          </div>
          <div className="hero__row hero__row--offset">
            <div className="hero__meta">
              <span className="minititle">The Reality of Grace Ministries Int'l</span>
              <p>
                One family across nations and languages, gathering in person and online, learning
                to live inside the finished work of Christ.
              </p>
            </div>
            <div className="hero__actions">
              <Link to="/visit" className="btn btn--on-dark">
                Plan your first visit
              </Link>
              <Link to="/live" className="btn btn--ghost-dark">
                Watch this Sunday live
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- statement ---------- */}
      <section className="section">
        <div className="shell">
          <span className="minititle" data-reveal>
            Why we exist
          </span>
          <p className="statement" style={{ marginTop: "1.8rem", maxWidth: "26ch" }} data-reveal>
            We exist so that ordinary people can meet an extraordinary God, in a language they
            understand, inside <em>a family that stays</em>.
          </p>
          <div style={{ marginTop: "2.4rem" }} data-reveal>
            <Link to="/about" className="tlink">
              The story of the house
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
                Life together
              </span>
              <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
                Three doors into the house
              </h2>
            </div>
            <p className="body-copy" data-reveal>
              There is no wrong way in. Come as you are, bring your questions, and grow at the
              pace grace sets for you.
            </p>
          </div>

          <div className="grid-3">
            <article data-reveal>
              <div className="figure" data-parallax style={{ aspectRatio: "4 / 5" }}>
                <img src="/img/hero-worship.jpg" alt="Hands raised in worship during a Sunday celebration" loading="lazy" />
              </div>
              <p className="figure-caption">01 · Gather</p>
              <h3 className="display-3" style={{ margin: "0.5rem 0 0.8rem" }}>
                Sundays that feel like home
              </h3>
              <p className="body-copy">
                Whole hearted worship, the word taught with clarity, and translation on screen so
                no one is left outside the moment.
              </p>
              <p style={{ marginTop: "1.2rem" }}>
                <Link to="/gatherings" className="tlink">
                  See the rhythm of the week
                </Link>
              </p>
            </article>
            <article data-reveal style={{ ["--reveal-delay" as string]: "0.12s" }}>
              <div className="figure" data-parallax style={{ aspectRatio: "4 / 5" }}>
                <img src="/img/hero-word.jpg" alt="Open hands resting on an open bible in warm light" loading="lazy" />
              </div>
              <p className="figure-caption">02 · Grow</p>
              <h3 className="display-3" style={{ margin: "0.5rem 0 0.8rem" }}>
                Roots that go deep
              </h3>
              <p className="body-copy">
                Midweek teaching, grace groups in homes, and discipleship that turns belief into
                everyday character.
              </p>
              <p style={{ marginTop: "1.2rem" }}>
                <Link to="/believe" className="tlink">
                  What anchors us
                </Link>
              </p>
            </article>
            <article data-reveal style={{ ["--reveal-delay" as string]: "0.24s" }}>
              <div className="figure" data-parallax style={{ aspectRatio: "4 / 5" }}>
                <img src="/img/community.jpg" alt="The church family sharing a meal together" loading="lazy" />
              </div>
              <p className="figure-caption">03 · Go</p>
              <h3 className="display-3" style={{ margin: "0.5rem 0 0.8rem" }}>
                Love with its sleeves rolled up
              </h3>
              <p className="body-copy">
                Food on tables, visits to the lonely, and practical help for neighbours who never
                asked for a sermon, only a friend.
              </p>
              <p style={{ marginTop: "1.2rem" }}>
                <Link to="/contact" className="tlink">
                  Serve with us
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
              Church without borders
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              Wherever you are, <em className="serif-italic" style={{ color: "var(--gold-bright)" }}>the service reaches you</em>
            </h2>
            <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
              Every gathering streams live with on screen translation in{" "}
              {LANGUAGES.filter((l) => l.code !== "en").map((l) => l.label).join(", ")} and
              English, so distance and language never decide who belongs.
            </p>
            <div style={{ marginTop: "2rem", display: "flex", gap: "0.9rem", flexWrap: "wrap" }} data-reveal>
              <Link to="/live" className="btn btn--gold">
                Enter the live room
              </Link>
              <a
                href={SITE.socials[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost-dark"
              >
                Past services on YouTube
              </a>
            </div>
          </div>
          <div className="figure" data-parallax style={{ aspectRatio: "16 / 11" }} data-reveal>
            <img src="/img/live.jpg" alt="The stage during a live service with warm lighting" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ---------- gatherings preview ---------- */}
      <section className="section--tight">
        <div className="shell">
          <div className="split split--lean-r" style={{ alignItems: "end", marginBottom: "2.4rem" }}>
            <div>
              <span className="minititle" data-reveal>
                This week and next
              </span>
              <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
                Come and sit with us
              </h2>
            </div>
            <div data-reveal>
              {GATHERING_RHYTHM.slice(0, 3).map((g) => (
                <p key={g.day} className="body-copy" style={{ marginBottom: "0.2rem" }}>
                  {g.day} · {g.time} · {g.name}
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
                      {new Date(e.startsAt).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                      {" · "}
                      {new Date(e.startsAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {e.location ? ` · ${e.location}` : ""}
                    </p>
                  </div>
                ))
              : GATHERING_RHYTHM.map((g) => (
                  <div className="rowline" key={g.day} data-reveal>
                    <div>
                      <p className="rowline__title">{g.name}</p>
                      <p className="body-copy">{g.note}</p>
                    </div>
                    <p className="rowline__meta">
                      {g.day} · {g.time}
                    </p>
                  </div>
                ))}
          </div>
          <div style={{ marginTop: "2.2rem" }} data-reveal>
            <Link to="/gatherings" className="tlink">
              The full calendar
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- giving band ---------- */}
      <section className="section--tight">
        <div className="shell">
          <div className="split split--lean-l" style={{ alignItems: "center" }}>
            <div className="figure" data-parallax style={{ aspectRatio: "5 / 4" }} data-reveal>
              <img src="/img/giving.jpg" alt="An offering being placed into a basket in warm light" loading="lazy" />
            </div>
            <div>
              <span className="minititle" data-reveal>
                Generosity
              </span>
              <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
                Sow into what outlives you
              </h2>
              <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
                Every gift keeps the doors open, the stream running, the translation flowing and
                the food parcels moving. Choose where your seed goes.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "1.6rem 0 0", display: "grid", gap: "0.9rem" }}>
                {GIVE_FUNDS.map((f) => (
                  <li key={f.id} data-reveal style={{ borderTop: "1px solid var(--line)", paddingTop: "0.9rem" }}>
                    <b className="font-display" style={{ fontSize: "1.25rem", fontWeight: 500 }}>
                      {f.label}
                    </b>
                    <span style={{ color: "var(--ink-soft)" }}> · {f.blurb}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "2rem" }} data-reveal>
                <Link to="/give" className="btn">
                  Give with purpose
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
            You never have to carry it alone
          </h2>
          <p
            className="lede"
            style={{ margin: "1.4rem auto 0", maxWidth: "44ch", color: "rgba(248,245,239,0.85)" }}
            data-reveal
          >
            Our companions respond in seven languages, day and night, and every request is held in
            confidence before God.
          </p>
          <div style={{ marginTop: "2.2rem" }} data-reveal>
            <Link to="/prayer" className="btn btn--on-dark">
              Talk to someone now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

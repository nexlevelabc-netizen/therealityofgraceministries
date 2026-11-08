import { Link } from "react-router";
import { PageHero } from "@/components/PageHero";

const VALUES = [
  {
    n: "01",
    t: "Grace first",
    b: "We lead with what Christ has done, not with what people must do. Everything else grows from that soil.",
  },
  {
    n: "02",
    t: "Every tongue welcome",
    b: "Heaven will be multilingual, so we start now. Translation is not a feature here; it is a conviction.",
  },
  {
    n: "03",
    t: "Family over programme",
    b: "People are not projects. We build tables, not stages, and we stay at them long after the music ends.",
  },
  {
    n: "04",
    t: "Open hands",
    b: "What we receive, we release. Generosity toward our city and the nations is how we say thank you.",
  },
];

export default function About() {
  return (
    <>
      <PageHero
        kicker="About the ministry"
        title={
          <>
            A house built on <em className="serif-italic" style={{ color: "var(--wine)" }}>one message</em>
          </>
        }
        intro="The Reality of Grace Ministries Int'l exists to make the finished work of Christ plain to every person, in every language, on every street we touch."
      />

      <section className="section--tight">
        <div className="shell split split--lean-l" style={{ alignItems: "center" }}>
          <div>
            <span className="minititle" data-reveal>
              Our story
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              From a living room to the nations
            </h2>
            <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
              We began as a handful of believers praying in a living room, convinced that grace is
              not a doctrine to admire but a reality to inhabit. That conviction carried us from
              home gatherings to a worshipping family, and from one city to screens and gatherings
              across nations.
            </p>
            <p className="body-copy" style={{ marginTop: "1.1rem" }} data-reveal>
              Today we are a church that streams in many tongues, feeds its neighbourhood, and
              still prays like that first living room: simply, honestly, and expecting God to move.
            </p>
          </div>
          <div className="figure" data-parallax style={{ aspectRatio: "4 / 5" }} data-reveal>
            <img src="/img/hero-welcome.jpg" alt="Visitors being welcomed at the doors of the church" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="band-dark section">
        <div className="shell">
          <span className="minititle" data-reveal>
            What shapes us
          </span>
          <h2 className="display-2" style={{ marginTop: "1.2rem", marginBottom: "3rem" }} data-reveal>
            Four convictions we refuse to trade
          </h2>
          <div
            style={{
              display: "grid",
              gap: "2.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
            }}
          >
            {VALUES.map((v, i) => (
              <div key={v.n} data-reveal style={{ ["--reveal-delay" as string]: `${i * 0.1}s` }}>
                <span className="statnum">{v.n}</span>
                <h3 className="display-3" style={{ margin: "0.8rem 0 0.7rem" }}>
                  {v.t}
                </h3>
                <p className="body-copy">{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell split split--lean-r" style={{ alignItems: "center" }}>
          <div className="figure" data-parallax style={{ aspectRatio: "5 / 4" }} data-reveal>
            <img src="/img/community.jpg" alt="The church family sharing a meal together" loading="lazy" />
          </div>
          <div>
            <span className="minititle" data-reveal>
              Leadership
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              Led by servants, kept by grace
            </h2>
            <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
              Our pastoral team serves under one assignment: to feed the flock, guard the
              atmosphere of grace, and keep the doors wide open. You will find them approachable,
              present, and first in line to pray with you.
            </p>
            <div style={{ marginTop: "2rem", display: "flex", gap: "1.6rem", flexWrap: "wrap" }} data-reveal>
              <Link to="/prayer" className="tlink">
                Ask a pastor to pray
              </Link>
              <Link to="/believe" className="tlink">
                What we believe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { Link } from "react-router";
import { PageHero } from "@/components/PageHero";

const BELIEFS = [
  {
    t: "The Scriptures",
    b: "The bible is the inspired word of God, trustworthy in all it teaches, and the final authority for faith and life.",
  },
  {
    t: "God",
    b: "One God, eternally existing as Father, Son and Holy Spirit, the maker and keeper of all things.",
  },
  {
    t: "Jesus Christ",
    b: "Fully God and fully man. His death paid for our sin in full, His resurrection sealed our justification, and He lives to intercede for us now.",
  },
  {
    t: "Grace",
    b: "Salvation is a gift from first to last. We are saved by grace through faith, not by works, so that no one can boast and no one needs to despair.",
  },
  {
    t: "The Holy Spirit",
    b: "The Spirit indwells every believer, empowers holy living, and distributes gifts for the building of the church and the healing of the world.",
  },
  {
    t: "The Church",
    b: "One body across every nation and tongue, gathered to worship, scattered to serve, and commissioned to make disciples of all peoples.",
  },
  {
    t: "The Hope",
    b: "Christ will return bodily, the dead will be raised, and God will make all things new. We live and labour in that certainty.",
  },
];

export default function Believe() {
  return (
    <>
      <PageHero
        kicker="What we believe"
        title={
          <>
            The ground <em className="serif-italic" style={{ color: "var(--wine)" }}>we stand on</em>
          </>
        }
        intro="Not a fence to keep people out, but a foundation to build lives on. This is what we preach, teach and sing."
      />

      <section className="section--tight">
        <div className="shell--narrow" style={{ marginInline: "auto" }}>
          {BELIEFS.map((b, i) => (
            <div
              key={b.t}
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
                <h2 className="display-3">{b.t}</h2>
              </div>
              <p className="body-copy">{b.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="band-dark section--tight">
        <div className="shell--narrow" style={{ marginInline: "auto", textAlign: "center" }}>
          <p className="lede" style={{ color: "var(--cream)", maxWidth: "40ch", marginInline: "auto" }} data-reveal>
            Doctrine is only the beginning. The proof of grace is a changed life, and we would love
            to show you one.
          </p>
          <div style={{ marginTop: "2rem", display: "flex", gap: "0.9rem", justifyContent: "center", flexWrap: "wrap" }} data-reveal>
            <Link to="/visit" className="btn btn--gold">
              Plan your first visit
            </Link>
            <Link to="/prayer" className="btn btn--ghost-dark">
              Talk it through with someone
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

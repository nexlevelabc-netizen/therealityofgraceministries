import { Link } from "react-router";
import { PageHero } from "@/components/PageHero";
import { trpc } from "@/providers/trpc";
import { GATHERING_RHYTHM } from "@/lib/site";

export default function Gatherings() {
  const upcoming = trpc.events.upcoming.useQuery({ limit: 30 });

  return (
    <>
      <PageHero
        kicker="Gatherings"
        title={
          <>
            The week has <em className="serif-italic" style={{ color: "var(--wine)" }}>a heartbeat</em>
          </>
        }
        intro="Sundays are the feast, but grace keeps office hours all week. Everything below is open to you."
      />

      <section className="section--tight">
        <div className="shell">
          <span className="minititle" data-reveal>
            Every week
          </span>
          <div style={{ marginTop: "2rem" }}>
            {GATHERING_RHYTHM.map((g) => (
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
        </div>
      </section>

      <section className="section--tight rule-top">
        <div className="shell">
          <span className="minititle" data-reveal>
            Marked in the diary
          </span>
          <h2 className="display-2" style={{ marginTop: "1.2rem", marginBottom: "2rem" }} data-reveal>
            Coming up
          </h2>

          {upcoming.isLoading ? (
            <p className="body-copy">Opening the diary</p>
          ) : upcoming.isError ? (
            <p className="body-copy">
              The calendar could not be reached just now. The weekly rhythm above always stands.
            </p>
          ) : upcoming.data && upcoming.data.length > 0 ? (
            <div>
              {upcoming.data.map((e) => (
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
                      year: "numeric",
                    })}
                    {" · "}
                    {new Date(e.startsAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {e.location ? ` · ${e.location}` : ""}
                    {e.streamUrl ? " · streamed live" : ""}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="body-copy" data-reveal>
              No special dates are published yet beyond the weekly rhythm. New dates appear here as
              they are announced.
            </p>
          )}

          <div style={{ marginTop: "2.4rem", display: "flex", gap: "1.6rem", flexWrap: "wrap" }} data-reveal>
            <Link to="/live" className="tlink">
              Join online instead
            </Link>
            <Link to="/visit" className="tlink">
              Planning your first visit
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import { useState } from "react";
import { Link } from "react-router";
import { PageHero } from "@/components/PageHero";
import { trpc } from "@/providers/trpc";
import { useLang } from "@/i18n";

type Freq = "all" | "daily" | "weekly" | "monthly";

export default function Gatherings() {
  const { t, locale } = useLang();
  const [freq, setFreq] = useState<Freq>("all");
  const events = trpc.events.byFrequency.useQuery({ frequency: freq });

  const filters: { id: Freq; label: string }[] = [
    { id: "all", label: t.gatherings.filterAll },
    { id: "daily", label: t.gatherings.filterDaily },
    { id: "weekly", label: t.gatherings.filterWeekly },
    { id: "monthly", label: t.gatherings.filterMonthly },
  ];

  const freqLabel = (f: "daily" | "weekly" | "monthly") =>
    f === "daily" ? t.gatherings.freqDaily : f === "weekly" ? t.gatherings.freqWeekly : t.gatherings.freqMonthly;

  return (
    <>
      <PageHero
        kicker={t.gatherings.kicker}
        title={
          <>
            {t.gatherings.titleA}{" "}
            <em className="serif-italic" style={{ color: "var(--wine)" }}>
              {t.gatherings.titleEm}
            </em>
          </>
        }
        intro={t.gatherings.intro}
      />

      <section className="section--tight">
        <div className="shell">
          <div className="event-filters" data-reveal role="group" aria-label={t.gatherings.kicker}>
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`event-filter${freq === f.id ? " is-active" : ""}`}
                aria-pressed={freq === f.id}
                onClick={() => setFreq(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "2.4rem" }}>
            {events.isLoading ? (
              <p className="body-copy">{t.gatherings.loading}</p>
            ) : events.isError ? (
              <p className="body-copy">{t.gatherings.errorBody}</p>
            ) : events.data && events.data.length > 0 ? (
              <div>
                {events.data.map((e) => (
                  <div className="rowline" key={e.id} data-reveal>
                    <div>
                      <p className="rowline__title">{e.title}</p>
                      {e.description ? <p className="body-copy">{e.description}</p> : null}
                      <p className="figure-caption" style={{ marginTop: "0.35rem" }}>
                        {freqLabel(e.frequency)}
                        {e.cadence ? ` · ${e.cadence}` : ""}
                      </p>
                    </div>
                    <p className="rowline__meta">
                      {new Date(e.startsAt).toLocaleDateString(locale, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        timeZone: "Europe/London",
                      })}
                      {" · "}
                      {new Date(e.startsAt).toLocaleTimeString(locale, {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Europe/London",
                      })}
                      {e.location ? ` · ${e.location}` : ""}
                      {e.streamUrl ? ` · ${t.gatherings.streamed}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="body-copy" data-reveal>
                {t.gatherings.emptyBody}
              </p>
            )}
          </div>

          <div style={{ marginTop: "2.4rem", display: "flex", gap: "1.6rem", flexWrap: "wrap" }} data-reveal>
            <Link to="/live" className="tlink">
              {t.gatherings.joinOnline}
            </Link>
            <Link to="/visit" className="tlink">
              {t.gatherings.planVisit}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import { Link } from "react-router";
import { PageHero } from "@/components/PageHero";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { fill, useLang } from "@/i18n";

export default function Account() {
  const { t, locale } = useLang();
  const { user, isLoading, isAuthenticated, logout } = useAuth({ redirectOnUnauthenticated: true });
  const giving = trpc.giving.mine.useQuery(undefined, { enabled: isAuthenticated });
  const prayers = trpc.prayer.mine.useQuery(undefined, { enabled: isAuthenticated });

  const fundLabel = (id: string) =>
    id in t.funds ? t.funds[id as keyof typeof t.funds].label : id;

  if (isLoading) {
    return (
      <section className="page-hero">
        <div className="shell">
          <p className="body-copy">{t.account.loading}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        kicker={t.account.kicker}
        title={
          <>
            {t.account.titleA}{" "}
            <em className="serif-italic" style={{ color: "var(--wine)" }}>
              {user?.name || "friend"}
            </em>
          </>
        }
        intro={t.account.intro}
      />

      <section className="section--tight">
        <div className="shell">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
            <span className="minititle">{t.account.givingKicker}</span>
            <button type="button" className="tlink" onClick={() => logout()}>
              {t.account.signOut}
            </button>
          </div>

          {giving.isLoading ? (
            <p className="body-copy">{t.account.gatheringGiving}</p>
          ) : giving.data && giving.data.length > 0 ? (
            <div>
              {giving.data.map((g) => (
                <div className="rowline" key={g.id} data-reveal>
                  <div>
                    <p className="rowline__title">
                      £{(g.amountPence / 100).toFixed(2)}{" "}
                      <span style={{ fontSize: "1.1rem", color: "var(--ink-soft)" }}>
                        {fill(t.account.toFund, { fund: fundLabel(g.fund) })}
                      </span>
                    </p>
                    <p className="body-copy">
                      {g.monthly ? t.account.monthlyGift : t.account.singleGift}
                      {g.giftAid ? ` · ${t.account.giftAid}` : ""}
                    </p>
                  </div>
                  <p className="rowline__meta">
                    {new Date(g.createdAt).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {" · "}
                    {g.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="body-copy" data-reveal>
              {t.account.noGiving}
            </p>
          )}

          <div style={{ marginTop: "3.5rem", marginBottom: "1.5rem" }}>
            <span className="minititle">{t.account.prayerKicker}</span>
          </div>
          {prayers.isLoading ? (
            <p className="body-copy">{t.account.gatheringPrayers}</p>
          ) : prayers.data && prayers.data.length > 0 ? (
            <div>
              {prayers.data.map((p) => (
                <div className="rowline" key={p.id} data-reveal>
                  <div>
                    <p className="body-copy" style={{ color: "var(--ink)" }}>
                      {p.message}
                    </p>
                  </div>
                  <p className="rowline__meta">
                    {new Date(p.createdAt).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "long",
                    })}
                    {` · ${t.account.beingPrayed}`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="body-copy" data-reveal>
              {t.account.noPrayers}
            </p>
          )}

          <div style={{ marginTop: "3rem", display: "flex", gap: "0.9rem", flexWrap: "wrap" }} data-reveal>
            <Link to="/give" className="btn">
              {t.account.giveAgain}
            </Link>
            <Link to="/prayer" className="btn btn--ghost">
              {t.account.askPrayer}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

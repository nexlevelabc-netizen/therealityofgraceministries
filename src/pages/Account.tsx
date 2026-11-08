import { Link } from "react-router";
import { PageHero } from "@/components/PageHero";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { GIVE_FUNDS } from "@/lib/site";

export default function Account() {
  const { user, isLoading, isAuthenticated, logout } = useAuth({ redirectOnUnauthenticated: true });
  const giving = trpc.giving.mine.useQuery(undefined, { enabled: isAuthenticated });
  const prayers = trpc.prayer.mine.useQuery(undefined, { enabled: isAuthenticated });

  if (isLoading) {
    return (
      <section className="page-hero">
        <div className="shell">
          <p className="body-copy">Opening your records</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        kicker="Members"
        title={
          <>
            Welcome, <em className="serif-italic" style={{ color: "var(--wine)" }}>{user?.name || "friend"}</em>
          </>
        }
        intro="Everything you have sown and everything you have asked us to carry, in one quiet place."
      />

      <section className="section--tight">
        <div className="shell">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
            <span className="minititle">Your giving</span>
            <button type="button" className="tlink" onClick={() => logout()}>
              Sign out
            </button>
          </div>

          {giving.isLoading ? (
            <p className="body-copy">Gathering your giving</p>
          ) : giving.data && giving.data.length > 0 ? (
            <div>
              {giving.data.map((g) => (
                <div className="rowline" key={g.id} data-reveal>
                  <div>
                    <p className="rowline__title">
                      £{(g.amountPence / 100).toFixed(2)}{" "}
                      <span style={{ fontSize: "1.1rem", color: "var(--ink-soft)" }}>
                        to {GIVE_FUNDS.find((f) => f.id === g.fund)?.label ?? g.fund}
                      </span>
                    </p>
                    <p className="body-copy">
                      {g.monthly ? "Monthly gift" : "Single gift"}
                      {g.giftAid ? " · Gift Aid declared" : ""}
                    </p>
                  </div>
                  <p className="rowline__meta">
                    {new Date(g.createdAt).toLocaleDateString("en-GB", {
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
              No giving recorded yet. When you give, it will appear here with its receipt status.
            </p>
          )}

          <div style={{ marginTop: "3.5rem", marginBottom: "1.5rem" }}>
            <span className="minititle">Your prayer requests</span>
          </div>
          {prayers.isLoading ? (
            <p className="body-copy">Gathering your requests</p>
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
                    {new Date(p.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                    })}
                    {" · being prayed over"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="body-copy" data-reveal>
              Nothing here yet. Whenever you are ready, we are ready.
            </p>
          )}

          <div style={{ marginTop: "3rem", display: "flex", gap: "0.9rem", flexWrap: "wrap" }} data-reveal>
            <Link to="/give" className="btn">
              Give again
            </Link>
            <Link to="/prayer" className="btn btn--ghost">
              Ask for prayer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

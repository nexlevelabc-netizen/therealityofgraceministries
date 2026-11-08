import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { PageHero } from "@/components/PageHero";
import { PrivacyConsent } from "@/components/PrivacyConsent";
import { trpc } from "@/providers/trpc";
import { GIVE_FUNDS, SITE } from "@/lib/site";

const AMOUNTS = [10, 25, 50, 100, 250];

type Step = "details" | "done";

export default function Give() {
  const [fund, setFund] = useState<(typeof GIVE_FUNDS)[number]["id"]>("tithes");
  const [amount, setAmount] = useState<number | null>(50);
  const [custom, setCustom] = useState("");
  const [monthly, setMonthly] = useState(false);
  const [giftAid, setGiftAid] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [step, setStep] = useState<Step>("details");
  const [reference, setReference] = useState("");

  const finalAmount = custom ? Number(custom) : amount;

  const begin = trpc.giving.begin.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setReference(data.reference);
      setStep("done");
      window.scrollTo(0, 0);
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!consent || !finalAmount || finalAmount < 1) return;
    begin.mutate({
      fund,
      amountGbp: finalAmount,
      monthly,
      giftAid,
      name,
      email,
      consentGiven: true,
    });
  };

  if (step === "done") {
    return (
      <section className="page-hero" style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
        <div className="shell--narrow" style={{ marginInline: "auto", textAlign: "center" }}>
          <span className="minititle" style={{ justifyContent: "center" }}>
            Received with thanks
          </span>
          <h1 className="display-2" style={{ marginTop: "1.4rem", fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
            Your seed is sown
          </h1>
          <p className="body-copy" style={{ margin: "1.4rem auto 0" }}>
            Reference {reference}. A confirmation is on its way to {email || "your inbox"}. If you
            chose to give by bank transfer, use this reference so we can honour your intention.
          </p>
          <div className="toast-note" style={{ marginTop: "2rem", textAlign: "left" }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.6rem" }}>
              Bank transfer details
            </p>
            <p>
              Account name: The Reality of Grace Ministries Int'l
              <br />
              Sort code and account number are confirmed by email for security.
              <br />
              Reference: {reference}
            </p>
          </div>
          <div style={{ marginTop: "2.2rem", display: "flex", gap: "0.9rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" className="btn btn--ghost" onClick={() => setStep("details")}>
              Give again
            </button>
            <Link to="/account" className="btn">
              View my giving
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        kicker="Generosity"
        title={
          <>
            Give where it <em className="serif-italic" style={{ color: "var(--wine)" }}>keeps growing</em>
          </>
        }
        intro="Tithes, offerings, project giving and compassion funds, received with prayer and handled with care."
      />

      <section className="section--tight">
          <div className="shell split split--lean-r" style={{ alignItems: "start" }}>
            <div>
              <span className="minititle" data-reveal>
                Choose your fund
              </span>
              <div style={{ marginTop: "1.6rem", display: "grid", gap: "0" }}>
                {GIVE_FUNDS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFund(f.id)}
                    aria-pressed={fund === f.id}
                    style={{
                      textAlign: "left",
                      background: fund === f.id ? "rgba(125, 21, 56, 0.06)" : "transparent",
                      border: 0,
                      borderTop: "1px solid var(--line)",
                      padding: "1.3rem 0.8rem 1.3rem 0",
                      cursor: "pointer",
                      borderLeft: fund === f.id ? "2px solid var(--gold)" : "2px solid transparent",
                      paddingLeft: "1rem",
                      transition: "all 0.2s ease",
                    }}
                    data-reveal
                  >
                    <span className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500, color: fund === f.id ? "var(--wine)" : "var(--ink)" }}>
                      {f.label}
                    </span>
                    <span style={{ display: "block", color: "var(--ink-soft)", fontSize: "0.95rem", marginTop: "0.2rem" }}>
                      {f.blurb}
                    </span>
                  </button>
                ))}
              </div>
              <p className="body-copy" style={{ marginTop: "2rem" }} data-reveal>
                Payments are processed securely by Stripe, including direct bank debit where
                available. The ministry never sees or stores your card details.
              </p>
              <p className="body-copy" style={{ marginTop: "1rem" }} data-reveal>
                Prefer to give another way? Call {SITE.phoneDisplay} and we will help.
              </p>
            </div>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: "1.8rem", border: "1px solid var(--line)", padding: "clamp(1.4rem, 3vw, 2.4rem)" }} data-reveal>
              <div>
                <p style={{ fontSize: "0.72rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: "0.9rem" }}>
                  Amount in pounds
                </p>
                <div className="chip-row" role="group" aria-label="Amount">
                  {AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      className="chip"
                      data-active={!custom && amount === a}
                      onClick={() => {
                        setAmount(a);
                        setCustom("");
                      }}
                    >
                      £{a}
                    </button>
                  ))}
                </div>
                <div className="field" style={{ marginTop: "1.1rem" }}>
                  <label htmlFor="g-custom">Or your own amount</label>
                  <input
                    id="g-custom"
                    inputMode="decimal"
                    min={1}
                    value={custom}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9.]/g, "");
                      setCustom(v);
                    }}
                    placeholder="Type an amount"
                  />
                </div>
              </div>

              <div className="chip-row" role="group" aria-label="Frequency">
                <button type="button" className="chip" data-active={!monthly} onClick={() => setMonthly(false)}>
                  One time
                </button>
                <button type="button" className="chip" data-active={monthly} onClick={() => setMonthly(true)}>
                  Every month
                </button>
              </div>

              <div className="field">
                <label htmlFor="g-name">Your name</label>
                <input id="g-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="So we can thank you properly" />
              </div>
              <div className="field">
                <label htmlFor="g-email">Email</label>
                <input id="g-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="For your receipt" />
              </div>

              <label className="consent" style={{ cursor: "pointer", background: "transparent" }}>
                <input type="checkbox" checked={giftAid} onChange={(e) => setGiftAid(e.target.checked)} />
                <p>
                  I am a UK taxpayer and I would like the ministry to reclaim Gift Aid on this gift,
                  adding twenty five pence to every pound at no cost to me.
                </p>
              </label>

              <PrivacyConsent checked={consent} onChange={setConsent} context="giving" />

              <div>
                <button
                  type="submit"
                  className="btn btn--gold"
                  style={{ width: "100%" }}
                  disabled={!consent || !finalAmount || finalAmount < 1 || begin.isPending}
                >
                  {begin.isPending
                    ? "Preparing your gift"
                    : `Give £${finalAmount && finalAmount > 0 ? finalAmount : 0}${monthly ? " monthly" : ""} to ${GIVE_FUNDS.find((f) => f.id === fund)?.label}`}
                </button>
                {begin.isError ? (
                  <p className="toast-note toast-note--error" style={{ marginTop: "1rem" }}>
                    We could not start the payment just now. Nothing was taken. Please try again or
                    call {SITE.phoneDisplay}.
                  </p>
                ) : null}
              </div>
            </form>
          </div>
      </section>
    </>
  );
}

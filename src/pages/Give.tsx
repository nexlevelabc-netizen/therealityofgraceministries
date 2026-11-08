import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { PageHero } from "@/components/PageHero";
import { PrivacyConsent } from "@/components/PrivacyConsent";
import { trpc } from "@/providers/trpc";
import { fill, useLang } from "@/i18n";

const AMOUNTS = [10, 25, 50, 100, 250];
const FUND_IDS = ["tithes", "offerings", "kingdom", "compassion"] as const;
type FundId = (typeof FUND_IDS)[number];

type Step = "details" | "done";

export default function Give() {
  const { t } = useLang();
  const [fund, setFund] = useState<FundId>("tithes");
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
  const fundLabel = t.funds[fund].label;

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
            {t.give.doneKicker}
          </span>
          <h1 className="display-2" style={{ marginTop: "1.4rem", fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
            {t.give.doneTitle}
          </h1>
          <p className="body-copy" style={{ margin: "1.4rem auto 0" }}>
            {fill(t.give.doneBody, { reference, email: email || "…" })}
          </p>
          <div className="toast-note" style={{ marginTop: "2rem", textAlign: "left" }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.6rem" }}>
              {t.give.bankTitle}
            </p>
            <p>
              {t.give.bankName}
              <br />
              {t.give.bankNote}
              <br />
              {fill(t.give.bankRef, { reference })}
            </p>
          </div>
          <div style={{ marginTop: "2.2rem", display: "flex", gap: "0.9rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" className="btn btn--ghost" onClick={() => setStep("details")}>
              {t.give.giveAgain}
            </button>
            <Link to="/account" className="btn">
              {t.give.viewGiving}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        kicker={t.give.kicker}
        title={
          <>
            {t.give.titleA}{" "}
            <em className="serif-italic" style={{ color: "var(--wine)" }}>
              {t.give.titleEm}
            </em>
          </>
        }
        intro={t.give.intro}
      />

      <section className="section--tight">
          <div className="shell split split--lean-r" style={{ alignItems: "start" }}>
            <div>
              <span className="minititle" data-reveal>
                {t.give.chooseFund}
              </span>
              <div style={{ marginTop: "1.6rem", display: "grid", gap: "0" }}>
                {FUND_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFund(id)}
                    aria-pressed={fund === id}
                    style={{
                      textAlign: "left",
                      background: fund === id ? "rgba(125, 21, 56, 0.06)" : "transparent",
                      border: 0,
                      borderTop: "1px solid var(--line)",
                      padding: "1.3rem 0.8rem 1.3rem 0",
                      cursor: "pointer",
                      borderLeft: fund === id ? "2px solid var(--gold)" : "2px solid transparent",
                      paddingLeft: "1rem",
                      transition: "all 0.2s ease",
                    }}
                    data-reveal
                  >
                    <span className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500, color: fund === id ? "var(--wine)" : "var(--ink)" }}>
                      {t.funds[id].label}
                    </span>
                    <span style={{ display: "block", color: "var(--ink-soft)", fontSize: "0.95rem", marginTop: "0.2rem" }}>
                      {t.funds[id].blurb}
                    </span>
                  </button>
                ))}
              </div>
              <p className="body-copy" style={{ marginTop: "2rem" }} data-reveal>
                {t.give.stripeNote}
              </p>
              <p className="body-copy" style={{ marginTop: "1rem" }} data-reveal>
                {fill(t.give.callNote)}
              </p>
            </div>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: "1.8rem", border: "1px solid var(--line)", padding: "clamp(1.4rem, 3vw, 2.4rem)" }} data-reveal>
              <div>
                <p style={{ fontSize: "0.72rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: "0.9rem" }}>
                  {t.give.amountLabel}
                </p>
                <div className="chip-row" role="group" aria-label={t.give.amountLabel}>
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
                  <label htmlFor="g-custom">{t.give.customLabel}</label>
                  <input
                    id="g-custom"
                    inputMode="decimal"
                    min={1}
                    value={custom}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9.]/g, "");
                      setCustom(v);
                    }}
                    placeholder={t.give.customPh}
                  />
                </div>
              </div>

              <div className="chip-row" role="group" aria-label={t.give.monthly}>
                <button type="button" className="chip" data-active={!monthly} onClick={() => setMonthly(false)}>
                  {t.give.once}
                </button>
                <button type="button" className="chip" data-active={monthly} onClick={() => setMonthly(true)}>
                  {t.give.monthly}
                </button>
              </div>

              <div className="field">
                <label htmlFor="g-name">{t.give.nameLabel}</label>
                <input id="g-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder={t.give.namePh} />
              </div>
              <div className="field">
                <label htmlFor="g-email">{t.give.emailLabel}</label>
                <input id="g-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.give.emailPh} />
              </div>

              <label className="consent" style={{ cursor: "pointer", background: "transparent" }}>
                <input type="checkbox" checked={giftAid} onChange={(e) => setGiftAid(e.target.checked)} />
                <p>{t.give.giftAid}</p>
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
                    ? t.give.preparing
                    : fill(monthly ? t.give.submitMonthly : t.give.submitOnce, {
                        amount: String(finalAmount && finalAmount > 0 ? finalAmount : 0),
                        fund: fundLabel,
                      })}
                </button>
                {begin.isError ? (
                  <p className="toast-note toast-note--error" style={{ marginTop: "1rem" }}>
                    {fill(t.give.errorBody)}
                  </p>
                ) : null}
              </div>
            </form>
          </div>
      </section>
    </>
  );
}

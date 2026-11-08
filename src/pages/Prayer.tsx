import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { PageHero } from "@/components/PageHero";
import { trpc } from "@/providers/trpc";
import { fill, useLang } from "@/i18n";

export default function Prayer() {
  const { t, lang } = useLang();
  const [reqForm, setReqForm] = useState({ name: "", contact: "", message: "" });
  const [reqConsent, setReqConsent] = useState(false);
  const [reqSent, setReqSent] = useState(false);
  const sendRequest = trpc.prayer.submit.useMutation({ onSuccess: () => setReqSent(true) });

  const openCompanion = () => {
    window.dispatchEvent(new Event("open-grace-companion"));
  };

  const submitRequest = (e: FormEvent) => {
    e.preventDefault();
    if (!reqConsent) return;
    sendRequest.mutate({
      name: reqForm.name,
      contact: reqForm.contact,
      message: reqForm.message,
      language: lang,
      consentGiven: true,
    });
  };

  return (
    <>
      <PageHero
        kicker={t.prayer.kicker}
        title={
          <>
            {t.prayer.titleA}{" "}
            <em className="serif-italic" style={{ color: "var(--wine)" }}>
              {t.prayer.titleEm}
            </em>
          </>
        }
        intro={t.prayer.intro}
      />

      {/* ---------- privacy first ---------- */}
      <section className="section--tight">
        <div className="shell split split--lean-r" style={{ alignItems: "start" }}>
          <div>
            <span className="minititle" data-reveal>
              {t.prayer.privKicker}
            </span>
            <h2 className="display-3" style={{ marginTop: "1rem" }} data-reveal>
              {t.prayer.privTitle}
            </h2>
            <div className="prose-copy" style={{ marginTop: "1.2rem" }} data-reveal>
              <p>{t.prayer.privP1}</p>
              <p>{t.prayer.privP2}</p>
              <p>
                {t.prayer.privP3a}{" "}
                <Link to="/privacy" style={{ color: "var(--wine)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                  {t.prayer.privP3Link}
                </Link>
                .
              </p>
            </div>
          </div>

          <div data-reveal>
            <div className="figure figure--arch" style={{ aspectRatio: "4 / 3.4", maxWidth: "22rem" }}>
              <img src="/img/counselling.jpg" alt={t.prayer.companionAlt} loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- the companion lives in the corner ---------- */}
      <section className="section--tight rule-top">
        <div className="shell split split--lean-l" style={{ alignItems: "center" }}>
          <div>
            <span className="minititle" data-reveal>
              {t.prayer.companionKicker}
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              {t.prayer.companionTitle}
            </h2>
            <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
              {t.prayer.companionBody}
            </p>
            <div style={{ marginTop: "2rem" }} data-reveal>
              <button type="button" className="btn btn--gold" onClick={openCompanion}>
                {t.prayer.openCompanion}
              </button>
            </div>
          </div>
          <div data-reveal>
            <div className="toast-note" style={{ maxWidth: "26rem" }}>
              <p className="body-copy" style={{ color: "var(--ink)" }}>
                {t.widget.gateBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- pastoral request form ---------- */}
      <section className="band-dark section">
        <div className="shell split split--lean-l" style={{ alignItems: "start" }}>
          <div>
            <span className="minititle" data-reveal>
              {t.prayer.reqKicker}
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              {t.prayer.reqTitle}
            </h2>
            <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
              {t.prayer.reqBody}
            </p>
          </div>
          <div data-reveal>
            {reqSent ? (
              <div className="toast-note" style={{ background: "rgba(195,162,78,0.14)" }}>
                <b className="font-display" style={{ fontSize: "1.3rem", color: "var(--cream)" }}>
                  {t.prayer.reqDoneTitle}
                </b>
                <p style={{ marginTop: "0.4rem", color: "rgba(248,245,239,0.8)" }}>
                  {t.prayer.reqDoneBody}
                </p>
              </div>
            ) : (
              <form onSubmit={submitRequest} style={{ display: "grid", gap: "1.5rem" }}>
                <div className="field">
                  <label htmlFor="p-name">
                    {t.prayer.reqName}{" "}
                    <span style={{ textTransform: "none", letterSpacing: 0 }}>{t.prayer.reqNameOpt}</span>
                  </label>
                  <input
                    id="p-name"
                    value={reqForm.name}
                    onChange={(e) => setReqForm({ ...reqForm, name: e.target.value })}
                    placeholder={t.prayer.reqNamePh}
                  />
                </div>
                <div className="field">
                  <label htmlFor="p-contact">
                    {t.prayer.reqContact}{" "}
                    <span style={{ textTransform: "none", letterSpacing: 0 }}>{t.prayer.reqContactOpt}</span>
                  </label>
                  <input
                    id="p-contact"
                    value={reqForm.contact}
                    onChange={(e) => setReqForm({ ...reqForm, contact: e.target.value })}
                    placeholder={t.prayer.reqContactPh}
                  />
                </div>
                <div className="field">
                  <label htmlFor="p-msg">{t.prayer.reqMsg}</label>
                  <textarea
                    id="p-msg"
                    required
                    value={reqForm.message}
                    onChange={(e) => setReqForm({ ...reqForm, message: e.target.value })}
                    placeholder={t.prayer.reqMsgPh}
                  />
                </div>
                <label className="consent" style={{ cursor: "pointer", background: "rgba(195,162,78,0.1)", borderColor: "rgba(248,245,239,0.2)" }}>
                  <input type="checkbox" checked={reqConsent} onChange={(e) => setReqConsent(e.target.checked)} />
                  <p style={{ color: "rgba(248,245,239,0.8)" }}>
                    {t.prayer.reqConsentA} <Link to="/privacy">{t.prayer.reqConsentLink}</Link>{" "}
                    {t.prayer.reqConsentB}
                  </p>
                </label>
                <div>
                  <button type="submit" className="btn btn--gold" disabled={!reqConsent || sendRequest.isPending}>
                    {sendRequest.isPending ? t.prayer.reqSending : t.prayer.reqSubmit}
                  </button>
                  {sendRequest.isError ? (
                    <p className="toast-note toast-note--error" style={{ marginTop: "1rem" }}>
                      {fill(t.prayer.reqError)}
                    </p>
                  ) : null}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

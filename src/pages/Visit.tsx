import { useState } from "react";
import type { FormEvent } from "react";
import { PageHero } from "@/components/PageHero";
import { PrivacyConsent } from "@/components/PrivacyConsent";
import { trpc } from "@/providers/trpc";
import { SITE } from "@/lib/site";
import { fill, useLang } from "@/i18n";

export default function Visit() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = trpc.contact.submit.useMutation({
    onSuccess: () => setSent(true),
  });

  const expectations = [
    { n: "01", title: t.visit.s1t, body: t.visit.s1b },
    { n: "02", title: t.visit.s2t, body: t.visit.s2b },
    { n: "03", title: t.visit.s3t, body: t.visit.s3b },
    { n: "04", title: t.visit.s4t, body: t.visit.s4b },
  ];

  const rhythm = [
    { name: t.visit.r1t, note: t.visit.r1b, meta: t.visit.r1m },
    { name: t.visit.r2t, note: t.visit.r2b, meta: t.visit.r2m },
    { name: t.visit.r3t, note: t.visit.r3b, meta: t.visit.r3m },
  ];

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    submit.mutate({
      name: form.name,
      email: form.email,
      topic: "first_visit",
      message: form.message || "I am planning my first visit and would love someone to look out for me.",
      consentGiven: true,
    });
  };

  return (
    <>
      <PageHero
        kicker={t.visit.kicker}
        title={
          <>
            {t.visit.titleA}{" "}
            <em className="serif-italic" style={{ color: "var(--wine)" }}>
              {t.visit.titleEm}
            </em>{" "}
            {t.visit.titleB}
          </>
        }
        intro={t.visit.intro}
      />

      <section className="section--tight">
        <div className="shell">
          <div style={{ display: "grid", gap: "2.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))" }}>
            {expectations.map((s, i) => (
              <div key={s.n} data-reveal style={{ ["--reveal-delay" as string]: `${i * 0.1}s`, borderTop: "1px solid var(--line-strong)", paddingTop: "1.2rem" }}>
                <span className="minititle minititle--bare">{s.n}</span>
                <h3 className="display-3" style={{ margin: "0.7rem 0" }}>
                  {s.title}
                </h3>
                <p className="body-copy">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band-dark section--tight">
        <div className="shell split split--lean-l" style={{ alignItems: "center" }}>
          <div>
            <span className="minititle" data-reveal>
              {t.visit.rhythmKicker}
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              {t.visit.rhythmTitle}
            </h2>
            <div style={{ marginTop: "2rem" }}>
              {rhythm.map((g) => (
                <div key={g.name} className="rowline" style={{ borderTopColor: "rgba(248,245,239,0.16)" }} data-reveal>
                  <div>
                    <p className="rowline__title" style={{ color: "var(--cream)" }}>
                      {g.name}
                    </p>
                    <p className="body-copy">{g.note}</p>
                  </div>
                  <p className="rowline__meta" style={{ color: "var(--gold-bright)" }}>
                    {g.meta}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="figure" data-parallax style={{ aspectRatio: "4 / 5" }} data-reveal>
            <img src="/img/hero-welcome.jpg" alt={t.visit.rhythmAlt} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section" id="tell-us">
        <div className="shell split split--lean-r" style={{ alignItems: "start" }}>
          <div>
            <span className="minititle" data-reveal>
              {t.visit.formKicker}
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              {t.visit.formTitle}
            </h2>
            <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
              {t.visit.formBody}
            </p>
            <p className="body-copy" style={{ marginTop: "1.1rem" }} data-reveal>
              {fill(t.visit.formCall).split(SITE.phoneDisplay)[0]}
              <a href={SITE.phoneHref} style={{ color: "var(--wine)" }}>
                {SITE.phoneDisplay}
              </a>
              {fill(t.visit.formCall).split(SITE.phoneDisplay)[1]}
            </p>
          </div>
          <div data-reveal>
            {sent ? (
              <div className="toast-note">
                <b className="font-display" style={{ fontSize: "1.3rem" }}>
                  {t.visit.doneTitle}
                </b>
                <p style={{ marginTop: "0.4rem" }}>{t.visit.doneBody}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} style={{ display: "grid", gap: "1.6rem" }}>
                <div className="field">
                  <label htmlFor="v-name">{t.visit.nameLabel}</label>
                  <input
                    id="v-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t.visit.namePh}
                  />
                </div>
                <div className="field">
                  <label htmlFor="v-email">{t.visit.emailLabel}</label>
                  <input
                    id="v-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t.visit.emailPh}
                  />
                </div>
                <div className="field">
                  <label htmlFor="v-msg">
                    {t.visit.msgLabel}{" "}
                    <span style={{ textTransform: "none", letterSpacing: 0 }}>{t.visit.msgOptional}</span>
                  </label>
                  <textarea
                    id="v-msg"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t.visit.msgPh}
                  />
                </div>
                <PrivacyConsent checked={consent} onChange={setConsent} context="visit" />
                <div>
                  <button type="submit" className="btn" disabled={!consent || submit.isPending}>
                    {submit.isPending ? t.visit.sending : t.visit.submit}
                  </button>
                  {submit.isError ? (
                    <p className="toast-note toast-note--error" style={{ marginTop: "1rem" }}>
                      {fill(t.visit.errorBody)}
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

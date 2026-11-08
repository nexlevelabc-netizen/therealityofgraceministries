import { useState } from "react";
import type { FormEvent } from "react";
import { PageHero } from "@/components/PageHero";
import { PrivacyConsent } from "@/components/PrivacyConsent";
import { trpc } from "@/providers/trpc";
import { SITE } from "@/lib/site";
import { fill, useLang } from "@/i18n";

const TOPIC_IDS = ["general", "serve", "testimony", "media", "other"] as const;

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", topic: "general", message: "" });
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = trpc.contact.submit.useMutation({ onSuccess: () => setSent(true) });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    submit.mutate({ ...form, consentGiven: true });
  };

  return (
    <>
      <PageHero
        kicker={t.contact.kicker}
        title={
          <>
            {t.contact.titleA}{" "}
            <em className="serif-italic" style={{ color: "var(--wine)" }}>
              {t.contact.titleEm}
            </em>
          </>
        }
        intro={t.contact.intro}
      />

      <section className="section--tight">
        <div className="shell split split--lean-l" style={{ alignItems: "start" }}>
          <div>
            <div style={{ display: "grid", gap: "2rem" }}>
              <div data-reveal>
                <span className="minititle">{t.contact.callKicker}</span>
                <p className="font-display" style={{ fontSize: "1.8rem", marginTop: "0.8rem" }}>
                  <a href={SITE.phoneHref} style={{ color: "var(--ink)", textDecoration: "none" }}>
                    {SITE.phoneDisplay}
                  </a>
                </p>
                <p className="body-copy">{t.contact.callNote}</p>
              </div>
              <div data-reveal>
                <span className="minititle">{t.contact.writeKicker}</span>
                <p className="font-display" style={{ fontSize: "1.25rem", marginTop: "0.8rem", wordBreak: "break-word" }}>
                  <a href={`mailto:${SITE.email}`} style={{ color: "var(--ink)", textDecoration: "none" }}>
                    {SITE.email}
                  </a>
                </p>
                <p className="body-copy">{t.contact.writeNote}</p>
              </div>
              <div data-reveal>
                <span className="minititle">{t.contact.followKicker}</span>
                <ul style={{ listStyle: "none", padding: 0, marginTop: "0.8rem", display: "grid", gap: "0.5rem" }}>
                  {SITE.socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="tlink">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div data-reveal>
            {sent ? (
              <div className="toast-note">
                <b className="font-display" style={{ fontSize: "1.3rem" }}>
                  {t.contact.doneTitle}
                </b>
                <p style={{ marginTop: "0.4rem" }}>{t.contact.doneBody}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} style={{ display: "grid", gap: "1.6rem" }}>
                <div className="field">
                  <label htmlFor="c-name">{t.contact.nameLabel}</label>
                  <input
                    id="c-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t.contact.namePh}
                  />
                </div>
                <div className="field">
                  <label htmlFor="c-email">{t.contact.emailLabel}</label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t.contact.emailPh}
                  />
                </div>
                <div className="field">
                  <label htmlFor="c-topic">{t.contact.topicLabel}</label>
                  <select
                    id="c-topic"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  >
                    {TOPIC_IDS.map((id) => (
                      <option key={id} value={id}>
                        {t.contact.topics[id]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="c-msg">{t.contact.msgLabel}</label>
                  <textarea
                    id="c-msg"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t.contact.msgPh}
                  />
                </div>
                <PrivacyConsent checked={consent} onChange={setConsent} context="message" />
                <div>
                  <button type="submit" className="btn" disabled={!consent || submit.isPending}>
                    {submit.isPending ? t.contact.sending : t.contact.submit}
                  </button>
                  {submit.isError ? (
                    <p className="toast-note toast-note--error" style={{ marginTop: "1rem" }}>
                      {fill(t.contact.errorBody)}
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

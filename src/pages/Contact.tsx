import { useState } from "react";
import type { FormEvent } from "react";
import { PageHero } from "@/components/PageHero";
import { PrivacyConsent } from "@/components/PrivacyConsent";
import { trpc } from "@/providers/trpc";
import { SITE } from "@/lib/site";

const TOPICS = [
  { id: "general", label: "A general question" },
  { id: "serve", label: "I want to serve" },
  { id: "testimony", label: "Share a testimony" },
  { id: "media", label: "Media and streaming" },
  { id: "other", label: "Something else" },
];

export default function Contact() {
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
        kicker="Contact"
        title={
          <>
            Start the <em className="serif-italic" style={{ color: "var(--wine)" }}>conversation</em>
          </>
        }
        intro="A real person reads every message, usually within a day. Choose whichever door suits you."
      />

      <section className="section--tight">
        <div className="shell split split--lean-l" style={{ alignItems: "start" }}>
          <div>
            <div style={{ display: "grid", gap: "2rem" }}>
              <div data-reveal>
                <span className="minititle">Call</span>
                <p className="font-display" style={{ fontSize: "1.8rem", marginTop: "0.8rem" }}>
                  <a href={SITE.phoneHref} style={{ color: "var(--ink)", textDecoration: "none" }}>
                    {SITE.phoneDisplay}
                  </a>
                </p>
                <p className="body-copy">Weekdays and around every gathering.</p>
              </div>
              <div data-reveal>
                <span className="minititle">Write</span>
                <p className="font-display" style={{ fontSize: "1.25rem", marginTop: "0.8rem", wordBreak: "break-word" }}>
                  <a href={`mailto:${SITE.email}`} style={{ color: "var(--ink)", textDecoration: "none" }}>
                    {SITE.email}
                  </a>
                </p>
                <p className="body-copy">Messages from the form below land here too, automatically.</p>
              </div>
              <div data-reveal>
                <span className="minititle">Follow</span>
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
                  Your message is on its way.
                </b>
                <p style={{ marginTop: "0.4rem" }}>
                  It has been delivered to the ministry inbox and someone will reply to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} style={{ display: "grid", gap: "1.6rem" }}>
                <div className="field">
                  <label htmlFor="c-name">Your name</label>
                  <input
                    id="c-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="What should we call you?"
                  />
                </div>
                <div className="field">
                  <label htmlFor="c-email">Email</label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Where should the reply go?"
                  />
                </div>
                <div className="field">
                  <label htmlFor="c-topic">This is about</label>
                  <select
                    id="c-topic"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  >
                    {TOPICS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="c-msg">Your message</label>
                  <textarea
                    id="c-msg"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Take your time"
                  />
                </div>
                <PrivacyConsent checked={consent} onChange={setConsent} context="message" />
                <div>
                  <button type="submit" className="btn" disabled={!consent || submit.isPending}>
                    {submit.isPending ? "Sending" : "Send it to the team"}
                  </button>
                  {submit.isError ? (
                    <p className="toast-note toast-note--error" style={{ marginTop: "1rem" }}>
                      That did not send. Please try again, or email {SITE.email} directly.
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

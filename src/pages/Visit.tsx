import { useState } from "react";
import type { FormEvent } from "react";
import { PageHero } from "@/components/PageHero";
import { PrivacyConsent } from "@/components/PrivacyConsent";
import { trpc } from "@/providers/trpc";
import { GATHERING_RHYTHM, SITE } from "@/lib/site";

const EXPECTATIONS = [
  {
    n: "01",
    t: "Come as you are",
    b: "No dress code, no script, no expectations. Jeans and trainers sit next to Sunday best here.",
  },
  {
    n: "02",
    t: "We will look out for you",
    b: "Our welcome team watches for new faces, not to corner you, but to make sure you find a seat and a friend.",
  },
  {
    n: "03",
    t: "Translation is always on",
    b: "Follow the service in Spanish, Italian, Portuguese, Arabic, Chinese or French, on screen and online.",
  },
  {
    n: "04",
    t: "Stay for the table",
    b: "After the benediction there is tea, coffee and conversation. The service ends; the family does not.",
  },
];

export default function Visit() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = trpc.contact.submit.useMutation({
    onSuccess: () => setSent(true),
  });

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
        kicker="Your first visit"
        title={
          <>
            Nervous? <em className="serif-italic" style={{ color: "var(--wine)" }}>Good.</em> That means it matters.
          </>
        }
        intro="Walking into a new church takes courage. Here is exactly what happens when you walk into ours."
      />

      <section className="section--tight">
        <div className="shell">
          <div style={{ display: "grid", gap: "2.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))" }}>
            {EXPECTATIONS.map((s, i) => (
              <div key={s.n} data-reveal style={{ ["--reveal-delay" as string]: `${i * 0.1}s`, borderTop: "1px solid var(--line-strong)", paddingTop: "1.2rem" }}>
                <span className="minititle minititle--bare">{s.n}</span>
                <h3 className="display-3" style={{ margin: "0.7rem 0" }}>
                  {s.t}
                </h3>
                <p className="body-copy">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band-dark section--tight">
        <div className="shell split split--lean-l" style={{ alignItems: "center" }}>
          <div>
            <span className="minititle" data-reveal>
              The weekly rhythm
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              Pick a moment, we will keep a seat
            </h2>
            <div style={{ marginTop: "2rem" }}>
              {GATHERING_RHYTHM.map((g) => (
                <div key={g.day} className="rowline" style={{ borderTopColor: "rgba(248,245,239,0.16)" }} data-reveal>
                  <div>
                    <p className="rowline__title" style={{ color: "var(--cream)" }}>
                      {g.name}
                    </p>
                    <p className="body-copy">{g.note}</p>
                  </div>
                  <p className="rowline__meta" style={{ color: "var(--gold-bright)" }}>
                    {g.day} · {g.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="figure" data-parallax style={{ aspectRatio: "4 / 5" }} data-reveal>
            <img src="/img/hero-welcome.jpg" alt="A warm welcome at the church doors" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section" id="tell-us">
        <div className="shell split split--lean-r" style={{ alignItems: "start" }}>
          <div>
            <span className="minititle" data-reveal>
              Tell us you are coming
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              We will watch the door for you
            </h2>
            <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
              Leave your name and we will have someone ready to meet you, answer your questions and
              sit with you if you would like company. Prefer to slip in quietly? That is holy too.
            </p>
            <p className="body-copy" style={{ marginTop: "1.1rem" }} data-reveal>
              Rather talk first? Call us on{" "}
              <a href={SITE.phoneHref} style={{ color: "var(--wine)" }}>
                {SITE.phoneDisplay}
              </a>{" "}
              and a real person will pick up.
            </p>
          </div>
          <div data-reveal>
            {sent ? (
              <div className="toast-note">
                <b className="font-display" style={{ fontSize: "1.3rem" }}>
                  Consider it done.
                </b>
                <p style={{ marginTop: "0.4rem" }}>
                  Your note is with our welcome team. Keep an eye on your inbox, and on Sunday,
                  just look for the smiling faces near the door.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} style={{ display: "grid", gap: "1.6rem" }}>
                <div className="field">
                  <label htmlFor="v-name">Your name</label>
                  <input
                    id="v-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="What should we call you?"
                  />
                </div>
                <div className="field">
                  <label htmlFor="v-email">Email</label>
                  <input
                    id="v-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="So we can say hello before Sunday"
                  />
                </div>
                <div className="field">
                  <label htmlFor="v-msg">Anything we should know? <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                  <textarea
                    id="v-msg"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Access needs, children, questions, anything at all"
                  />
                </div>
                <PrivacyConsent checked={consent} onChange={setConsent} context="visit enquiry" />
                <div>
                  <button type="submit" className="btn" disabled={!consent || submit.isPending}>
                    {submit.isPending ? "Sending" : "Keep a seat for me"}
                  </button>
                  {submit.isError ? (
                    <p className="toast-note toast-note--error" style={{ marginTop: "1rem" }}>
                      Something interrupted the sending. Please try again, or call {SITE.phoneDisplay}.
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

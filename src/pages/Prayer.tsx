import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { PageHero } from "@/components/PageHero";
import { trpc } from "@/providers/trpc";
import { LANGUAGES, SITE, type LanguageCode } from "@/lib/site";

type Msg = { role: "user" | "assistant"; content: string };

const GREETINGS: Record<LanguageCode, string> = {
  en: "Peace be with you. I am here to pray with you, listen, and help you find counsel. What is on your heart today?",
  es: "La paz sea contigo. Estoy aquí para orar contigo, escucharte y ayudarte a encontrar consejo. ¿Qué llevas en tu corazón hoy?",
  it: "La pace sia con te. Sono qui per pregare con te, ascoltarti e aiutarti a trovare consiglio. Cosa porti nel cuore oggi?",
  pt: "A paz esteja contigo. Estou aqui para orar contigo, ouvir e ajudar a encontrar conselho. O que está no teu coração hoje?",
  ar: "السلام معك. أنا هنا لأصلي معك وأستمع إليك وأساعدك في إيجاد المشورة. ما الذي يثقل قلبك اليوم؟",
  zh: "愿平安与你同在。我在这里陪你祷告、倾听，并帮助你找到指引。今天你的心里装着什么？",
  fr: "Que la paix soit avec vous. Je suis là pour prier avec vous, vous écouter et vous aider à trouver conseil. Qu'avez vous sur le cœur aujourd'hui?",
};

export default function Prayer() {
  const [agreed, setAgreed] = useState(false);
  const [lang, setLang] = useState<LanguageCode>("en");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiDown, setAiDown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [reqForm, setReqForm] = useState({ name: "", contact: "", message: "" });
  const [reqConsent, setReqConsent] = useState(false);
  const [reqSent, setReqSent] = useState(false);
  const sendRequest = trpc.prayer.submit.useMutation({ onSuccess: () => setReqSent(true) });

  useEffect(() => {
    if (agreed && msgs.length === 0) {
      setMsgs([{ role: "assistant", content: GREETINGS[lang] }]);
    }
  }, [agreed, lang, msgs.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  const changeLang = (code: LanguageCode) => {
    setLang(code);
    if (msgs.length <= 1) setMsgs([{ role: "assistant", content: GREETINGS[code] }]);
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, messages: next.slice(-12) }),
      });
      if (!resp.ok || !resp.body) throw new Error("chat unavailable");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMsgs((m) => [...m, { role: "assistant", content: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        setMsgs((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: snapshot };
          return copy;
        });
      }
      if (!acc) throw new Error("empty reply");
    } catch {
      setAiDown(true);
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I am sorry, I cannot respond right now. Please leave your request for the pastoral team below, or call " +
            SITE.phoneDisplay +
            " and a person will pray with you.",
        },
      ]);
    } finally {
      setBusy(false);
    }
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
        kicker="Prayer and counselling"
        title={
          <>
            Say it <em className="serif-italic" style={{ color: "var(--wine)" }}>in your own tongue</em>
          </>
        }
        intro="A confidential space to ask for prayer and counsel, in the language your heart thinks in."
      />

      <section className="section--tight">
        <div className="shell split split--lean-r" style={{ alignItems: "start" }}>
          <div>
            <span className="minititle" data-reveal>
              Before we begin
            </span>
            <h2 className="display-3" style={{ marginTop: "1rem" }} data-reveal>
              Your privacy, in plain words
            </h2>
            <div className="prose-copy" style={{ marginTop: "1.2rem" }} data-reveal>
              <p>
                Nothing you write here is sold, traded or shared outside the ministry team.
                Conversations are used only to pray for you and respond to you.
              </p>
              <p>
                If you ask us to, a pastor will follow up using the contact details you choose to
                leave. You may remain anonymous in the chat for as long as you wish.
              </p>
              <p>
                In an emergency or if you feel at risk of harm, please contact local emergency
                services first, then us. The full statement lives on our{" "}
                <Link to="/privacy" style={{ color: "var(--wine)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                  privacy page
                </Link>
                .
              </p>
            </div>
            {!agreed ? (
              <button type="button" className="btn" style={{ marginTop: "1.6rem" }} onClick={() => setAgreed(true)} data-reveal>
                I have read this, let me in
              </button>
            ) : (
              <p className="toast-note" style={{ marginTop: "1.6rem" }}>
                You are in a confidential space. Choose your language and begin whenever you are ready.
              </p>
            )}

            <div className="figure figure--arch" style={{ marginTop: "2.4rem", aspectRatio: "4 / 3.4", maxWidth: "22rem" }} data-reveal>
              <img src="/img/counselling.jpg" alt="A pastoral counselling conversation in soft light" loading="lazy" />
            </div>

            <div style={{ marginTop: "2.4rem", opacity: agreed ? 1 : 0.4, pointerEvents: agreed ? "auto" : "none" }}>
              <p style={{ fontSize: "0.72rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: "0.8rem" }}>
                Your language
              </p>
              <div className="lang-row" role="group" aria-label="Chat language">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className="lang-btn"
                    data-active={lang === l.code}
                    aria-pressed={lang === l.code}
                    onClick={() => changeLang(l.code)}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="chat-shell" data-reveal aria-live="polite">
            {!agreed ? (
              <div style={{ margin: "auto", padding: "2rem", textAlign: "center", maxWidth: "30ch" }}>
                <p className="lede">
                  The conversation opens once you have read and accepted the privacy note.
                </p>
              </div>
            ) : (
              <>
                <div className="chat-scroll" ref={scrollRef}>
                  {msgs.map((m, i) => (
                    <div key={i} className={m.role === "user" ? "msg msg--you" : "msg msg--grace"}>
                      {m.role === "assistant" ? <span className="msg__tag">Grace companion</span> : null}
                      {m.content}
                    </div>
                  ))}
                  {busy ? (
                    <div className="msg msg--grace">
                      <span className="msg__tag">Grace companion</span>
                      <span className="typing" aria-label="Writing">
                        <i /> <i /> <i />
                      </span>
                    </div>
                  ) : null}
                </div>
                <form className="chat-input-row" onSubmit={send}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Write what is on your heart"
                    aria-label="Message"
                    maxLength={2000}
                  />
                  <button type="submit" disabled={busy || !input.trim()}>
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="band-dark section">
        <div className="shell split split--lean-l" style={{ alignItems: "start" }}>
          <div>
            <span className="minititle" data-reveal>
              For the pastoral team
            </span>
            <h2 className="display-2" style={{ marginTop: "1.2rem" }} data-reveal>
              Leave a request we can carry
            </h2>
            <p className="body-copy" style={{ marginTop: "1.4rem" }} data-reveal>
              Some things deserve more than a chat window. Leave your request here and our pastors
              will pray over it personally, and reach out if you ask them to.
            </p>
            {aiDown ? (
              <p className="toast-note" style={{ marginTop: "1.4rem" }}>
                The companion is resting at the moment, but this path to the pastors is always open.
              </p>
            ) : null}
          </div>
          <div data-reveal>
            {reqSent ? (
              <div className="toast-note" style={{ background: "rgba(195,162,78,0.14)" }}>
                <b className="font-display" style={{ fontSize: "1.3rem", color: "var(--cream)" }}>
                  It is in faithful hands.
                </b>
                <p style={{ marginTop: "0.4rem", color: "rgba(248,245,239,0.8)" }}>
                  Your request has gone to the pastoral team and will be prayed over this week.
                </p>
              </div>
            ) : (
              <form onSubmit={submitRequest} style={{ display: "grid", gap: "1.5rem" }}>
                <div className="field">
                  <label htmlFor="p-name">Your name <span style={{ textTransform: "none", letterSpacing: 0 }}>(you may stay anonymous)</span></label>
                  <input
                    id="p-name"
                    value={reqForm.name}
                    onChange={(e) => setReqForm({ ...reqForm, name: e.target.value })}
                    placeholder="Only if you wish"
                  />
                </div>
                <div className="field">
                  <label htmlFor="p-contact">How may we reach you? <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                  <input
                    id="p-contact"
                    value={reqForm.contact}
                    onChange={(e) => setReqForm({ ...reqForm, contact: e.target.value })}
                    placeholder="Email or phone, only if you want a reply"
                  />
                </div>
                <div className="field">
                  <label htmlFor="p-msg">Your request</label>
                  <textarea
                    id="p-msg"
                    required
                    value={reqForm.message}
                    onChange={(e) => setReqForm({ ...reqForm, message: e.target.value })}
                    placeholder="Write as much or as little as you need"
                  />
                </div>
                <label className="consent" style={{ cursor: "pointer", background: "rgba(195,162,78,0.1)", borderColor: "rgba(248,245,239,0.2)" }}>
                  <input type="checkbox" checked={reqConsent} onChange={(e) => setReqConsent(e.target.checked)} />
                  <p style={{ color: "rgba(248,245,239,0.8)" }}>
                    I agree to the <Link to="/privacy">privacy statement</Link> and understand this
                    request goes to the ministry team in confidence.
                  </p>
                </label>
                <div>
                  <button type="submit" className="btn btn--gold" disabled={!reqConsent || sendRequest.isPending}>
                    {sendRequest.isPending ? "Placing it in their hands" : "Place it in their hands"}
                  </button>
                  {sendRequest.isError ? (
                    <p className="toast-note toast-note--error" style={{ marginTop: "1rem" }}>
                      That did not go through. Please try again, or call {SITE.phoneDisplay}.
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

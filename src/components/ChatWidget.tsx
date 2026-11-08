import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { fill, LANGS, useLang, type LangCode } from "@/i18n";

type Msg = { role: "user" | "assistant"; content: string };
type TagId = "prayer" | "counselling" | "support" | "testimony" | "newhere";

const TAG_KEYS: Record<TagId, "tagPrayer" | "tagCounselling" | "tagSupport" | "tagTestimony" | "tagNewHere"> = {
  prayer: "tagPrayer",
  counselling: "tagCounselling",
  support: "tagSupport",
  testimony: "tagTestimony",
  newhere: "tagNewHere",
};

const WIDGET_LANG_KEY = "trgmi-widget-lang";
const CONSENT_KEY = "trgmi-widget-consent";

export function ChatWidget() {
  const { t, lang: siteLang } = useLang();
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(() =>
    typeof window !== "undefined" ? window.localStorage.getItem(CONSENT_KEY) === "yes" : false
  );
  const [consentBox, setConsentBox] = useState(false);
  const [chatLang, setChatLang] = useState<LangCode>(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(WIDGET_LANG_KEY) : null;
    return (LANGS.find((l) => l.code === saved)?.code ?? siteLang) as LangCode;
  });

  /* follow the site language until the visitor picks a widget language of their own */
  useEffect(() => {
    if (!window.localStorage.getItem(WIDGET_LANG_KEY)) setChatLang(siteLang);
  }, [siteLang]);
  const [tag, setTag] = useState<TagId>("prayer");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [greeting, setGreeting] = useState("");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* hide the bubble entirely on deployments with no AI provider configured */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/chat/status")
      .then((r) => (r.ok ? r.json() : { available: false }))
      .then((d) => {
        if (!cancelled) setAvailable(Boolean(d?.available));
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* greeting per language, fetched so it is natively phrased */
  useEffect(() => {
    window.localStorage.setItem(WIDGET_LANG_KEY, chatLang);
  }, [chatLang]);

  useEffect(() => {
    if (!open || !agreed) return;
    setMsgs([]);
    setGreeting("");
    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: chatLang,
            topic: tag,
            greet: true,
            messages: [{ role: "user", content: "__greet__" }],
          }),
        });
        if (!resp.ok || !resp.body) throw new Error("unavailable");
        const reader = resp.body.getReader();
        const dec = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
        }
        if (!cancelled) setGreeting(acc || t.widget.greeting);
      } catch {
        if (!cancelled) setGreeting(t.widget.greeting);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, agreed, chatLang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy, greeting]);

  /* open from anywhere via event */
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-grace-companion", handler);
    return () => window.removeEventListener("open-grace-companion", handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

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
        body: JSON.stringify({ language: chatLang, topic: tag, messages: next.slice(-12) }),
      });
      if (!resp.ok || !resp.body) throw new Error("unavailable");
      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      setMsgs((m) => [...m, { role: "assistant", content: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        const snapshot = acc;
        setMsgs((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: snapshot };
          return copy;
        });
      }
      if (!acc) throw new Error("empty");
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: fill(t.widget.errorBody) }]);
    } finally {
      setBusy(false);
    }
  };

  if (!available) return null;

  return (
    <>
      <button
        type="button"
        className="widget-trigger"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="grace-widget"
        style={{ display: open ? "none" : undefined }}
      >
        {t.widget.trigger}
      </button>

      <div className="widget-backdrop" data-open={open} onClick={() => setOpen(false)} aria-hidden="true" />
      <section
        id="grace-widget"
        className="widget-panel"
        data-open={open}
        role="dialog"
        aria-modal="false"
        aria-label={t.widget.title}
      >
        <div className="widget-head">
          <span className="widget-head__title">{t.widget.title}</span>
          <button type="button" className="widget-head__close" onClick={() => setOpen(false)}>
            {t.widget.close}
          </button>
        </div>

        {!agreed ? (
          <div className="widget-gate">
            <p className="widget-gate__title">{t.widget.gateTitle}</p>
            <p>{t.widget.gateBody}</p>
            <label className="widget-gate__consent">
              <input
                type="checkbox"
                checked={consentBox}
                onChange={(e) => setConsentBox(e.target.checked)}
              />
              <span>
                {t.widget.gateAgree}{" "}
                <Link to="/privacy" onClick={() => setOpen(false)}>
                  {t.widget.gateAgreeLink}
                </Link>
              </span>
            </label>
            <button
              type="button"
              className="btn"
              style={{ width: "100%" }}
              disabled={!consentBox}
              onClick={() => {
                setAgreed(true);
                window.localStorage.setItem(CONSENT_KEY, "yes");
              }}
            >
              {t.widget.gateEnter}
            </button>
          </div>
        ) : (
          <>
            <div className="widget-controls">
              <div className="widget-langs" role="group" aria-label={t.widget.yourLang}>
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className="widget-lang"
                    data-active={chatLang === l.code}
                    aria-pressed={chatLang === l.code}
                    onClick={() => setChatLang(l.code)}
                  >
                    {l.code === "en" ? "EN" : l.code === "zh" ? "中文" : l.code === "ar" ? "ع" : l.code.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="widget-tags" role="group" aria-label={t.widget.bringsYou}>
                {(Object.keys(TAG_KEYS) as TagId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    className="widget-tag"
                    data-active={tag === id}
                    aria-pressed={tag === id}
                    onClick={() => setTag(id)}
                  >
                    {t.widget[TAG_KEYS[id]]}
                  </button>
                ))}
              </div>
            </div>

            <div className="widget-scroll" ref={scrollRef} aria-live="polite">
              {greeting ? (
                <div className="msg msg--grace">
                  <span className="msg__tag">{t.widget.companion}</span>
                  {greeting}
                </div>
              ) : (
                <div className="msg msg--grace">
                  <span className="typing" aria-label={t.widget.writing}>
                    <i /> <i /> <i />
                  </span>
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={m.role === "user" ? "msg msg--you" : "msg msg--grace"}>
                  {m.role === "assistant" ? <span className="msg__tag">{t.widget.companion}</span> : null}
                  {m.content}
                </div>
              ))}
              {busy ? (
                <div className="msg msg--grace">
                  <span className="msg__tag">{t.widget.companion}</span>
                  <span className="typing" aria-label={t.widget.writing}>
                    <i /> <i /> <i />
                  </span>
                </div>
              ) : null}
            </div>

            <form className="chat-input-row" onSubmit={send}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.widget.inputPh}
                aria-label={t.widget.inputPh}
                maxLength={2000}
              />
              <button type="submit" disabled={busy || !input.trim()}>
                {t.widget.send}
              </button>
            </form>
            <Link to="/prayer" className="widget-reqlink" onClick={() => setOpen(false)}>
              {t.widget.leaveRequest}
            </Link>
          </>
        )}
      </section>
    </>
  );
}

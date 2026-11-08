import { useEffect, useRef, useState } from "react";
import { LANGS, useLang } from "@/i18n";

export function LangSwitch() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="langswitch" ref={ref}>
      <button
        type="button"
        className="langswitch__btn"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t.nav.language}
        onClick={() => setOpen((v) => !v)}
      >
        {lang === "zh" ? "中文" : lang === "ar" ? "العربية" : lang.toUpperCase()}
      </button>
      {open ? (
        <div className="langswitch__menu" role="menu">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              role="menuitemradio"
              aria-checked={lang === l.code}
              data-active={lang === l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, type Dict, type Part } from "./en";
import { SITE } from "@/lib/site";

export const LANGS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
  { code: "zh", label: "中文" },
  { code: "fr", label: "Français" },
] as const;

export type LangCode = (typeof LANGS)[number]["code"];

/** BCP47 locale used for date and time formatting per language */
export const LOCALES: Record<LangCode, string> = {
  en: "en-GB",
  es: "es-ES",
  it: "it-IT",
  pt: "pt-PT",
  ar: "ar-EG",
  zh: "zh-CN",
  fr: "fr-FR",
};

const loaders: Record<Exclude<LangCode, "en">, () => Promise<{ default: Dict }>> = {
  es: () => import("./es"),
  it: () => import("./it"),
  pt: () => import("./pt"),
  ar: () => import("./ar"),
  zh: () => import("./zh"),
  fr: () => import("./fr"),
};

type Ctx = {
  lang: LangCode;
  locale: string;
  setLang: (l: LangCode) => void;
  t: Dict;
};

const LangCtx = createContext<Ctx>({ lang: "en", locale: LOCALES.en, setLang: () => {}, t: en });

function isDict(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep merge: chosen language over the English fallback */
function merge(base: unknown, over: unknown): unknown {
  if (over === undefined || over === null || over === "") return base;
  if (Array.isArray(base) || Array.isArray(over)) return over ?? base;
  if (isDict(base) && isDict(over)) {
    const out: Record<string, unknown> = { ...base };
    for (const k of Object.keys(base)) out[k] = merge(base[k], over[k]);
    return out;
  }
  return over;
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("trgmi-lang") : null;
    return (LANGS.find((l) => l.code === saved)?.code ?? "en") as LangCode;
  });
  const [dict, setDict] = useState<Dict>(en);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("trgmi-lang", lang);
    if (lang === "en") {
      setDict(en);
      return;
    }
    let alive = true;
    loaders[lang]().then((m) => {
      if (alive) setDict(merge(en, m.default) as Dict);
    });
    return () => {
      alive = false;
    };
  }, [lang]);

  const value = useMemo(
    () => ({ lang, locale: LOCALES[lang], setLang: setLangState, t: dict }),
    [lang, dict]
  );
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}

/** Replace {phone} / {email} / and custom tokens */
export function fill(template: string, tokens: Record<string, string> = {}): string {
  const all: Record<string, string> = { phone: SITE.phoneDisplay, email: SITE.email, ...tokens };
  return template.replace(/\{(\w+)\}/g, (_, k) => all[k] ?? `{${k}}`);
}

/** Render a Part[] title with italic accents */
export function Parts({ parts, emStyle }: { parts: Part[]; emStyle?: React.CSSProperties }) {
  return (
    <>
      {parts.map((p, i) =>
        p.i ? (
          <em key={i} className="serif-italic" style={emStyle ?? { color: "var(--wine)" }}>
            {p.t}{" "}
          </em>
        ) : (
          <span key={i}>{p.t} </span>
        )
      )}
    </>
  );
}

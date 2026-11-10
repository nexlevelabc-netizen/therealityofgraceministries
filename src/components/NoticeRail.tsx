import { useEffect, useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useLang } from "@/i18n";

export function NoticeRail() {
  const { t, locale } = useLang();
  const gatherings = trpc.events.upcoming.useQuery({ limit: 4 });
  const items = gatherings.data ?? [];
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || items.length < 2) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % items.length), 6000);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, items.length]);

  if (items.length === 0) return null;

  const ev = items[idx % items.length];
  const d = new Date(ev.startsAt);
  const date = d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/London" });
  const time = d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

  return (
    <div
      className="notice"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="notice__pill">
        <span className="notice__kicker">{t.home.tickerKicker}</span>
        <span className="notice__dot" aria-hidden="true">
          ·
        </span>
        <Link key={ev.id} to="/gatherings" className="notice__link">
          {date} · {time} · {ev.title}
        </Link>
        <button
          type="button"
          className="notice__toggle"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? t.home.tickerPlay : t.home.tickerPause}
        </button>
      </div>
    </div>
  );
}

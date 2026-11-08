import type { ReactNode } from "react";

export function PageHero({
  kicker,
  title,
  intro,
  dark = false,
}: {
  kicker: string;
  title: ReactNode;
  intro?: string;
  dark?: boolean;
}) {
  return (
    <section className={`page-hero ${dark ? "band-dark" : ""}`}>
      <div className="shell">
        <span className="minititle" data-reveal>
          {kicker}
        </span>
        <h1 className="display-hero" style={{ marginTop: "1.4rem", textWrap: "balance" }}>
          {title}
        </h1>
        {intro ? (
          <p className="lede" style={{ marginTop: "1.8rem", maxWidth: "34ch" }} data-reveal>
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/** Wrap each line in a masked reveal span */
export function MaskedLines({ lines }: { lines: ReactNode[] }) {
  return (
    <>
      {lines.map((l, i) => (
        <span className="mask-line" key={i} style={{ transitionDelay: `${i * 0.12}s` }}>
          <span style={{ transitionDelay: `${i * 0.12}s` }}>{l}</span>
        </span>
      ))}
    </>
  );
}

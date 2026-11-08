import { PageHero } from "@/components/PageHero";
import { fill, useLang } from "@/i18n";

export default function Privacy() {
  const { t } = useLang();
  return (
    <>
      <PageHero
        kicker={t.privacy.kicker}
        title={
          <>
            {t.privacy.titleA}{" "}
            <em className="serif-italic" style={{ color: "var(--wine)" }}>
              {t.privacy.titleEm}
            </em>
          </>
        }
        intro={t.privacy.intro}
      />

      <section className="section--tight">
        <div className="shell--narrow prose-copy" style={{ marginInline: "auto" }}>
          <h2>{t.privacy.h1}</h2>
          <p>{fill(t.privacy.p1)}</p>

          <h2>{t.privacy.h2}</h2>
          <ul>
            <li>{t.privacy.li1}</li>
            <li>{t.privacy.li2}</li>
            <li>{t.privacy.li3}</li>
            <li>{t.privacy.li4}</li>
          </ul>

          <h2>{t.privacy.h3}</h2>
          <p>{t.privacy.p3}</p>

          <h2>{t.privacy.h4}</h2>
          <p>{t.privacy.p4}</p>

          <h2>{t.privacy.h5}</h2>
          <p>{fill(t.privacy.p5)}</p>

          <h2>{t.privacy.h6}</h2>
          <p>{t.privacy.p6}</p>

          <h2>{t.privacy.h7}</h2>
          <p>{t.privacy.p7}</p>
        </div>
      </section>
    </>
  );
}

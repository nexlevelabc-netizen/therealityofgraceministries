import { Link } from "react-router";
import { useLang } from "@/i18n";

export default function NotFound() {
  const { t } = useLang();
  return (
    <section className="page-hero" style={{ minHeight: "70vh" }}>
      <div className="shell" style={{ textAlign: "center" }}>
        <span className="minititle" style={{ justifyContent: "center" }}>
          {t.notfound.kicker}
        </span>
        <h1 className="display-hero" style={{ marginTop: "1.4rem", fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}>
          {t.notfound.titleA}{" "}
          <em className="serif-italic" style={{ color: "var(--wine)" }}>
            {t.notfound.titleEm}
          </em>
        </h1>
        <p className="body-copy" style={{ margin: "1.4rem auto 0" }}>
          {t.notfound.body}
        </p>
        <div style={{ marginTop: "2rem" }}>
          <Link to="/" className="btn">
            {t.notfound.back}
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router";

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: "70vh" }}>
      <div className="shell" style={{ textAlign: "center" }}>
        <span className="minititle" style={{ justifyContent: "center" }}>
          Page not found
        </span>
        <h1 className="display-hero" style={{ marginTop: "1.4rem", fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}>
          This door is <em className="serif-italic" style={{ color: "var(--wine)" }}>closed</em>
        </h1>
        <p className="body-copy" style={{ margin: "1.4rem auto 0" }}>
          The page you asked for does not exist, but every other door is open.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <Link to="/" className="btn">
            Back to the beginning
          </Link>
        </div>
      </div>
    </section>
  );
}

import { PageHero } from "@/components/PageHero";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <>
      <PageHero
        kicker="Members"
        title={
          <>
            Your place <em className="serif-italic" style={{ color: "var(--wine)" }}>in the house</em>
          </>
        }
        intro="Sign in to see your giving history and the requests you have entrusted to us."
      />
      <section className="section--tight">
        <div className="shell--narrow" style={{ marginInline: "auto", textAlign: "center" }}>
          <button
            type="button"
            className="btn"
            style={{ minWidth: "16rem" }}
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
          >
            Sign in with Kimi
          </button>
          <p className="body-copy" style={{ margin: "1.4rem auto 0", maxWidth: "40ch", fontSize: "0.92rem" }}>
            Sign in is provided by Kimi. We only receive your name and email, and we use them solely
            to keep your records together.
          </p>
        </div>
      </section>
    </>
  );
}

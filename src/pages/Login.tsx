import { PageHero } from "@/components/PageHero";
import { useLang } from "@/i18n";

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
  const { t } = useLang();
  return (
    <>
      <PageHero
        kicker={t.login.kicker}
        title={
          <>
            {t.login.titleA}{" "}
            <em className="serif-italic" style={{ color: "var(--wine)" }}>
              {t.login.titleEm}
            </em>
          </>
        }
        intro={t.login.intro}
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
            {t.login.button}
          </button>
          <p className="body-copy" style={{ margin: "1.4rem auto 0", maxWidth: "40ch", fontSize: "0.92rem" }}>
            {t.login.note}
          </p>
        </div>
      </section>
    </>
  );
}

import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/site";

export default function Privacy() {
  return (
    <>
      <PageHero
        kicker="Privacy statement"
        title={
          <>
            Your trust, <em className="serif-italic" style={{ color: "var(--wine)" }}>handled with care</em>
          </>
        }
        intro="This statement explains what we collect, why we collect it, and the choices you have. It is written to be read, not to hide in."
      />

      <section className="section--tight">
        <div className="shell--narrow prose-copy" style={{ marginInline: "auto" }}>
          <h2>Who we are</h2>
          <p>
            The Reality of Grace Ministries Int'l ("the ministry") is the data controller for the
            information you share through this website. You can reach us at any time on{" "}
            {SITE.phoneDisplay} or at {SITE.email}.
          </p>

          <h2>What we collect and why</h2>
          <ul>
            <li>
              Contact and visit forms: your name, email and message, used only to respond to you.
            </li>
            <li>
              Prayer and counselling: whatever you choose to share, held in confidence within the
              pastoral team, used only to pray for you and, where requested, to follow up.
            </li>
            <li>
              Giving: your name, email, fund and amount, used to record your gift, send receipts and
              process Gift Aid where you opt in. Card and bank details are handled by Stripe and
              never touch our servers.
            </li>
            <li>
              Member accounts: your sign in details, used to show your giving history and requests.
            </li>
          </ul>

          <h2>What we never do</h2>
          <p>
            We never sell your information, never share it with advertisers, and never use your
            prayer or counselling conversations for any purpose other than caring for you.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiry and prayer records are kept only as long as they are needed to care for you.
            Giving records are kept for the period required by charity and tax law. You may ask us
            to delete your information at any time, subject to those legal duties.
          </p>

          <h2>Your rights</h2>
          <p>
            You may ask to see, correct or erase the information we hold about you, and you may
            withdraw consent at any time. Write to {SITE.email} and we will respond promptly.
          </p>

          <h2>Cookies</h2>
          <p>
            This site uses only the cookies needed to keep you signed in and keep the site secure.
            We run no advertising or analytics trackers.
          </p>

          <h2>Changes</h2>
          <p>
            If this statement changes, the updated version will appear on this page with the date of
            the change. Last reviewed in November 2026.
          </p>
        </div>
      </section>
    </>
  );
}

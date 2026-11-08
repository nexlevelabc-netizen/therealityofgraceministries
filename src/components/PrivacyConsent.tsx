import { Link } from "react-router";

export function PrivacyConsent({
  checked,
  onChange,
  context,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  context: string;
}) {
  return (
    <label className="consent" style={{ cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-describedby="consent-copy"
      />
      <p id="consent-copy">
        I have read and agree to the <Link to="/privacy">privacy statement</Link>. I understand
        that the details I share here are used only to respond to my {context}, are kept
        confidential within the ministry team, and are never sold or shared outside it.
      </p>
    </label>
  );
}

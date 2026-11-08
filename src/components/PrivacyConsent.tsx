import { Link } from "react-router";
import { fill, useLang } from "@/i18n";

type ConsentContext = keyof ReturnType<typeof useLang>["t"]["consent"]["contexts"];

export function PrivacyConsent({
  checked,
  onChange,
  context,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  context: ConsentContext;
}) {
  const { t } = useLang();
  return (
    <label className="consent" style={{ cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-describedby="consent-copy"
      />
      <p id="consent-copy">
        {t.consent.prefix} <Link to="/privacy">{t.consent.link}</Link>.{" "}
        {fill(t.consent.suffix, { context: t.consent.contexts[context] })}
      </p>
    </label>
  );
}

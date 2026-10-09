import { WhatsappLogo } from "@phosphor-icons/react";
import { WHATSAPP_URL } from "../../config/film";
import { useI18n } from "../../i18n/I18nProvider";

/** A direct line to BGold on WhatsApp (soft green, white mark), floating gently above "back to top". */
export function WhatsAppButton() {
  const { t } = useI18n();
  return (
    <a
      className="whatsapp-btn"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.nav.whatsapp}
      title={t.nav.whatsapp}
    >
      <WhatsappLogo size={28} weight="fill" aria-hidden="true" />
    </a>
  );
}

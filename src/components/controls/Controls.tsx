import { Moon, Sun } from "@phosphor-icons/react";
import { useI18n } from "../../i18n/I18nProvider";
import { LANGS } from "../../i18n/strings";
import { useTheme } from "../../theme/ThemeProvider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const label = theme === "dark" ? t.nav.toLight : t.nav.toDark;
  return (
    <button type="button" className={`icon-btn ${className ?? ""}`} onClick={toggle} aria-label={label} title={label}>
      {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}

export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div className={`lang-switch ${className ?? ""}`} role="group" aria-label={t.nav.language}>
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          lang={l.html}
          aria-pressed={lang === l.id}
          aria-label={l.name}
          onClick={() => setLang(l.id)}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}

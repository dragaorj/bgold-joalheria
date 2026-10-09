import { ArrowUpRight, InstagramLogo } from "@phosphor-icons/react";
import { INSTAGRAM_URL } from "../../config/film";
import { useI18n } from "../../i18n/I18nProvider";
import { scrollToTarget } from "../../lib/scroll";
import { Logo } from "../brand/Logo";

/** 05 · Contato, then a quiet footer. */
export function Contact() {
  const { t, lang } = useI18n();
  const year = new Date().getFullYear();
  const links = [
    { href: "#joalheria", label: t.nav.links.joalheria },
    { href: "#criacoes", label: t.nav.links.criacoes },
    { href: "#processo", label: t.nav.links.processo },
    { href: "#contato", label: t.nav.links.contato },
  ];
  return (
    <>
      <section id="contato" className="contact section" aria-labelledby="contact-title">
        <div className="contact__inner">
          <h2 key={`contact-title-${lang}`} id="contact-title" className="display contact__title" data-reveal="lines">
            {t.contact.title.map((p) => (
              <span key={p} className="phrase">
                {p}
              </span>
            ))}
          </h2>
          <span className="cota cota--left" data-reveal="cota" aria-hidden="true" />
          <p key={`contact-text-${lang}`} className="contact__text" data-reveal="words">
            {t.contact.text}
          </p>
          <div className="contact__actions" data-reveal="fade" data-delay="0.1">
            <a className="btn btn--gold" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              {t.contact.primary}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a className="btn btn--line" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              {t.contact.secondary}
            </a>
          </div>
        </div>
      </section>

      <footer className="footer section">
        <div className="footer__inner">
          <div className="footer__top">
            <a className="footer__brand brand" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={t.nav.home}>
              <Logo alt="" />
            </a>
            <nav className="footer__nav" aria-label={t.nav.primary}>
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget(l.href);
                  }}
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <a className="footer__ig" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <InstagramLogo size={18} aria-hidden="true" />
              @bgold.joalheria
            </a>
          </div>
          <span className="cota footer__cota" data-reveal="cota" aria-hidden="true" />
          <div className="footer__bottom">
            <p className="footer__line display">{t.footer.line}</p>
            <p className="footer__legal">
              © {year} {t.footer.legal}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

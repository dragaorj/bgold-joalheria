/**
 * The BGold logo, in the colour that reads on the background behind it:
 * black on light grounds, white on dark grounds (see `.logo__v` in the CSS,
 * which picks one from the theme or, in the menu over the film, from the
 * film's tone). The full lockup is used on wider screens, the compact mark
 * on phones. The gold version is kept for the signature at the end of the
 * film and the favicon.
 */
export function Logo({ className, alt = "BGold Joalheria" }: { className?: string; alt?: string }) {
  return (
    <span className={`logo ${className ?? ""}`}>
      <picture className="logo__v logo__v--ink">
        <source media="(max-width: 767px)" srcSet="/brand/logo-black-mobile.svg" width={85} height={83} />
        <img src="/brand/logo-black.svg" alt={alt} width={326} height={84} decoding="async" />
      </picture>
      <picture className="logo__v logo__v--light">
        <source media="(max-width: 767px)" srcSet="/brand/logo-white-mobile.svg" width={85} height={83} />
        <img src="/brand/logo-white.svg" alt={alt} width={326} height={84} decoding="async" />
      </picture>
      {/* gold, revealed on hover where the logo is a link */}
      <picture className="logo__v logo__v--gold" aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/brand/logo-mobile.svg" width={85} height={83} />
        <img src="/brand/logo.svg" alt="" width={326} height={84} decoding="async" />
      </picture>
    </span>
  );
}

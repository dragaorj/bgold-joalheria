import { useEffect, useRef } from "react";
import { Quotes, Star } from "@phosphor-icons/react";
import { CLIENTS_ARE_EXAMPLES, CLIENT_CARDS, type ClientCardStyle } from "../../config/clients";
import { useI18n } from "../../i18n/I18nProvider";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/scroll";

const COLUMNS = 3;

/**
 * 06 · O que dizem sobre a BGold. A loose grid of mixed cards (quote, rating,
 * portrait, side-by-side, speech bubble). Cards rise in as they reach the
 * viewport; on wide screens the three columns drift at slightly different
 * speeds, so the wall feels alive without anything looping.
 */
export function Clients() {
  const { t, lang } = useI18n();
  const c = t.clients;
  const root = useRef<HTMLElement>(null);
  const hidden = CLIENTS_ARE_EXAMPLES && import.meta.env.PROD;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-client]");
      gsap.set(cards, { opacity: 0, y: reduced ? 0 : 70, scale: reduced ? 1 : 0.96, rotation: () => (reduced ? 0 : gsap.utils.random(-2.5, 2.5)) });
      ScrollTrigger.batch(cards, {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: "expo.out",
            overwrite: true,
          }),
        onLeaveBack: (batch) =>
          gsap.to(batch, { opacity: 0, y: reduced ? 0 : 50, scale: reduced ? 1 : 0.97, duration: 0.5, stagger: 0.05, overwrite: true }),
      });
      // stars light up one by one once their card is in
      gsap.utils.toArray<HTMLElement>("[data-client]").forEach((card) => {
        const stars = card.querySelectorAll(".client__stars svg");
        if (!stars.length) return;
        gsap.fromTo(
          stars,
          { scale: reduced ? 1 : 0.4, opacity: 0.2 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.07,
            ease: "back.out(2.4)",
            scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" },
          },
        );
      });
      if (!reduced) {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 900px)", () => {
          const drift = [-6, 7, -9];
          gsap.utils.toArray<HTMLElement>(".clients__col").forEach((col, i) => {
            gsap.fromTo(
              col,
              { yPercent: -drift[i] / 2 },
              {
                yPercent: drift[i] / 2,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          });
        });
      }
    }, el);
    return () => ctx.revert();
  }, [lang]);

  if (hidden) return null;

  const cols: number[][] = Array.from({ length: COLUMNS }, () => []);
  c.items.forEach((_, i) => cols[i % COLUMNS].push(i));

  return (
    <section ref={root} id="clientes" className="clients section" aria-labelledby="clients-title">
      <div className="clients__head">
        <h2 key={`clients-title-${lang}`} id="clients-title" className="display clients__title" data-reveal="lines">
          {c.title.map((p) => (
            <span key={p} className="phrase">
              {p}
            </span>
          ))}
        </h2>
        <p key={`clients-lead-${lang}`} className="clients__lead" data-reveal="words">
          {c.lead}
        </p>
        {CLIENTS_ARE_EXAMPLES && (
          <p className="clients__example" role="note">
            {c.exampleNote}
          </p>
        )}
      </div>

      <div className="clients__grid">
        {cols.map((col, ci) => (
          <div key={ci} className="clients__col">
            {col.map((i) => (
              <ClientCard
                key={`${lang}-${i}`}
                style={CLIENT_CARDS[i].style}
                photo={CLIENT_CARDS[i].photo}
                item={c.items[i]}
                rating={c.rating}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Stars({ label }: { label: string }) {
  return (
    <div className="client__stars" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={16} weight="fill" aria-hidden="true" />
      ))}
    </div>
  );
}

function ClientCard({
  style,
  photo,
  item,
  rating,
}: {
  style: ClientCardStyle;
  photo: string;
  item: { name: string; product: string; headline?: string; text: string };
  rating: string;
}) {
  const avatar = (size: "sm" | "md" | "lg") => (
    <img className={`client__avatar client__avatar--${size}`} src={photo} alt="" loading="lazy" decoding="async" width={256} height={256} />
  );
  const who = (
    <figcaption className="client__who">
      <span className="client__name">{item.name}</span>
      <span className="client__product">{item.product}</span>
    </figcaption>
  );
  const quote = (
    <blockquote className="client__text">
      <p>{item.text}</p>
    </blockquote>
  );

  return (
    <figure className={`client client--${style}`} data-client>
      {style === "photo" && <img className="client__photo" src={photo} alt="" loading="lazy" decoding="async" width={256} height={256} />}
      {(style === "stars" || style === "bubble") && avatar("lg")}
      {style === "quote" && <Quotes className="client__mark" size={34} weight="fill" aria-hidden="true" />}
      {style !== "quote" && style !== "side" && <Stars label={rating} />}
      {item.headline && <p className="client__headline display">{item.headline}</p>}
      {style === "side" ? (
        <div className="client__row">
          {avatar("md")}
          <div>
            {quote}
            {who}
          </div>
        </div>
      ) : style === "split" ? (
        <div className="client__row client__row--split">
          <div>
            {quote}
            {who}
          </div>
          {avatar("lg")}
        </div>
      ) : style === "quote" ? (
        <>
          {quote}
          <div className="client__row client__row--end">
            {who}
            {avatar("sm")}
          </div>
        </>
      ) : (
        <>
          {quote}
          {who}
        </>
      )}
    </figure>
  );
}

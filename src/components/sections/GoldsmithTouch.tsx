import { REELS } from "../../config/reels";
import { useI18n } from "../../i18n/I18nProvider";
import { ReelPlayer } from "../media/ReelPlayer";

/** 04 · O toque do ourives. Two clips from the workshop, one overlapping the other. */
export function GoldsmithTouch() {
  const { t, lang } = useI18n();
  return (
    <section id="processo" className="touch section" aria-labelledby="touch-title">
      <div className="touch__media">
        <figure className="touch__main" data-reveal="clip">
          <ReelPlayer reels={[REELS.solitaireBlackBox]} label={t.touch.altMain} />
        </figure>
        <figure className="touch__detail" data-parallax="-14">
          <ReelPlayer reels={[REELS.diamondMacro]} label={t.touch.altDetail} />
        </figure>
      </div>

      <div className="touch__text">
        <h2 key={`touch-title-${lang}`} id="touch-title" className="display touch__title" data-reveal="lines">
          {t.touch.title.map((p) => (
            <span key={p} className="phrase">
              {p}
            </span>
          ))}
        </h2>
        <span className="cota cota--left" data-reveal="cota" aria-hidden="true" />
        <p key={`touch-text-${lang}`} data-reveal="words">
          {t.touch.text}
        </p>
      </div>
    </section>
  );
}

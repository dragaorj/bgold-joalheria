import { useState } from "react";
import { ART_REELS } from "../../config/reels";
import { useI18n } from "../../i18n/I18nProvider";
import { ReelPlayer } from "../media/ReelPlayer";

/**
 * 02 · A arte da BGold. Copy on the left, the workshop clips on the right;
 * the clips run one after another and the thumbnails under the frame let the
 * visitor jump to any of them.
 */
export function ArtOfBGold() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState(0);
  return (
    <section id="joalheria" className="art section" aria-labelledby="art-title">
      <div className="art__grid">
        <div className="art__copy">
          <h2 key={`art-title-${lang}`} id="art-title" className="display art__title" data-reveal="lines">
            {t.art.title.map((p) => (
              <span key={p} className="phrase">
                {p}
              </span>
            ))}
          </h2>
          <div className="art__text">
            <span className="cota cota--left" data-reveal="cota" aria-hidden="true" />
            <p key={`art-text-${lang}`} data-reveal="words">
              {t.art.text}
            </p>
          </div>
        </div>

        <div className="art__media">
          <figure className="art__figure" data-reveal="clip">
            <ReelPlayer reels={ART_REELS} label={t.art.alt} progress active={active} onActiveChange={setActive} />
          </figure>
          <div className="reel-thumbs" role="group" aria-label={t.art.more} data-reveal="fade">
            {ART_REELS.map((r, i) => (
              <button
                key={r.src}
                type="button"
                className="reel-thumb"
                aria-pressed={i === active}
                aria-label={t.art.videos[i]}
                title={t.art.videos[i]}
                onClick={() => setActive(i)}
              >
                <img src={r.poster} alt="" loading="lazy" decoding="async" style={{ objectPosition: r.position }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

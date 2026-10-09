import { forwardRef } from "react";
import { CHAPTERS } from "../../config/film";

const TICKS = 61;

interface Props {
  onJump: (p: number) => void;
  labels: readonly string[];
  navLabel: string;
}

/**
 * The signature device: a goldsmith's millimetre rule standing on the right
 * edge of the film. It is the scroll progress indicator. The chapter marks sit
 * at their real positions in the timeline, and a gold cursor slides down the
 * scale with the visitor's hand. Clicking a mark scrolls to that chapter.
 */
export const DraftRule = forwardRef<HTMLDivElement, Props>(function DraftRule({ onJump, labels, navLabel }, ref) {
  return (
    <div ref={ref} className="draft-rule" data-active="0">
      <div className="draft-rule__scale" aria-hidden="true">
        {Array.from({ length: TICKS }, (_, i) => (
          <span
            key={i}
            className={i % 10 === 0 ? "tick tick--major" : i % 5 === 0 ? "tick tick--mid" : "tick"}
            style={{ top: `${(i / (TICKS - 1)) * 100}%` }}
          />
        ))}
        <span className="draft-rule__fill" />
        <span className="draft-rule__cursor" />
      </div>
      <nav aria-label={navLabel}>
        <ol className="draft-rule__marks">
          {CHAPTERS.map((c, i) => (
            <li key={c.id} style={{ top: `${c.start * 100}%` }} data-i={i}>
              <button type="button" onClick={() => onJump(c.focus)}>
                {labels[i]}
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
});

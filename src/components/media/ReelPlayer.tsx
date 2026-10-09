import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import { useI18n } from "../../i18n/I18nProvider";
import { gsap, prefersReducedMotion } from "../../lib/scroll";

export interface Reel {
  src: string;
  poster: string;
  /** focal point of the jewel in the clip, as an object-position */
  position?: string;
}

interface Props {
  reels: Reel[];
  label: string;
  className?: string;
  /** show the thin per-clip progress marks under the frame */
  progress?: boolean;
  /** controlled mode: which clip plays, and who hears about changes */
  active?: number;
  onActiveChange?: (i: number) => void;
}

/**
 * Brand clips that play only while on screen. With several clips they run in
 * sequence with a crossfade; with one clip it loops. Muted, inline, with a
 * pause button (anything that moves for more than five seconds must be
 * pausable). Reduced motion starts paused on the first frame.
 */
export function ReelPlayer({
  reels,
  label,
  className,
  progress = false,
  active: activeProp,
  onActiveChange,
}: Props) {
  const { t } = useI18n();
  const root = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const [activeState, setActiveState] = useState(0);
  const [paused, setPaused] = useState(() => prefersReducedMotion());
  const [visible, setVisible] = useState(false);
  const [near, setNear] = useState(false);
  const active = activeProp ?? activeState;
  const single = reels.length === 1;

  const setActive = (i: number) => {
    if (activeProp === undefined) setActiveState(i);
    onActiveChange?.(i);
  };

  // play only on screen; start loading a little before
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setNear(true);
      },
      { threshold: 0.15 },
    );
    const pre = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "600px 0px" });
    io.observe(el);
    pre.observe(el);
    return () => {
      io.disconnect();
      pre.disconnect();
    };
  }, []);

  // a newly chosen clip starts from its beginning
  const prevActive = useRef(active);
  useEffect(() => {
    if (prevActive.current !== active) {
      const v = vids.current[active];
      if (v) v.currentTime = 0;
      prevActive.current = active;
    }
  }, [active]);

  // drive the active clip
  useEffect(() => {
    const v = vids.current[active];
    if (!v) return;
    vids.current.forEach((o, i) => {
      if (o && i !== active) o.pause();
    });
    if (visible && !paused && near) v.play().catch(() => {});
    else v.pause();
  }, [active, visible, paused, near]);

  // crossfade between clips, and reset the marks of the others
  useEffect(() => {
    vids.current.forEach((v, i) => {
      if (!v) return;
      gsap.to(v, { autoAlpha: i === active ? 1 : 0, duration: prefersReducedMotion() ? 0 : 0.9, ease: "power2.out" });
    });
    bars.current.forEach((b, i) => {
      if (b && i !== active) b.style.transform = i < active ? "scaleX(1)" : "scaleX(0)";
    });
  }, [active]);

  const onEnded = (i: number) => {
    if (single || i !== active) return;
    setActive((i + 1) % reels.length);
  };

  const onTime = (i: number) => {
    const v = vids.current[i];
    const bar = bars.current[i];
    if (!v || !bar || !v.duration) return;
    bar.style.transform = `scaleX(${v.currentTime / v.duration})`;
  };

  return (
    <div
      ref={root}
      className={`reel ${className ?? ""}`}
      role="group"
      aria-label={label}
    >
      <div className="reel__stack" data-reveal-media>
        {reels.map((r, i) => (
          <video
            key={r.src}
            ref={(el) => (vids.current[i] = el)}
            className="reel__video"
            src={near ? r.src : undefined}
            poster={r.poster}
            muted
            playsInline
            loop={single}
            preload={near ? (i === active ? "auto" : "metadata") : "none"}
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
            style={{
              objectPosition: r.position ?? "50% 50%",
              opacity: i === active ? 1 : 0,
              visibility: i === active ? "visible" : "hidden",
            }}
            onEnded={() => onEnded(i)}
            onTimeUpdate={() => onTime(i)}
          />
        ))}
      </div>
      <button
        type="button"
        className="reel__toggle icon-btn"
        aria-label={paused ? t.nav.play : t.nav.pause}
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? <Play size={14} weight="fill" aria-hidden="true" /> : <Pause size={14} weight="fill" aria-hidden="true" />}
      </button>
      {progress && !single && (
        <div className="reel__marks" aria-hidden="true">
          {reels.map((r, i) => (
            <span key={r.src} className="reel__mark">
              <span ref={(el) => (bars.current[i] = el)} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

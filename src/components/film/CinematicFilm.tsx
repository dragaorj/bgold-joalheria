import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { CHAPTERS, FILM_TONE, INSTAGRAM_URL, VIDEO, videoProgressAt } from "../../config/film";
import { useI18n } from "../../i18n/I18nProvider";
import { FilmScrubber, type ScrubMode } from "../../lib/filmScrubber";
import { ScrollTrigger, gsap, prefersReducedMotion, scrollToTarget } from "../../lib/scroll";
import { useLayoutKey } from "../../lib/layoutKey";
import { useMediaQuery } from "../../lib/useMediaQuery";
import { DraftRule } from "./DraftRule";
import { buildChapterTimeline } from "./FilmTimeline";

interface Props {
  ready: boolean;
  onLoadProgress: (r: number) => void;
  onLoaded: () => void;
}

export function CinematicFilm({ ready, onLoadProgress, onLoaded }: Props) {
  const { t, lang } = useI18n();
  const f = t.film;
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const rule = useRef<HTMLDivElement>(null);
  const scrubber = useRef<FilmScrubber | null>(null);
  const progress = useRef(0);
  const [mode, setMode] = useState<ScrubMode>("loading");

  const portrait = useMediaQuery("(max-aspect-ratio: 1/1)");
  const layoutKey = useLayoutKey();

  // Keep the latest callbacks without re-running the loader.
  const cb = useRef({ onLoadProgress, onLoaded });
  cb.current = { onLoadProgress, onLoaded };

  /* ---------- video: load, verify seeking, fall back if needed ---------- */
  useEffect(() => {
    if (!video.current || !canvas.current) return;
    const s = new FilmScrubber(video.current, canvas.current);
    scrubber.current = s;
    const ac = new AbortController();
    s.whenReady(() => {
      setMode(s.mode);
      s.setProgress(videoProgressAt(progress.current));
      cb.current.onLoaded();
    });
    s.load({
      src: portrait ? VIDEO.portrait : VIDEO.landscape,
      sequence: {
        url: portrait ? VIDEO.sequence.portrait : VIDEO.sequence.landscape,
        count: VIDEO.sequence.count,
      },
      fps: VIDEO.fps,
      onProgress: (r) => cb.current.onLoadProgress(r),
      signal: ac.signal,
    });

    // iOS paints seeked frames only after one gesture-initiated play().
    const prime = () => s.prime();
    window.addEventListener("touchstart", prime, { once: true, passive: true });
    window.addEventListener("pointerdown", prime, { once: true });
    const onResize = () => s.resize();
    window.addEventListener("resize", onResize);

    return () => {
      ac.abort();
      window.removeEventListener("touchstart", prime);
      window.removeEventListener("pointerdown", prime);
      window.removeEventListener("resize", onResize);
      s.destroy();
      scrubber.current = null;
      setMode("loading");
    };
  }, [portrait]);

  /* ---------- one ScrollTrigger drives video + chapters + rule ---------- */
  useLayoutEffect(() => {
    const root = stage.current;
    const sec = section.current;
    if (!root || !sec) return;
    const reduced = prefersReducedMotion();
    let splits: { revert: () => void }[] = [];
    const ctx = gsap.context(() => {
      const built = buildChapterTimeline(root, reduced);
      const tl = built.tl;
      splits = built.splits;
      let activeChapter = -1;

      const apply = (p: number) => {
        progress.current = p;
        tl.progress(p);
        scrubber.current?.setProgress(videoProgressAt(p));
        root.style.setProperty("--p", p.toFixed(4));
        const tone = p >= FILM_TONE.darkFrom ? "dark" : "light";
        if (root.dataset.tone !== tone) root.dataset.tone = tone;
        const topTone = p >= FILM_TONE.topDarkFrom ? "dark" : "light";
        if (root.dataset.topTone !== topTone) root.dataset.topTone = topTone;
        if (document.documentElement.dataset.filmTone !== topTone) document.documentElement.dataset.filmTone = topTone;
        const started = p > 0.004 ? "true" : "false";
        if (root.dataset.started !== started) root.dataset.started = started;
        let idx = 0;
        for (let i = 0; i < CHAPTERS.length; i++) if (p >= CHAPTERS[i].start) idx = i;
        if (idx !== activeChapter) {
          activeChapter = idx;
          rule.current?.setAttribute("data-active", String(idx));
        }
      };

      const st = ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
      // the nav floats over the film without its section background
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "bottom top+=72",
        onToggle: (self) => {
          if (self.isActive) delete document.documentElement.dataset.section;
        },
      });
      // keep the current position when rebuilding (language or breakpoint change)
      apply(st.progress);
    }, root);
    return () => {
      ctx.revert();
      splits.forEach((sp) => sp.revert());
    };
  }, [lang, layoutKey]);

  /* ---------- opening: the first headline settles in once loaded ---------- */
  useEffect(() => {
    if (!ready || !stage.current) return;
    if (progress.current > 0.06) return;
    const reduced = prefersReducedMotion();
    const lines = stage.current.querySelectorAll(".ch-intro h1 .sl");
    const tw = gsap.fromTo(
      lines,
      { yPercent: reduced ? 0 : 108, opacity: reduced ? 0 : 1 },
      { yPercent: 0, opacity: 1, duration: reduced ? 0.6 : 1.5, stagger: 0.11, ease: "expo.out", delay: 0.15 },
    );
    const cue = gsap.fromTo(
      stage.current.querySelector(".scroll-hint"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1, delay: 1.1 },
    );
    return () => {
      tw.progress(1).kill();
      cue.progress(1).kill();
    };
  }, [ready, lang]);

  const jump = (p: number) => {
    const sec = section.current;
    if (!sec) return;
    const top = sec.offsetTop + p * (sec.offsetHeight - window.innerHeight);
    scrollToTarget(top);
  };

  const poster = portrait ? VIDEO.posterPortrait : VIDEO.posterLandscape;

  return (
    <section ref={section} id="filme" className="film" aria-label={f.label}>
      <div ref={stage} className="film-stage" data-mode={mode} data-tone="light" data-top-tone="light">
        <div className="film-media" aria-hidden="true">
          {/* the frame zooms from the bottom while the drawing is on screen, so the
              table and ruler at the top edge stay out of view */}
          <div className="film-frame">
            <img className="film-poster" src={poster} alt="" {...{ fetchpriority: "high" }} />
            <video ref={video} className="film-video" muted playsInline preload="auto" disablePictureInPicture tabIndex={-1} />
            <canvas ref={canvas} className="film-canvas" />
          </div>
        </div>
        <p className="sr-only">{f.description}</p>

        {/* edge tints in the theme colour, one per text position, faded with its chapter */}
        <div className="tint tint--bl" aria-hidden="true" />
        <div className="tint tint--br" aria-hidden="true" />
        <div className="tint tint--sides" aria-hidden="true" />
        <div className="tint tint--bottom" aria-hidden="true" />
        <div className="tint tint--tl" aria-hidden="true" />
        <div className="film-dim" aria-hidden="true" />
        {/* permanent soft fades where the menu and the ruler sit */}
        <div className="edge edge--top" aria-hidden="true" />
        <div className="edge edge--right" aria-hidden="true" />

        {/* 01 Introdução */}
        <div className="chapter ch-intro">
          <h1 key={`intro-title-${lang}`} className="display ch-title">
            {f.intro.title.map((p) => (
              <span key={p} className="phrase">
                {p}
              </span>
            ))}
          </h1>
          <p key={`intro-support-${lang}`} className="ch-body intro-support">
            {f.intro.support}
          </p>
        </div>

        {/* 02 O começo */}
        <div className="chapter ch-inicio">
          <div className="inicio-inner">
            <h2 className="display ch-title">{f.inicio.title}</h2>
            <p key={`inicio-${lang}`} className="ch-body">
              {f.inicio.support}
            </p>
          </div>
        </div>

        {/* 03 A arte: the two halves of the line frame the ring */}
        <div className="chapter ch-arte">
          <h2 className="display ch-title" aria-label={f.arte.title}>
            <span className="arte-pos arte-pos--left" aria-hidden="true">
              <span className="arte-left">
                {f.arte.left[0]}
                <br />
                {f.arte.left[1]}
              </span>
            </span>
            <span className="arte-pos arte-pos--right" aria-hidden="true">
              <span className="arte-right">
                {f.arte.right[0]}
                <br />
                {f.arte.right[1]}
              </span>
            </span>
          </h2>
          <p key={`arte-${lang}`} className="ch-body arte-support">
            {f.arte.support}
          </p>
        </div>

        {/* 04 Precisão: one line is replaced by the next in the same slot */}
        <div className="chapter ch-precisao">
          <h2 className="display ch-title" aria-label={`${f.precisao.a} ${f.precisao.b}`}>
            <span className="prec-slot" aria-hidden="true">
              <span className="prec-a">{f.precisao.a}</span>
              <span className="prec-b">{f.precisao.b}</span>
            </span>
          </h2>
          <span className="cota" aria-hidden="true" />
          <p key={`prec-${lang}`} className="ch-body prec-support">
            {f.precisao.support}
          </p>
        </div>

        {/* 05 A joia */}
        <div className="chapter ch-joia">
          <h2 key={`joia-title-${lang}`} className="display ch-title">
            {f.joia.title.map((p) => (
              <span key={p} className="phrase">
                {p}
              </span>
            ))}
          </h2>
          <p key={`joia-support-${lang}`} className="ch-body">
            {f.joia.support}
          </p>
        </div>

        {/* 06 Assinatura: the logo is the signature */}
        <div className="chapter ch-assinatura">
          <h2 className="sig-name">
            <span className="sr-only">{f.signature.name}</span>
            <picture className="sig-logo" aria-hidden="true">
              <source media="(max-width: 767px)" srcSet="/brand/logo-mobile.svg" />
              <img src="/brand/logo.svg" alt="" width={326} height={84} />
            </picture>
          </h2>
          <div className="sig-bottom">
            <p className="sig-sub">{f.signature.sub}</p>
            <a className="btn btn--gold sig-cta" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              {f.signature.cta}
              <ArrowUpRight size={16} weight="regular" aria-hidden="true" />
            </a>
          </div>
        </div>

        <DraftRule ref={rule} onJump={jump} labels={f.rule} navLabel={f.chapters} />
        <div className="scroll-hint">
          <span className="scroll-hint__mouse" aria-hidden="true">
            <span className="scroll-hint__wheel" />
          </span>
          <span className="scroll-hint__label">{t.nav.scrollHint}</span>
        </div>
      </div>
    </section>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import { Nav } from "./components/Nav";
import { Loader } from "./components/Loader";
import { FloatingActions } from "./components/controls/FloatingActions";
import { CinematicFilm } from "./components/film/CinematicFilm";
import { ArtOfBGold } from "./components/sections/ArtOfBGold";
import { Creations } from "./components/sections/Creations";
import { GoldsmithTouch } from "./components/sections/GoldsmithTouch";
import { Contact } from "./components/sections/Contact";
import { Clients } from "./components/sections/Clients";
import { useI18n } from "./i18n/I18nProvider";
import { ScrollTrigger, initScroll, lockScroll } from "./lib/scroll";
import { initReveals } from "./lib/reveal";
import { useLayoutKey } from "./lib/layoutKey";

/** Never keep the visitor waiting on a slow connection: the poster carries the hero. */
const LOADER_TIMEOUT = 9000;

export default function App() {
  const { t, lang } = useI18n();
  const layoutKey = useLayoutKey();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const after = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    initScroll();
    lockScroll(true);
    const timer = window.setTimeout(() => setLoaded(true), LOADER_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, []);

  // Reveals are rebuilt when the language, the fonts or the width change,
  // so the split lines always match the text as it is laid out.
  useEffect(() => {
    if (!after.current) return;
    const cleanup = initReveals(after.current);
    ScrollTrigger.refresh();
    return cleanup;
  }, [lang, layoutKey]);

  const onExit = useCallback(() => {
    lockScroll(false);
    setReady(true);
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <a className="skip-link" href="#joalheria">
        {t.nav.skip}
      </a>
      <Loader progress={progress} done={loaded} onExit={onExit} />
      <Nav ready={ready} />
      <main>
        <CinematicFilm ready={ready} onLoadProgress={setProgress} onLoaded={() => setLoaded(true)} />
        <div ref={after}>
          <ArtOfBGold />
          <Creations />
          <GoldsmithTouch />
          <Clients />
          <Contact />
        </div>
      </main>
      <FloatingActions />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DICTS, LANGS, type Dict, type Lang } from "./strings";

interface I18n {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const Ctx = createContext<I18n | null>(null);
const KEY = "bgold:lang";

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY) as Lang | null;
    if (saved && saved in DICTS) return saved;
  } catch {
    /* storage unavailable */
  }
  const nav = (navigator.language || "pt").slice(0, 2).toLowerCase();
  return nav === "en" || nav === "es" ? nav : "pt";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    const meta = LANGS.find((l) => l.id === lang)!;
    const t = DICTS[lang];
    document.documentElement.lang = meta.html;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
  }, [lang]);

  const value = useMemo<I18n>(
    () => ({
      lang,
      t: DICTS[lang],
      setLang: (l) => {
        setLangState(l);
        try {
          localStorage.setItem(KEY, l);
        } catch {
          /* storage unavailable */
        }
      },
    }),
    [lang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n outside I18nProvider");
  return v;
}

/**
 * The film's single source of truth.
 *
 * Everything that happens inside the pinned cinematic section is expressed in
 * normalized scroll progress `p` (0 at the top of the film, 1 at its end).
 * The video time and every chapter transition are derived from `p`, so they
 * can never drift apart, and reversing the scroll reverses all of it.
 *
 * Video analysis (source: 6.04s, 24fps, 145 frames):
 *   0.00 – 1.05s  technical sketch of the ring on paper, slow push-in
 *   1.05 – 2.05s  the drawing turns into polished metal and diamonds
 *   2.05 – 3.00s  the ring lifts off the paper and turns, showing the pavé
 *   3.00 – 3.80s  a hand receives the ring, the room falls into shadow
 *   3.80 – 5.10s  the ring is slipped onto a finger
 *   5.10 – 6.04s  two hands rest together, warm bokeh
 */

export const VIDEO = {
  landscape: "/media/bgold-film-1080.mp4",
  portrait: "/media/bgold-film-portrait.mp4",
  posterLandscape: "/media/poster-landscape.jpg",
  posterPortrait: "/media/poster-portrait.jpg",
  /** fallback image sequence (12fps) if seeking proves unreliable */
  sequence: {
    landscape: (i: number) => `/media/seq-l/${String(i).padStart(3, "0")}.jpg`,
    portrait: (i: number) => `/media/seq-p/${String(i).padStart(3, "0")}.jpg`,
    count: 73,
  },
  fps: 24,
};

/** Scroll length of the pinned film, in viewport heights. */
export const FILM_LENGTH = { desktop: 800, mobile: 650 };

/**
 * Scroll progress -> video progress (both normalized 0..1).
 * Piecewise linear. Expressed as fractions of the duration so a re-encoded
 * clip with a slightly different length still lands on the same scenes.
 * Slower segments (more scroll per second of footage) give a scene room.
 */
export const SCROLL_TO_VIDEO: ReadonlyArray<readonly [number, number]> = [
  [0.0, 0.0],
  [0.1, 0.06], // hero: the sketch barely moves while the opening lines read
  [0.28, 0.175], // the sketch, push-in
  [0.48, 0.34], // drawing becomes metal
  [0.62, 0.5], // ring lifts and turns
  [0.68, 0.63], // hand receives it, darkness falls (no text)
  [0.86, 0.85], // ring slipped onto the finger
  [0.94, 0.995], // hands together
  [1.0, 0.995], // hold the last frame for the signature
];

export function videoProgressAt(p: number): number {
  const k = SCROLL_TO_VIDEO;
  if (p <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    const [p1, v1] = k[i];
    const [p0, v0] = k[i - 1];
    if (p <= p1) return v0 + ((p - p0) / (p1 - p0)) * (v1 - v0);
  }
  return k[k.length - 1][1];
}

/**
 * The overlays on the film follow the footage, not the site theme.
 * From darkFrom the frame is dark (the hand receives the ring), so fades turn
 * dark and text ivory. The top edge (behind the menu) darkens earlier, when
 * the camera pulls back and the wooden table fills the top of the frame.
 */
export const FILM_TONE = { darkFrom: 0.625, topDarkFrom: 0.49 };

export type ChapterId = "intro" | "inicio" | "arte" | "precisao" | "joia" | "assinatura";

export interface Chapter {
  id: ChapterId;
  /** scroll progress where the chapter's text begins to enter / is fully gone */
  start: number;
  end: number;
  /** progress where the chapter reads best (used by the rule's jump links) */
  focus: number;
}

export const CHAPTERS: Chapter[] = [
  { id: "intro", start: 0, end: 0.11, focus: 0 },
  { id: "inicio", start: 0.12, end: 0.29, focus: 0.2 },
  { id: "arte", start: 0.3, end: 0.49, focus: 0.41 },
  { id: "precisao", start: 0.5, end: 0.635, focus: 0.59 },
  { id: "joia", start: 0.7, end: 0.87, focus: 0.8 },
  { id: "assinatura", start: 0.87, end: 1, focus: 0.975 },
];

export const INSTAGRAM_URL = "https://www.instagram.com/bgold.joalheria/";

/** WhatsApp with a ready-made greeting. */
export const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=5519971316644&text=Ol%c3%a1!%f0%9f%91%8b%0A%0AEstava%20olhando%20o%20Instagram%20da%20BGold%20e%20gostei%20muito!%20Gostaria%20de%20um%20atendimento...";

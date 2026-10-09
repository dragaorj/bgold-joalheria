import type { Reel } from "../components/media/ReelPlayer";

const reel = (n: number, position: string): Reel => ({
  src: `/media/reels/reel-${n}.mp4`,
  poster: `/media/reels/reel-${n}.jpg`,
  position,
});

/**
 * BGold's own clips. `position` keeps the jewel in frame when the clip is
 * cropped to the figure's shape.
 */
export const REELS = {
  solitaireHand: reel(1, "52% 42%"),
  bandsBox: reel(2, "46% 58%"),
  earrings: reel(3, "47% 46%"),
  solitaireBlackBox: reel(4, "50% 52%"),
  diamondMacro: reel(5, "50% 50%"),
  threeSolitaires: reel(6, "50% 38%"),
  bracelet: reel(7, "50% 55%"),
  solitaireFinger: reel(8, "50% 56%"),
};

/** The workshop reel in "A beleza de uma joia", in the order of the thumbnails. */
export const ART_REELS: Reel[] = [
  REELS.solitaireHand,
  REELS.bandsBox,
  REELS.earrings,
  REELS.threeSolitaires,
  REELS.bracelet,
  REELS.solitaireFinger,
];


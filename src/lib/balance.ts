/**
 * Even line lengths for headlines and short texts, in every browser.
 *
 * Native `text-wrap: balance` stops applying once SplitText wraps the words,
 * so before splitting we narrow the element to the smallest width that keeps
 * the same number of lines (binary search). The lines that result are evenly
 * distributed, and SplitText then measures exactly those lines.
 * Returns an undo function that restores the element's natural width.
 */
export function balanceText(el: HTMLElement): { revert: () => void } {
  el.style.maxWidth = "";
  const box = el.getBoundingClientRect();
  const width = box.width;
  const height = box.height;
  if (!width || !height) return { revert: () => {} };

  // A width is too narrow if it adds a line, or if a word that cannot wrap
  // (a long single word) would overflow it and get clipped by the line mask.
  const tooNarrow = () => el.getBoundingClientRect().height > height + 1 || el.scrollWidth > el.clientWidth + 1;

  let lo = width * 0.35;
  let hi = width;
  for (let i = 0; i < 12 && hi - lo > 1.5; i++) {
    const mid = (lo + hi) / 2;
    el.style.maxWidth = `${mid}px`;
    if (tooNarrow()) lo = mid;
    else hi = mid;
  }
  el.style.maxWidth = `${Math.ceil(hi) + 1}px`;
  return { revert: () => (el.style.maxWidth = "") };
}

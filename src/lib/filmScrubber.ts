/**
 * FilmScrubber: maps a normalized progress value onto a video frame.
 *
 * - The clip is fetched in full and played from a blob URL, so a seek never
 *   waits on a network range request.
 * - Seeks are serialized: a new `currentTime` is only written once the
 *   previous seek has settled. The latest target always wins, so fast scrolls
 *   skip intermediate frames instead of queueing them (no lag, no backlog).
 * - Targets are snapped to frame centres, which makes reverse scrubbing land on
 *   exactly the same frames as forward scrubbing.
 * - If the browser cannot seek reliably (some low-power phones, data saver),
 *   it falls back to a 12fps JPEG sequence drawn on a canvas, which looks the
 *   same and is driven by the same progress value.
 */

export type ScrubMode = "loading" | "video" | "sequence";

interface SequenceSpec {
  url: (i: number) => string;
  count: number;
}

interface LoadOptions {
  src: string;
  sequence: SequenceSpec;
  fps: number;
  onProgress?: (ratio: number) => void;
  signal?: AbortSignal;
}

const SEEK_TEST_TIMEOUT = 2500;

export class FilmScrubber {
  mode: ScrubMode = "loading";
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private objectUrl: string | null = null;
  private fps = 24;
  private frames = 1;
  private duration = 0;
  private targetProgress = 0;
  private requestedFrame = -1;
  private raf = 0;
  private running = false;
  private seq: SequenceSpec | null = null;
  private images: HTMLImageElement[] = [];
  private drawnIndex = -1;
  private onReady: (() => void) | null = null;

  constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.video = video;
    this.canvas = canvas;
  }

  /** Normalized 0..1 video progress. Cheap: just stores the target. */
  setProgress(v: number) {
    this.targetProgress = Math.min(1, Math.max(0, v));
    if (!this.running) this.tick();
  }

  whenReady(cb: () => void) {
    this.onReady = cb;
  }

  async load({ src, sequence, fps, onProgress, signal }: LoadOptions) {
    this.fps = fps;
    this.seq = sequence;
    const v = this.video;
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";

    try {
      const blob = await fetchWithProgress(src, onProgress, signal);
      if (signal?.aborted) return;
      this.objectUrl = URL.createObjectURL(blob);
      v.src = this.objectUrl;
    } catch (err) {
      if (signal?.aborted) return;
      // Network fetch failed (e.g. blocked): let the element stream it directly.
      v.src = src;
      onProgress?.(1);
    }

    try {
      await once(v, "loadedmetadata", 8000);
      this.duration = v.duration;
      this.frames = Math.max(1, Math.round(this.duration * fps));
      const ok = await this.seekTest();
      if (signal?.aborted) return;
      if (ok) {
        this.mode = "video";
      } else {
        await this.enterSequenceMode();
      }
    } catch {
      if (signal?.aborted) return;
      await this.enterSequenceMode();
    }
    this.requestedFrame = -1;
    this.drawnIndex = -1;
    this.start();
    this.onReady?.();
  }

  /** iOS needs one user-gesture play() before it will paint seeked frames. */
  prime() {
    if (this.mode !== "video") return;
    const v = this.video;
    const p = v.play();
    if (p) p.then(() => v.pause()).catch(() => {});
  }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.tick();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    this.video.removeAttribute("src");
    this.video.load();
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.images = [];
  }

  /** Re-fit the canvas after a resize (sequence mode only). */
  resize() {
    if (this.mode !== "sequence") return;
    this.fitCanvas();
    this.drawnIndex = -1;
    this.tick();
  }

  private tick() {
    if (this.mode === "video") {
      const v = this.video;
      if (v.seeking || v.readyState < 1) return;
      const frame = Math.min(this.frames - 1, Math.round(this.targetProgress * (this.frames - 1)));
      if (frame === this.requestedFrame) return;
      this.requestedFrame = frame;
      // frame centre, clamped inside the clip
      const t = Math.min(this.duration - 0.001, (frame + 0.5) / this.fps);
      v.currentTime = t;
    } else if (this.mode === "sequence" && this.seq) {
      const idx = Math.round(this.targetProgress * (this.seq.count - 1));
      if (idx === this.drawnIndex) return;
      const img = this.nearestLoaded(idx);
      if (!img) return;
      this.draw(img);
      if (img === this.images[idx]) this.drawnIndex = idx;
    }
  }

  private async seekTest(): Promise<boolean> {
    const v = this.video;
    try {
      v.currentTime = Math.min(this.duration * 0.5, this.duration - 0.05);
      await once(v, "seeked", SEEK_TEST_TIMEOUT);
      v.currentTime = 0.5 / this.fps;
      await once(v, "seeked", SEEK_TEST_TIMEOUT);
      return true;
    } catch {
      return false;
    }
  }

  private async enterSequenceMode() {
    if (!this.seq) return;
    this.mode = "sequence";
    this.ctx = this.canvas.getContext("2d");
    this.fitCanvas();
    const { url, count } = this.seq;
    this.images = Array.from({ length: count }, (_, i) => {
      const img = new Image();
      img.decoding = "async";
      img.src = url(i + 1);
      return img;
    });
    // wait for the first frame only; the rest stream in
    await this.images[0].decode().catch(() => {});
  }

  private nearestLoaded(idx: number): HTMLImageElement | null {
    for (let d = 0; d < this.images.length; d++) {
      const a = this.images[idx - d];
      if (a && a.complete && a.naturalWidth) return a;
      const b = this.images[idx + d];
      if (b && b.complete && b.naturalWidth) return b;
    }
    return null;
  }

  private fitCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.round(r.width * dpr);
    this.canvas.height = Math.round(r.height * dpr);
  }

  private draw(img: HTMLImageElement) {
    const ctx = this.ctx;
    if (!ctx) return;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }
}

function once(el: EventTarget, type: string, timeout: number) {
  return new Promise<void>((resolve, reject) => {
    const t = window.setTimeout(() => {
      el.removeEventListener(type, ok);
      reject(new Error(`${type} timeout`));
    }, timeout);
    function ok() {
      window.clearTimeout(t);
      el.removeEventListener(type, ok);
      resolve();
    }
    el.addEventListener(type, ok);
  });
}

async function fetchWithProgress(
  url: string,
  onProgress?: (r: number) => void,
  signal?: AbortSignal,
): Promise<Blob> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const total = Number(res.headers.get("content-length")) || 0;
  if (!res.body || !total) {
    const b = await res.blob();
    onProgress?.(1);
    return b;
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    onProgress?.(Math.min(1, loaded / total));
  }
  return new Blob(chunks as BlobPart[], { type: "video/mp4" });
}

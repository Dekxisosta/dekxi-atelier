/**
 * Voice-line cache. Each clip is downloaded once, kept as a blob object URL in
 * memory (instant replays, no re-request) and mirrored into the Cache Storage
 * API so it survives page reloads. If the host blocks CORS the clip can't be
 * read as a blob, so we fall back to a preloaded <audio> element and let the
 * browser's HTTP cache do the work.
 */

const CACHE_NAME = "voice-cache-v1";

const objectUrls = new Map<string, string>();
const pending = new Map<string, Promise<string | null>>();
const fallbackElements = new Map<string, HTMLAudioElement>();

/** Cached object URL for `url`, or null when it hasn't been cached (yet). */
export function peekCachedAudio(url: string): string | null {
  return objectUrls.get(url) ?? null;
}

async function load(url: string): Promise<string | null> {
  try {
    const store = "caches" in window ? await window.caches.open(CACHE_NAME) : null;

    let res = store ? await store.match(url) : undefined;
    if (!res) {
      res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // keep a copy for next visit; ignore quota / unsupported errors
      store?.put(url, res.clone()).catch(() => {});
    }

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    objectUrls.set(url, objectUrl);
    return objectUrl;
  } catch {
    // CORS-blocked or offline: warm the HTTP cache with a preloaded element instead
    if (!fallbackElements.has(url)) {
      const el = new Audio();
      el.preload = "auto";
      el.src = url;
      fallbackElements.set(url, el);
    }
    return null;
  }
}

/** Download + cache one clip. Safe to call repeatedly. */
export function cacheAudio(url: string): Promise<string | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const hit = objectUrls.get(url);
  if (hit) return Promise.resolve(hit);
  let job = pending.get(url);
  if (!job) {
    job = load(url).finally(() => pending.delete(url));
    pending.set(url, job);
  }
  return job;
}

/** Cache a list of clips one after another so the page isn't flooded with requests. */
export async function preloadAudio(urls: readonly string[]): Promise<void> {
  for (const url of new Set(urls)) await cacheAudio(url);
}

/** localStorage key for the voice on/off preference – one global switch shared by every character. */
export const VOICE_SOUND_KEY = "voice-sound";

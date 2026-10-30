"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { JAVELIN } from "@entities/profile";
import { cacheAudio, peekCachedAudio, preloadAudio } from "@shared/utils/audio-cache";
import SocialLinks from "./SocialLinks";

type Kind = "touch" | "special" | "headpat";
type Fx = { id: number; kind: Kind; glyph: string; x: number; y: number; dx: number };

type Line = { readonly text: string; readonly audio: string };

const VOICE_VOLUME = 0.8;
const TYPE_SPEED_MS = 28;
const IDLE_DELAY_MS = 8000;

type Box = { readonly top: string; readonly left: string; readonly width: string; readonly height: string };
type Hotspots = { readonly head: Box; readonly special: Box };

/** Any Azur Lane secretary: art, backdrop and the four voiceline groups. */
type StageCharacter = {
  readonly name: string;
  readonly image: string;
  readonly background: string;
  readonly lines: {
    readonly idle: readonly Line[];
    readonly touch: readonly Line[];
    readonly specialTouch: readonly Line[];
    readonly headpat: readonly Line[];
  };
};

/**
 * Optional "fit" mode. The art is laid out in a frame that has the artwork's own
 * aspect ratio and covers the stage, so hotspots given as % are % of the *image* and
 * stay on the right spot at any stage size. `x` is the horizontal anchor (0 = left, 1 = right).
 */
type Frame = { readonly aspect: number; readonly x?: number };

export type JavelinStageProps = {
  character?: StageCharacter;
  hotspots?: Hotspots;
  soundKey?: string;
  frame?: Frame;
};

/**
 * Clickable regions, as % of the stage (or of the image when a `frame` is used). They are
 * tuned to the current artwork + `object-fit: cover` crop – nudge them if the art changes.
 */
const HOTSPOTS: Hotspots = {
  head:    { top: "6%",  left: "45%", width: "42%", height: "30%" },
  special: { top: "55%", left: "26%", width: "38%", height: "26%" },
};

const GLYPHS: Record<Kind, string[]> = {
  touch:   ["✦"],
  special: ["!"],
  headpat: ["♥", "♥", "✦"],
};

/** Body animations, played with the Web Animations API on top of the idle float. */
const REACTIONS: Record<Kind, { keyframes: Keyframe[]; options: KeyframeAnimationOptions }> = {
  // hop with a little squash & stretch
  touch: {
    keyframes: [
      { transform: "translateY(0) scale(1, 1)" },
      { transform: "translateY(0) scale(1.03, 0.94)", offset: 0.2 },
      { transform: "translateY(-14px) scale(0.98, 1.04)", offset: 0.5 },
      { transform: "translateY(0) scale(1.02, 0.96)", offset: 0.8 },
      { transform: "translateY(0) scale(1, 1)" },
    ],
    options: { duration: 480, easing: "ease-out" },
  },
  // flustered shake
  special: {
    keyframes: [
      { transform: "translateX(0) rotate(0deg)" },
      { transform: "translateX(-8px) rotate(-1.6deg)", offset: 0.15 },
      { transform: "translateX(7px) rotate(1.4deg)", offset: 0.35 },
      { transform: "translateX(-5px) rotate(-1deg)", offset: 0.55 },
      { transform: "translateX(3px) rotate(0.6deg)", offset: 0.75 },
      { transform: "translateX(0) rotate(0deg)" },
    ],
    options: { duration: 520, easing: "ease-in-out" },
  },
  // happy nuzzle: leans into the pat twice
  headpat: {
    keyframes: [
      { transform: "translateY(0) rotate(0deg) scale(1, 1)" },
      { transform: "translateY(5px) rotate(-1.6deg) scale(1.01, 0.975)", offset: 0.5 },
      { transform: "translateY(0) rotate(0deg) scale(1, 1)" },
    ],
    options: { duration: 620, easing: "ease-in-out", iterations: 2 },
  },
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pick = (lines: readonly Line[]) => lines[Math.floor(Math.random() * lines.length)];

export default function JavelinStage({
  character = JAVELIN,
  hotspots = HOTSPOTS,
  soundKey = "javelin-sound",
  frame,
}: JavelinStageProps = {}) {
  const lines = character.lines;
  const LINES: Record<Kind, readonly Line[]> = {
    touch: lines.touch,
    special: lines.specialTouch,
    headpat: lines.headpat,
  };
  /** Every voice clip the stage can play. */
  const ALL_VOICE_URLS = useMemo<readonly string[]>(
    () => [...lines.idle, ...lines.touch, ...lines.specialTouch, ...lines.headpat].map((l) => l.audio),
    [lines]
  );

  const [speech, setSpeech] = useState<{ id: number; text: string; audio: string }>({
    id: 0,
    ...lines.idle[0],
  });
  const [typed, setTyped] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [fx, setFx] = useState<Fx[]>([]);

  const stageRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLImageElement>(null);
  const flushRef = useRef<HTMLDivElement>(null);
  const speechId = useRef(0);
  const fxId = useRef(0);
  const idleIdx = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundRef = useRef(false);

  const line = speech.text;
  const done = typed >= line.length;

  const stopVoice = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
  }, []);

  const playVoice = useCallback(
    (src: string) => {
      stopVoice();
      if (!soundRef.current) return;
      // cached clips replay instantly from memory; otherwise play the remote file and cache it for next time
      const cached = peekCachedAudio(src);
      if (!cached) void cacheAudio(src);
      const audio = new Audio(cached ?? src);
      audio.volume = VOICE_VOLUME;
      audioRef.current = audio;
      // browsers block audio until the visitor has interacted – ignore that quietly
      audio.play().catch(() => {});
    },
    [stopVoice]
  );

  const say = useCallback(
    (entry: Line) => {
      speechId.current += 1;
      setSpeech({ id: speechId.current, text: entry.text, audio: entry.audio });
      playVoice(entry.audio);
    },
    [playVoice]
  );

  // remember the sound preference; stop any voice when leaving
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(soundKey) === "1";
      soundRef.current = saved;
      setSoundOn(saved);
    } catch {
      /* storage unavailable – stay muted */
    }
    // The stage remounts when the theme changes, so voice the opening line here
    // (playVoice is a no-op while muted; on a fresh page load the browser blocks it quietly).
    playVoice(lines.idle[0].audio);
    return stopVoice;
  }, [playVoice, stopVoice, soundKey, lines]);

  // once voice is on, quietly download + cache every clip (when the browser is idle)
  useEffect(() => {
    if (!soundOn) return;
    const run = () => void preloadAudio(ALL_VOICE_URLS);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(run, 1500);
    return () => window.clearTimeout(id);
  }, [soundOn, ALL_VOICE_URLS]);

  const toggleSound = () => {
    const next = !soundOn;
    soundRef.current = next;
    setSoundOn(next);
    try {
      window.localStorage.setItem(soundKey, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (next) playVoice(speech.audio); // turning on is a click, so it may play right away
    else stopVoice();
  };

  // typewriter
  useEffect(() => {
    setTyped(0);
    if (prefersReducedMotion()) {
      setTyped(line.length);
      return;
    }
    const id = window.setInterval(() => {
      setTyped((n) => {
        if (n >= line.length) {
          window.clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, TYPE_SPEED_MS);
    return () => window.clearInterval(id);
  }, [speech.id, line.length]);

  const nextLine = useCallback(() => {
    idleIdx.current = (idleIdx.current + 1) % lines.idle.length;
    say(lines.idle[idleIdx.current]);
  }, [say, lines]);

  // idle chatter: move on to the next idle line after a pause
  useEffect(() => {
    if (!done || prefersReducedMotion()) return;
    const t = window.setTimeout(nextLine, IDLE_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [done, speech.id, nextLine]);

  const react = (kind: Kind, e: MouseEvent<HTMLElement>) => {
    say(pick(LINES[kind]));
    if (prefersReducedMotion()) return;

    const { keyframes, options } = REACTIONS[kind];
    artRef.current?.animate(keyframes, options);

    if (kind === "special") {
      flushRef.current?.animate(
        [{ opacity: 0 }, { opacity: 1, offset: 0.25 }, { opacity: 0 }],
        { duration: 700, easing: "ease-out" }
      );
    }

    // sparkles / hearts where she was touched (centre of the hotspot for keyboard use)
    const stage = stageRef.current?.getBoundingClientRect();
    if (!stage) return;
    const target = e.currentTarget.getBoundingClientRect();
    const fromKeyboard = e.clientX === 0 && e.clientY === 0;
    const baseX = (fromKeyboard ? target.left + target.width / 2 : e.clientX) - stage.left;
    const baseY = (fromKeyboard ? target.top + target.height / 2 : e.clientY) - stage.top;

    const spawned: Fx[] = GLYPHS[kind].map((glyph, i) => ({
      id: ++fxId.current,
      kind,
      glyph,
      x: baseX + (i - (GLYPHS[kind].length - 1) / 2) * 22,
      y: baseY - 8,
      dx: (Math.random() - 0.5) * 36,
    }));
    setFx((list) => [...list, ...spawned]);
  };

  const dropFx = (id: number) => setFx((list) => list.filter((f) => f.id !== id));

  const talk = (
    <button
      type="button"
      className="javelin-talk"
      onClick={(e) => react("touch", e)}
      aria-label={`Touch ${character.name}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={artRef} className="javelin-art" src={character.image} alt={character.name} draggable={false} />
    </button>
  );

  const headSpot = (
    <button
      type="button"
      className="javelin-hot javelin-hot--head"
      style={hotspots.head}
      onClick={(e) => react("headpat", e)}
      aria-label={`Pat ${character.name}'s head`}
    />
  );

  const specialSpot = (
    <button
      type="button"
      className="javelin-hot javelin-hot--special"
      style={hotspots.special}
      onClick={(e) => react("special", e)}
      aria-label={`Poke ${character.name}`}
    />
  );

  return (
    <div className="javelin">
      <div className={"javelin-stage" + (frame ? " javelin-stage--fit" : "")} ref={stageRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="javelin-bg" src={character.background} alt="" aria-hidden="true" draggable={false} />

        {frame ? (
          <div
            className="javelin-frame"
            style={{ ["--frame-aspect" as string]: frame.aspect, ["--frame-x" as string]: frame.x ?? 0.5 }}
          >
            {talk}
            {headSpot}
            {specialSpot}
          </div>
        ) : (
          <>
            {talk}
            {headSpot}
            {specialSpot}
          </>
        )}

        <div className="javelin-flush" ref={flushRef} aria-hidden="true" />

        {fx.map((f) => (
          <span
            key={f.id}
            className={`javelin-fx javelin-fx--${f.kind}`}
            style={{ left: f.x, top: f.y, ["--dx" as string]: `${f.dx}px` }}
            onAnimationEnd={() => dropFx(f.id)}
            aria-hidden="true"
          >
            {f.glyph}
          </span>
        ))}

        <SocialLinks variant="overlay" />

        <button
          type="button"
          className={"javelin-sound" + (soundOn ? " is-on" : "")}
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? `Mute ${character.name}'s voice` : `Unmute ${character.name}'s voice`}
          title={soundOn ? "Voice on" : "Voice off"}
        >
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <div
          className="javelin-dialogue javelin-dialogue--tap"
          role="button"
          tabIndex={0}
          aria-live="polite"
          aria-label="Next line"
          onClick={nextLine}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              nextLine();
            }
          }}
        >
          <span className="javelin-nametag">{character.name}</span>
          <p className="javelin-text">
            {line.slice(0, typed)}
            {done && <span className="javelin-caret" aria-hidden="true">▼</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { ISHMAEL, type CharacterLine } from "@entities/profile";
import { cacheAudio, peekCachedAudio, preloadAudio, VOICE_SOUND_KEY } from "@shared/utils/audio-cache";
import SocialLinks from "./SocialLinks";

const VOICE_VOLUME = 0.8;
const TYPE_SPEED_MS = 28;
const IDLE_DELAY_MS = 9000;

/** Any idle-only Limbus character: art, backdrop, an intro line and a rotating chatter list. */
export type LimbusCharacter = {
  readonly name: string;
  readonly image: string;
  readonly background: string;
  readonly lines: {
    readonly intro: CharacterLine;
    readonly idle: readonly CharacterLine[];
  };
};

export type IshmaelStageProps = {
  character?: LimbusCharacter;
  soundKey?: string;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Idle-only home-screen panel for the Limbus theme (no touch / hotspots). Defaults to Ishmael. */
export default function IshmaelStage({
  character = ISHMAEL,
  soundKey = VOICE_SOUND_KEY,
}: IshmaelStageProps = {}) {
  const lines = character.lines;
  const ALL_VOICE_URLS = useMemo<readonly string[]>(
    () => [lines.intro, ...lines.idle].flatMap((l) => (l.audio ? [l.audio] : [])),
    [lines]
  );
  const [speech, setSpeech] = useState<{ id: number } & CharacterLine>({
    id: 0,
    ...lines.intro,
  });
  const [typed, setTyped] = useState(0);
  const [soundOn, setSoundOn] = useState(false);

  const speechId = useRef(0);
  const idleIdx = useRef(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundRef = useRef(false);

  const line = speech.text;
  const done = typed >= line.length;

  const stopVoice = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
  }, []);

  const playVoice = useCallback(
    (src?: string) => {
      stopVoice();
      if (!src || !soundRef.current) return;
      const cached = peekCachedAudio(src);
      if (!cached) void cacheAudio(src);
      const audio = new Audio(cached ?? src);
      audio.volume = VOICE_VOLUME;
      audioRef.current = audio;
      audio.play().catch(() => {});
    },
    [stopVoice]
  );

  const say = useCallback(
    (entry: CharacterLine) => {
      speechId.current += 1;
      setSpeech({ id: speechId.current, text: entry.text, audio: entry.audio });
      playVoice(entry.audio);
    },
    [playVoice]
  );

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
    playVoice(lines.intro.audio);
    return stopVoice;
  }, [playVoice, stopVoice, soundKey, lines]);

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
    if (next) playVoice(speech.audio);
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

  // idle chatter: next line after a pause
  useEffect(() => {
    if (!done || prefersReducedMotion()) return;
    const t = window.setTimeout(nextLine, IDLE_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [done, speech.id, nextLine]);

  return (
    <div className="javelin javelin--ishmael">
      <div className="javelin-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="javelin-bg" src={character.background} alt="" aria-hidden="true" draggable={false} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="javelin-art" src={character.image} alt={character.name} draggable={false} />

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

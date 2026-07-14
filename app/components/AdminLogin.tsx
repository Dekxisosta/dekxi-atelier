"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "../admin/admin.css";

const VISUAL_GIF_URL = "https://media.tenor.com/RRvDd69pL94AAAAM/reverse-1999-vertin.gif";
const ROUND_2_IMAGE_URL =
  "https://preview.redd.it/show-me-your-best-don-quixote-memes-v0-kje2xcqs87rd1.jpeg?width=640&format=pjpg&auto=webp&s=03a987fc86e2c9f967789568d8084a9ec31da6db";

const GATE_SIZE = 6;
const GATE_TIME_LIMIT_MS = 9000; // full gauge capacity, shared across both rounds
const GATE_TICK_MS = 100;
const GATE_STEP_ROUND_1 = GATE_TICK_MS; // slow drain
const GATE_STEP_ROUND_2 = GATE_TICK_MS * 1.5; // same clock, 3x faster drain

function shuffledSequence() {
  const nums = Array.from({ length: GATE_SIZE }, (_, i) => i + 1);
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
}

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hasInput = email.length > 0 || password.length > 0;

  // ── Gate state ──
  const [gatePassed, setGatePassed] = useState(false);
  const [gateRound, setGateRound] = useState<1 | 2>(1);
  const [timerStarted, setTimerStarted] = useState(false); // stays false until tile "1" is tapped
  const [tiles, setTiles] = useState<number[]>(
    Array.from({ length: GATE_SIZE }, (_, i) => i + 1) // deterministic, matches server render
  );
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GATE_TIME_LIMIT_MS);
  const [shake, setShake] = useState(false);

  // How much time was left the instant round 2 began — used to compute the
  // "halfway through round 2" reshuffle trigger below.
  const [round2Shuffled, setRound2Shuffled] = useState(false);

  // Refs mirror latest state so the one long-lived interval always reads
  // current values without needing to be recreated on every change.
  const gateRoundRef = useRef(gateRound);
  const timerStartedRef = useRef(timerStarted);
  const gatePassedRef = useRef(gatePassed);
  useEffect(() => {
    gateRoundRef.current = gateRound;
  }, [gateRound]);
  useEffect(() => {
    timerStartedRef.current = timerStarted;
  }, [timerStarted]);
  useEffect(() => {
    gatePassedRef.current = gatePassed;
  }, [gatePassed]);

  // Shuffle client-side only, so there's no server/client hydration mismatch.
  useEffect(() => {
    setTiles(shuffledSequence());
  }, []);

  const visualSrc = gateRound === 2 && !gatePassed ? ROUND_2_IMAGE_URL : VISUAL_GIF_URL;

    function reshuffleRemaining(tiles: number[], progress: number) {
    const result = [...tiles];
    const openIndices: number[] = [];
    const openValues: number[] = [];

    tiles.forEach((val, idx) => {
        if (val > progress) {
        openIndices.push(idx);
        openValues.push(val);
        }
    });

    for (let i = openValues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [openValues[i], openValues[j]] = [openValues[j], openValues[i]];
    }

    openIndices.forEach((idx, i) => {
        result[idx] = openValues[i];
    });

    return result;
    }
  // Any miss, at any round, sends the whole thing back to round 1 and
  // freezes the timer until tile "1" is tapped again.
  function fullReset() {
    setShake(true);
    setTimeout(() => setShake(false), 400);
    setGateRound(1);
    setTimerStarted(false);
    setTimeLeft(GATE_TIME_LIMIT_MS);
    setProgress(0);
    setTiles(shuffledSequence());
    setRound2Shuffled(false);
  }

  function handleTileClick(num: number) {
    if (gatePassed) return;

    if (num !== progress + 1) {
      fullReset();
      return;
    }

    // The very first correct tap (always tile "1") kicks off the shared timer.
    if (!timerStarted && progress === 0) {
      setTimerStarted(true);
    }

    const nextProgress = progress + 1;
    setProgress(nextProgress);

    if (nextProgress === GATE_SIZE) {
      if (gateRound === 1) {
        // Clear round 1 -> silently advance to round 2. Timer keeps
        // draining from wherever it currently is — no refill.
        setGateRound(2);
        setProgress(0);
        setTiles(shuffledSequence());
        setRound2Shuffled(false);
      } else {
        setGatePassed(true);
      }
    }
  }

  // ── The single shared timer. Created once, never torn down between
  // rounds. Sits idle until timerStarted flips true, then drains at a rate
  // that depends on the current round, read fresh off the refs each tick.
  useEffect(() => {
    const id = setInterval(() => {
      if (gatePassedRef.current) return;
      if (!timerStartedRef.current) return;

      const step = gateRoundRef.current === 1 ? GATE_STEP_ROUND_1 : GATE_STEP_ROUND_2;

      setTimeLeft((prev) => {
        const next = prev - step;
        if (next <= 0) {
          fullReset();
          return GATE_TIME_LIMIT_MS;
        }
        return next;
      });
    }, GATE_TICK_MS);

    return () => clearInterval(id);
  }, []);

  // Once round 2 has drained past the halfway point of whatever time it
  // started with, reshuffle the grid once. Progress is tracked by tile
  // value, not position, so this doesn't disturb which tiles are "done".
  useEffect(() => {
    if (gateRound !== 2 || gatePassed) return;
    if (round2Shuffled) return;

    if (timeLeft <= GATE_TIME_LIMIT_MS / 2) {
        setTiles((prev) => reshuffleRemaining(prev, progress));
        setRound2Shuffled(true);
    }
    }, [timeLeft, gateRound, gatePassed, round2Shuffled, progress]);

  // Snapshot the first frame of whatever image is currently showing onto the
  // canvas, so the canvas can sit on top and look "frozen" while the real
  // gif keeps animating underneath, unseen, until we fade the canvas out.
  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    function drawFrame() {
      const ctx = canvas!.getContext("2d");
      if (!ctx || !img!.naturalWidth) return;
      canvas!.width = img!.naturalWidth;
      canvas!.height = img!.naturalHeight;
      ctx.drawImage(img!, 0, 0);
    }

    if (img.complete && img.naturalWidth) {
      drawFrame();
    } else {
      img.addEventListener("load", drawFrame, { once: true });
    }

    return () => img.removeEventListener("load", drawFrame);
  }, [visualSrc]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }
    

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-visual">
          <div className="auth-visual-media">
            <img
                ref={imgRef}
                src={visualSrc}
                alt=""
                className="auth-visual-gif"
                style={{ opacity: gatePassed && hasInput ? 1 : 0 }}
                />
                <canvas
                ref={canvasRef}
                className="auth-visual-canvas"
                style={{ opacity: gatePassed && hasInput ? 0 : 1 }}
                />
          </div>
          <span className="auth-visual-tag">VERTIN.SYS</span>
        </div>

        <div className={`auth-form-panel${shake ? " auth-gate-shake" : ""}`}>
          <div className="auth-eyebrow">
            <span className="auth-eyebrow-label">L-CORP // Admin Access</span>
            <div className="auth-eyebrow-line" />
          </div>

          <h1 className="auth-title">Secure terminal</h1>

          {!gatePassed ? (
            <div className="auth-gate">
              <p className="auth-status-line">handshake required</p>
              <p className="auth-gate-instructions">
                Tap the tiles in order, 1 through {GATE_SIZE}.
              </p>

              <div className="auth-gate-timer-track">
                <div
                  className="auth-gate-timer-fill"
                  style={{
                    width: `${(timeLeft / GATE_TIME_LIMIT_MS) * 100}%`,
                    background: timeLeft < 900 ? "#e0605a" : undefined,
                  }}
                />
              </div>

              <div className="auth-gate-grid">
                {tiles.map((num) => {
                  const done = num <= progress;
                  return (
                    <button
                      key={num}
                      type="button"
                      className={`auth-gate-btn${done ? " auth-gate-btn-done" : ""}`}
                      onClick={() => handleTileClick(num)}
                      disabled={done}
                      aria-label={`Tile ${num}`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="auth-form-fade">
              <p className="auth-status-line">
                {submitting ? "verifying credentials" : hasInput ? "reading input" : "awaiting credentials"}
              </p>

              {error && <p className="auth-error">{error}</p>}

              <form onSubmit={handleSubmit}>
                <div className="auth-field">
                  <label className="auth-field-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="auth-input"
                    type="email"
                    id="email"
                    required
                    autoComplete="username"
                    placeholder="you@dekxi.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-field-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="auth-input"
                    type="password"
                    id="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button className="auth-submit" type="submit" disabled={submitting}>
                  {submitting ? "Authenticating..." : "Sign in"}
                </button>
              </form>

              <div className="auth-footer">
                <span className="auth-footer-chip">
                  <span className="auth-footer-dot" style={{ background: "#7bbf6a" }} />
                  Connection secure
                </span>
                <span className="auth-footer-chip">
                  <span className="auth-footer-dot" style={{ background: "#e0b95a" }} />
                  Session encrypted
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
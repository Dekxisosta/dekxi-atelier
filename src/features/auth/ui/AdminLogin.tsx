"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@shared/supabase/client";

const VISUAL_IMAGE_URL = "https://media.tenor.com/RRvDd69pL94AAAAM/reverse-1999-vertin.gif";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setSubmitting(false);
      return;
    }

    router.push("/?tab=dashboard");
    router.refresh();
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={VISUAL_IMAGE_URL} alt="" className="auth-visual-media" />
          <span className="auth-visual-tag">VERTIN.SYS</span>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Sign in</h2>
            <p className="auth-form-subtitle">Admin access only.</p>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
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
              {submitting ? "Authenticating…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

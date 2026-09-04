"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup" | "forgot";
const api = process.env.NEXT_PUBLIC_API_URL || "/backend-api";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get("auth_error");
    if (!authError) return;
    const timer = window.setTimeout(() => setError(authError), 0);
    window.history.replaceState({}, "", window.location.pathname);
    return () => window.clearTimeout(timer);
  }, []);
  const copy = {
    login: ["Welcome back", "Log in to continue building momentum."],
    signup: [
      "Create your account",
      "Your smarter growth workspace starts here.",
    ],
    forgot: [
      "Reset your password",
      "Enter your email and we’ll send the next steps.",
    ],
  }[mode];
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(
        `${api}/api/auth/${mode === "signup" ? "register" : mode === "forgot" ? "forgot-password" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Something went wrong.");
      if (mode === "forgot") {
        setMessage(result.message);
        event.currentTarget.reset();
      } else {
        router.push("/dashboard");
      }
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to connect to the server.",
      );
    } finally {
      setLoading(false);
    }
  }
  function continueWithGoogle() {
    setError("");
    const oauthApi = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088";
    window.open(`${oauthApi}/api/auth/google?mode=${mode}`, "_self");
  }
  return (
    <div className="auth-box">
      <h1>{copy[0]}</h1>
      <p className="auth-subtitle">{copy[1]}</p>
      {error && <div className="form-message form-error">{error}</div>}
      {message && <div className="form-message form-success">{message}</div>}
      <form onSubmit={submit}>
        {mode === "signup" && (
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              required
              minLength={2}
              autoComplete="name"
              placeholder="Alex Morgan"
            />
          </div>
        )}
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            required
            type="email"
            autoComplete="email"
            placeholder="alex@example.com"
          />
        </div>
        {mode !== "forgot" && (
          <div className="field">
            <div className="field-label-row">
              <label htmlFor="password">Password</label>
              {mode === "login" && (
                <Link className="forgot-link" href="/forgot-password">
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="password-wrap">
              <input
                id="password"
                name="password"
                required
                minLength={8}
                type={show ? "text" : "password"}
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                placeholder="At least 8 characters"
              />
              <button type="button" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        )}
        {mode === "signup" && (
          <label className="check-row">
            <input type="checkbox" name="legal_acceptance" required />
            <span>I agree to the <Link href="/terms" target="_blank">Terms of Service</Link> and <Link href="/privacy" target="_blank">Privacy Policy</Link>.</span>
          </label>
        )}
        <button className="button" disabled={loading} type="submit">
          {loading
            ? "Please wait..."
            : mode === "login"
              ? "Log in →"
              : mode === "signup"
                ? "Create account →"
                : "Send reset link →"}
        </button>
      </form>
      {mode !== "forgot" && (
        <>
          <div className="social-divider">or continue with</div>
          <div className="social-buttons social-buttons-google">
            <button
              type="button"
              onClick={continueWithGoogle}
            >
              <svg className="google-mark" aria-hidden="true" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.482h4.844a4.14 4.14 0 0 1-1.797 2.715v2.258h2.909c1.703-1.568 2.684-3.878 2.684-6.614Z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.181l-2.909-2.258c-.806.54-1.835.859-3.047.859-2.344 0-4.328-1.585-5.037-3.714H.956v2.332A9 9 0 0 0 9 18Z" />
                <path fill="#FBBC05" d="M3.963 10.706A5.41 5.41 0 0 1 3.682 9c0-.592.102-1.168.281-1.706V4.962H.956A9 9 0 0 0 0 9c0 1.452.347 2.827.956 4.038l3.007-2.332Z" />
                <path fill="#EA4335" d="M9 3.58c1.322 0 2.508.455 3.441 1.346l2.582-2.582C13.463.892 11.426 0 9 0A9 9 0 0 0 .956 4.962l3.007 2.332C4.672 5.165 6.656 3.58 9 3.58Z" />
              </svg>
              Continue with Google
            </button>
          </div>
        </>
      )}
      <p className="auth-box-footer">
        {mode === "login" ? (
          <>
            New to SMM Panel? <Link href="/signup">Create an account</Link>
          </>
        ) : mode === "signup" ? (
          <>
            Already have an account? <Link href="/login">Log in</Link>
          </>
        ) : (
          <>
            Remembered it? <Link href="/login">Back to login</Link>
          </>
        )}
      </p>
    </div>
  );
}

"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup" | "forgot";
const api = process.env.NEXT_PUBLIC_API_URL || "/backend-api";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
          <div className="social-buttons">
            <button
              type="button"
              onClick={() => setError("Google sign-in will be available soon.")}
            >
              G&nbsp; Google
            </button>
            <button
              type="button"
              onClick={() => setError("Apple sign-in will be available soon.")}
            >
              ●&nbsp; Apple
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

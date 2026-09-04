"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function AuthCta({
  className = "button",
  arrow = false,
  withLogin = false,
}: {
  className?: string;
  arrow?: boolean;
  withLogin?: boolean;
}) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    api("/api/auth/me")
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null)
    return (
      <span
        className={className}
        aria-hidden="true"
        style={{ visibility: "hidden" }}
      >
        Dashboard
      </span>
    );

  return (
    <>{withLogin && !authenticated && <Link className="text-button hide-mobile" href="/login">Log in</Link>}<Link className={className} href={authenticated ? "/dashboard" : "/signup"}>
      {authenticated ? "Dashboard" : "Create your account"}
      {arrow ? " →" : ""}
    </Link></>
  );
}

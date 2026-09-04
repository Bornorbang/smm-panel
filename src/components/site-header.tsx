"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";
import { AuthCta } from "./auth-cta";

export function SiteHeader() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  function toggleTheme() {
    const next = document.documentElement.dataset.theme !== "dark";
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("smm-panel-theme", next ? "dark" : "light");
  }
  return (
    <header className="site-header">
      <div className="shell nav-wrap">
        <Logo />
        <nav className={open ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
          <Link href="/features" onClick={() => setOpen(false)}>Features</Link>
          <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
          <Link href="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
        </nav>
        <div className="nav-actions">
          <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">{dark ? "☀" : "◐"}</button>
          <AuthCta className="button button-small nav-account-cta" withLogin />
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? "×" : "☰"}</button>
        </div>
      </div>
    </header>
  );
}

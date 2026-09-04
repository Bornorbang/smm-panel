"use client";
/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./logo";
import { api, User } from "@/lib/api";
import { preloadServices } from "@/lib/services-cache";

function MenuIcon({ type }: { type: "profile" | "password" | "logout" }) {
  const paths = {
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    password: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" /></>,
  };
  return <span aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg></span>;
}
const links = [
  ["/dashboard", "⌂", "Overview"],
  ["/dashboard/new-order", "＋", "New order"],
  ["/dashboard/orders", "▣", "Orders"],
  ["/dashboard/services", "◎", "Services"],
  ["/dashboard/wallet", "₦", "Wallet"],
  ["/dashboard/refills", "↻", "Refills"],
];
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState("0.00");
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [lockedModal, setLockedModal] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme !== "light");
    preloadServices();
    Promise.all([
      api<{ user: User }>("/api/auth/me"),
      api<{ balance: string }>("/api/wallet"),
    ])
      .then(([profile, wallet]) => {
        setUser(profile.user);
        setBalance(wallet.balance);
      })
      .catch(() => router.replace("/login"));
  }, [router, path]);
  useEffect(() => {
    function close(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setProfileOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  useEffect(()=>{const show=()=>setLockedModal(true);window.addEventListener("account-locked",show);return()=>window.removeEventListener("account-locked",show)},[]);
  function toggleTheme() {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("smm-panel-theme", next);
    setDark(!dark);
  }
  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.push("/");
  }
  if (!user)
    return (
      <div className="dash-loading">
        <span className="dashboard-spinner" aria-label="Loading" />
      </div>
    );
  return (
    <div className="dashboard">
      <aside className={open ? "dash-sidebar open" : "dash-sidebar"}>
        <div className="dash-logo">
          <Logo short />
          <button onClick={() => setOpen(false)}>×</button>
        </div>
        <nav>
          {links.map(([href, icon, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={path === href ? "active" : ""}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
          <a
            href="https://www.tempnumber.ng/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>☎</span>Temporary Numbers
          </a>
        </nav>
        <nav className="sidebar-bottom-links"><Link href="/dashboard/support" onClick={()=>setOpen(false)}><span>?</span>Contact Support</Link><a href="https://whatsapp.com/channel/0029Vb7uTgC30LKUfBRj3p2L" target="_blank" rel="noopener noreferrer"><span>◉</span>Join Channel</a></nav>
      </aside>
      <section className="dash-main">
        <header className="dash-topbar">
          <button className="dash-menu" onClick={() => setOpen(true)}>
            ☰
          </button>
          <div className="dash-search">
            ⌕{" "}
            <input
              aria-label="Search"
              placeholder="Search orders and services..."
            />
          </div>
          <div className="dash-user">
            <Link href="/dashboard/wallet" className="top-wallet">
              ₦
              {Number(balance).toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Link>
            <button
              className="dash-theme-toggle"
              onClick={toggleTheme}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
            >
              {dark ? "☀" : "☾"}
            </button>
            <div className="profile-menu" ref={menuRef}>
              <button
                className="avatar-button"
                aria-label="Open account menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((value) => !value)}
              >
                <img
                  className="user-avatar"
                  src="https://img.magnific.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740&q=80"
                  alt="Profile"
                />
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                  >
                    <MenuIcon type="profile" />Profile
                  </Link>
                  <Link
                    href="/dashboard/change-password"
                    onClick={() => setProfileOpen(false)}
                  >
                    <MenuIcon type="password" />Change password
                  </Link>
                  <button onClick={logout}>
                    <MenuIcon type="logout" />Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="dash-content">{children}</div>{lockedModal&&<div className="locked-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="locked-title"><div className="locked-modal"><span>!</span><h2 id="locked-title">Account locked</h2><p>Your account is currently locked and cannot perform transactions. Please contact the administrator for assistance.</p><div><Link className="button" href="/dashboard/support" onClick={()=>setLockedModal(false)}>Contact support</Link><button className="button button-secondary" onClick={()=>setLockedModal(false)}>Close</button></div></div></div>}
        <footer className="dashboard-footer">
          © 2026 SMM Panel by{" "}
          <a
            href="https://hostingnigeria.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hosting Nigeria
          </a>
          . All rights reserved.
        </footer>
      </section>
    </div>
  );
}

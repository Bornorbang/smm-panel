"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, User } from "@/lib/api";
import { Logo } from "@/components/logo";

const links = [["/admin","▦","Overview"],["/admin/users","♙","Users"],["/admin/orders","▤","Orders"],["/admin/wallets","₦","Wallets"],["/admin/payments","↗","Top-ups"],["/admin/refills","↻","Refills"],["/admin/services","◉","Services"]];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path=usePathname();const router=useRouter();const[user,setUser]=useState<User|null>(null);const[open,setOpen]=useState(false);
  useEffect(()=>{api<{user:User}>("/api/auth/me").then(r=>{if(r.user.role!=="admin")router.replace("/dashboard");else setUser(r.user)}).catch(()=>router.replace("/login"))},[router]);
  async function logout(){await api("/api/auth/logout",{method:"POST"});router.push("/")}
  if(!user)return <div className="dash-loading"><span className="dashboard-spinner" aria-label="Loading"/></div>;
  return <div className="dashboard admin-dashboard"><aside className={open?"dash-sidebar open":"dash-sidebar"}><div className="dash-logo"><Logo short/><button onClick={()=>setOpen(false)}>×</button></div><div className="admin-label">Administration</div><nav>{links.map(([href,icon,label])=><Link key={href} href={href} onClick={()=>setOpen(false)} className={path===href?"active":""}><span>{icon}</span>{label}</Link>)}</nav><Link className="admin-client-link" href="/dashboard">← Client dashboard</Link></aside><section className="dash-main"><header className="dash-topbar"><button className="dash-menu" onClick={()=>setOpen(true)}>☰</button><div><strong>Admin dashboard</strong><small>{user.email}</small></div><button className="admin-signout" onClick={logout}>Sign out</button></header><main className="dash-content">{children}</main><footer className="dashboard-footer">© 2026 <Link href="/">SMM Panel</Link>. All rights reserved.</footer></section></div>;
}

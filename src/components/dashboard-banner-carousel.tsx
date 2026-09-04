"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

const banners = [
  { src: "/Banner4.jpg", href: "https://whatsapp.com/channel/0029Vb7uTgC30LKUfBRj3p2L", alt: "Join the SMM Panel Nigeria WhatsApp channel" },
  { src: "/Banner-temporary-numbers.jpg", href: "https://www.tempnumber.ng/", alt: "Buy temporary numbers" },
  { src: "/Banner-affordable-domains.jpg", href: "https://hostingnigeria.com/register-domain/", alt: "Register an affordable domain" },
  { src: "/Banner-hosting.jpg", href: "https://hostingnigeria.com/web-hosting/", alt: "Buy reliable web hosting" },
];

export function DashboardBannerCarousel(){
  const[index,setIndex]=useState(0);const[paused,setPaused]=useState(false);
  useEffect(()=>{if(paused)return;const timer=window.setInterval(()=>setIndex(current=>(current+1)%banners.length),5000);return()=>window.clearInterval(timer)},[paused]);
  return <section className="dashboard-banner-carousel" aria-label="Featured services" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocus={()=>setPaused(true)} onBlur={()=>setPaused(false)}><div className="dashboard-banner-track" style={{transform:`translateX(-${index*100}%)`}}>{banners.map(banner=><a key={banner.src} href={banner.href} target="_blank" rel="noopener noreferrer" aria-label={banner.alt}><img src={banner.src} alt={banner.alt}/></a>)}</div><button className="dashboard-banner-arrow previous" type="button" onClick={()=>setIndex(current=>(current-1+banners.length)%banners.length)} aria-label="Previous banner">←</button><button className="dashboard-banner-arrow next" type="button" onClick={()=>setIndex(current=>(current+1)%banners.length)} aria-label="Next banner">→</button></section>
}

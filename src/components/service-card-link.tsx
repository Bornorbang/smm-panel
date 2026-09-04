"use client";
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";import { api } from "@/lib/api";
export function ServiceCardLink({name,meta,slug}:{name:string;meta:string;slug:string}){const router=useRouter();async function open(){try{await api("/api/auth/me");router.push("/dashboard")}catch{router.push("/signup")}}return <button className="service-card service-card-button" onClick={open}><span className="service-symbol"><img src={`https://cdn.simpleicons.org/${slug}`} alt=""/></span><div><h3>{name}</h3><p>{meta}</p></div><b>→</b></button>}

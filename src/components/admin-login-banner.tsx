"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export function AdminLoginBanner({email}:{email:string}){
  const[busy,setBusy]=useState(false);const[error,setError]=useState("");
  // Reload clears cached account data after restoring the authenticated session.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  async function restore(){setBusy(true);setError("");try{await api("/api/auth/return-to-admin",{method:"POST"});window.location.assign("/admin/users")}catch(reason){setError(reason instanceof Error?reason.message:"Unable to return to admin.");setBusy(false)}}
  return <div className="admin-login-banner" role="status"><span>Logged in as {email}</span><button disabled={busy} onClick={()=>void restore()}>{busy?"Returning...":"Return to admin"}</button>{error&&<span role="alert">{error}</span>}</div>;
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type KeyStatus={enabled:boolean;key:string|null;last4:string|null;created_at:string|null;endpoint:string;requires_regeneration?:boolean};

export default function ApiSettingsPage(){
  const[status,setStatus]=useState<KeyStatus|null>(null);const[key,setKey]=useState("");const[showKey,setShowKey]=useState(false);const[loading,setLoading]=useState(false);const[error,setError]=useState("");const[copied,setCopied]=useState(false);
  async function load(){try{const result=await api<KeyStatus>("/api/developer/key");setStatus(result);setKey(result.key||"");setShowKey(false)}catch(reason){setError(reason instanceof Error?reason.message:"Unable to load API settings.")}}
  useEffect(()=>{api<KeyStatus>("/api/developer/key").then(result=>{setStatus(result);setKey(result.key||"")}).catch(reason=>setError(reason instanceof Error?reason.message:"Unable to load API settings."))},[]);
  async function generate(){if(status?.enabled&&!window.confirm("Generate a new API key? Your current key will stop working immediately."))return;setLoading(true);setError("");try{const result=await api<{key:string;last4:string;created_at:string}>("/api/developer/key",{method:"POST"});setKey(result.key);setShowKey(true);setStatus(current=>({enabled:true,key:result.key,last4:result.last4,created_at:result.created_at,endpoint:current?.endpoint||""}))}catch(reason){setError(reason instanceof Error?reason.message:"Unable to generate an API key.")}finally{setLoading(false)}}
  async function revoke(){if(!window.confirm("Revoke this API key? Applications using it will stop working immediately."))return;setLoading(true);setError("");try{await api("/api/developer/key",{method:"DELETE"});await load()}catch(reason){setError(reason instanceof Error?reason.message:"Unable to revoke the API key.")}finally{setLoading(false)}}
  async function copy(){if(!key)return;await navigator.clipboard.writeText(key);setCopied(true);window.setTimeout(()=>setCopied(false),1800)}
  return <><div className="dash-heading"><div><span className="dash-kicker">Developer tools</span><h1>Reseller API</h1><p>Connect your own website or application to SMM Panel Nigeria.</p></div><Link className="button button-secondary" href="/api-docs" target="_blank">Read docs</Link></div>
    {error&&<div className="dash-alert error">{error}</div>}
    <div className="api-settings-grid"><section className="dash-panel api-key-card"><div className="panel-head"><div><h2>API key</h2><p>One active key can access services and spend your wallet balance.</p></div><span className={status?.enabled?"api-state active":"api-state"}>{status?.enabled?"Active":"Not created"}</span></div>
      {key&&<div className="api-key-masked"><div className="api-key-view"><code>{showKey?key:`••••••••••••••••••••••••${status?.last4||""}`}</code><button type="button" onClick={()=>setShowKey(value=>!value)} aria-label={showKey?"Hide API key":"Show API key"} title={showKey?"Hide API key":"Show API key"}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.7"/></svg></button><button type="button" onClick={copy}>{copied?"Copied":"Copy"}</button></div><small>Created {status?.created_at?new Date(status.created_at).toLocaleDateString():"recently"}</small></div>}
      {status?.requires_regeneration&&!key&&<div className="dash-alert">Generate a new key to make it viewable from this page.</div>}
      <div className="api-key-actions"><button className="button" disabled={loading} onClick={generate}>{loading?"Please wait...":status?.enabled?"Generate new key":"Generate API key"}</button>{status?.enabled&&<button className="button button-secondary api-revoke" disabled={loading} onClick={revoke}>Revoke key</button>}</div>
    </section><aside className="dash-panel api-quick-card"><h2>Connection details</h2><dl><div><dt>HTTP method</dt><dd>POST</dd></div><div><dt>Response</dt><dd>JSON</dd></div><div><dt>Currency</dt><dd>NGN</dd></div></dl><label>API URL</label><code>{status?.endpoint||"http://localhost:8088/api/v2"}</code><p>Never expose your key in browser JavaScript or a public repository. Send API requests from your server.</p></aside></div>
  </>;
}

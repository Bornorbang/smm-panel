"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Inbox, MailMessage, MailStatus, mailDate, mailMoney } from "@/lib/temp-mail";

export default function TempMailPage(){
  const[data,setData]=useState<MailStatus|null>(null);const[busy,setBusy]=useState(false);const[error,setError]=useState("");const[selected,setSelected]=useState<Inbox|null>(null);const[messages,setMessages]=useState<MailMessage[]>([]);const[message,setMessage]=useState<MailMessage|null>(null);const[inboxError,setInboxError]=useState("");const[loadingMessages,setLoadingMessages]=useState(false);
  const keys=useRef(new Map<string,string>());const dialog=useRef<HTMLDialogElement>(null);const request=useRef(0);const[now,setNow]=useState(()=>Date.now());
  const active=(row:Inbox)=>row.status==="active"&&new Date(row.expires_at).getTime()>now;
  const notify=(text:string)=>window.dispatchEvent(new CustomEvent("app-toast",{detail:{message:text,type:"success"}}));
  useEffect(()=>{api<MailStatus>("/api/temp-mail?action=status").then(setData).catch(reason=>setError(reason.message));const timer=window.setInterval(()=>setNow(Date.now()),1000);return()=>window.clearInterval(timer)},[]);
  async function action(type:"create"|"renew"|"delete",row?:Inbox){
    if(busy)return;if(type==="delete"&&!window.confirm(`Delete ${row?.email}? You will lose access to this inbox.`))return;
    setBusy(true);setError("");const target=`${type}:${row?.id??0}`;let key=keys.current.get(target);if(!key){key=crypto.randomUUID();keys.current.set(target,key)}
    try{const result=await api<MailStatus>(`/api/temp-mail?action=${type}${row?`&id=${row.id}`:""}`,{method:"POST",body:JSON.stringify({idempotency_key:key})});setData(result);keys.current.delete(target);window.dispatchEvent(new CustomEvent("wallet-updated"));notify(type==="create"?"Temporary email generated successfully.":type==="renew"?"Temporary email renewed for 24 hours.":"Temporary email deleted.")}catch(reason){setError(reason instanceof Error?reason.message:"Unable to update temporary email.")}finally{setBusy(false)}
  }
  async function refresh(row:Inbox){
    const token=++request.current;setLoadingMessages(true);setInboxError("");setMessage(null);setMessages([]);
    try{const result=await api<{messages:MailMessage[]}>(`/api/temp-mail?action=messages&inbox_id=${row.id}`);if(token===request.current)setMessages(result.messages)}catch(reason){if(token===request.current)setInboxError(reason instanceof Error?reason.message:"Unable to load messages.")}finally{if(token===request.current)setLoadingMessages(false)}
  }
  function open(row:Inbox){setSelected(row);dialog.current?.showModal();void refresh(row)}
  function close(){request.current++;setSelected(null);setMessages([]);setMessage(null);setInboxError("");dialog.current?.close()}
  async function read(item:MailMessage){if(!selected)return;const token=++request.current;setLoadingMessages(true);setInboxError("");try{const result=await api<{message:MailMessage}>(`/api/temp-mail?action=message&inbox_id=${selected.id}&message_id=${encodeURIComponent(item.id)}`);if(token===request.current)setMessage(result.message)}catch(reason){if(token===request.current)setInboxError(reason instanceof Error?reason.message:"Unable to open message.")}finally{if(token===request.current)setLoadingMessages(false)}}
  async function copy(row:Inbox){try{await navigator.clipboard.writeText(row.email);notify("Email address copied.")}catch{setError("Unable to copy. Please select and copy the email address.")}}
  return <><div className="dash-heading"><div><span className="dash-kicker">Temporary Emails</span><h1>Your temporary inboxes</h1><p>Receive messages with a disposable email address.</p></div></div>
    {error&&<div className="dash-alert error" role="alert">{error}</div>}
    <div className="temp-mail-cards">
    <section className="dash-panel temp-mail-card temp-mail-generate"><h2>Generate temporary email</h2><p className="temp-mail-generate-description">Click button below to generate an email address. Each email is active for 24 hours and costs {data?mailMoney(data.price_ngn).replace(/\.00$/, ""):"..."}.</p><button className="button" disabled={busy||!data||Number(data.price_ngn)<=0} onClick={()=>void action("create")}>{busy?"Processing...":"Generate email"}</button><p className="temp-mail-renew-note"><span aria-hidden="true">i</span><span>Renew before expiry to keep it on your dashboard for another 24 hours.</span></p>{data&&Number(data.price_ngn)<=0&&<p>Temporary email purchasing is not available yet.</p>}</section>
    <section className="dash-panel temp-mail-inboxes"><div className="panel-head"><div><h2>Your temporary emails</h2></div></div>{!data?<div className="table-loading">Loading temporary emails...</div>:!data.inboxes.length?<div className="temp-mail-empty">Generate an email to see it here and receive messages.</div>:<><div className="dash-table-wrap"><table className="dash-table"><thead><tr><th>Email address</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead><tbody>{data.inboxes.map(row=><tr key={row.id}><td className="temp-mail-address"><div className="temp-mail-address-copy"><span>{row.email}</span><button type="button" className="temp-mail-copy" disabled={busy||!active(row)} onClick={()=>void copy(row)} aria-label={`Copy ${row.email}`} title="Copy email address"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg></button></div></td><td>{mailDate(row.expires_at)}</td><td>{row.status==="active"&&!active(row)?"expired":row.status}</td><td><div className="row-actions"><button disabled={busy||!active(row)} onClick={()=>open(row)}>Messages</button><button disabled={busy||!active(row)} onClick={()=>void action("renew",row)}>Renew</button><button disabled={busy} onClick={()=>void action("delete",row)}>Delete</button></div></td></tr>)}</tbody></table></div></>}</section>
    </div>
    <dialog ref={dialog} className="temp-mail-dialog" aria-labelledby="temp-mail-dialog-title" onCancel={event=>{event.preventDefault();close()}}>
      <header><h2 id="temp-mail-dialog-title">Inbox</h2><div className="temp-mail-modal-controls"><button type="button" className="temp-mail-modal-refresh" disabled={loadingMessages||!selected||!active(selected)} onClick={()=>selected&&void refresh(selected)}>Refresh</button><button type="button" className="temp-mail-modal-close" aria-label="Close inbox" onClick={close}>&times;</button></div></header>
      {selected&&!active(selected)?<p role="alert">This inbox is no longer active.</p>:<>
        {message&&<div className="temp-mail-dialog-actions"><button className="button button-secondary" onClick={()=>setMessage(null)}>Back to messages</button></div>}
        {inboxError&&<p className="temp-mail-error" role="alert">{inboxError}</p>}
        {loadingMessages?<p className="temp-mail-modal-empty">Loading messages...</p>:message?<article><h3>{message.subject||"(No subject)"}</h3><p>From: {message.sender}</p><pre className="temp-mail-body">{message.text||"This message has no plain-text content."}</pre></article>:!inboxError&&<div className="temp-mail-messages">{messages.map(item=><button key={item.id} onClick={()=>void read(item)}><strong>{item.subject||"(No subject)"}</strong><span>{item.sender}</span><p>{item.preview}</p></button>)}{!messages.length&&<p className="temp-mail-modal-empty">No messages yet. Refresh to check for new mail.</p>}</div>}
      </>}
    </dialog>
  </>;
}

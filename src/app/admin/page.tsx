"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Data={stats:Record<string,number|string>;recent_users:Array<Record<string,string|number>>;recent_orders:Array<Record<string,string|number>>};
const money=(value:string|number)=>`₦${Number(value).toLocaleString("en-NG",{minimumFractionDigits:2})}`;

export default function AdminOverview(){
  const[data,setData]=useState<Data|null>(null);const[error,setError]=useState("");
  useEffect(()=>{api<Data>("/api/admin/overview").then(setData).catch(reason=>setError(reason.message))},[]);
  if(error)return <div className="dash-alert error">{error}</div>;
  if(!data)return <div className="dash-skeleton"><i/><i/><i/><i/><b/></div>;
  const cards=[["Users",data.stats.users,"/admin/users"],["Orders",data.stats.orders,"/admin/orders"],["Active orders",data.stats.active_orders,"/admin/orders"],["Revenue",money(data.stats.revenue),"/admin/orders"],["Customer wallets",money(data.stats.wallets),"/admin/wallets"],["Top-ups",data.stats.payments,"/admin/payments"],["Refills",data.stats.refills,"/admin/refills"],["Number rentals",data.stats.temp_numbers,"/admin/temp-numbers"],["Active numbers",data.stats.active_temp_numbers,"/admin/temp-numbers"]];
  return <><div className="dash-heading"><div><span className="dash-kicker">Platform control</span><h1>Overview</h1><p>Live activity across every customer account.</p></div></div><div className="admin-stat-grid">{cards.map(([label,value,href])=><Link href={String(href)} key={String(label)}><span>↗</span><small>{label}</small><strong>{value}</strong><em>View details →</em></Link>)}</div><div className="admin-overview-grid"><section className="dash-panel"><div className="panel-head"><div><h2>Newest users</h2><p>Recently created accounts</p></div><Link href="/admin/users">View all →</Link></div><div className="admin-list">{data.recent_users.map(user=><div key={user.id}><span>{String(user.name).slice(0,1)}</span><div><strong>{user.name}</strong><small>{user.email}</small></div><b>{money(user.wallet_balance)}</b></div>)}</div></section><section className="dash-panel"><div className="panel-head"><div><h2>Latest orders</h2><p>Most recent platform activity</p></div><Link href="/admin/orders">View all →</Link></div><div className="admin-list">{data.recent_orders.map(order=><div key={order.id}><span>#{order.id}</span><div><strong>{order.service_name}</strong><small>{order.user_email}</small></div><b>{money(order.charge)}</b></div>)}</div></section></div></>;
}

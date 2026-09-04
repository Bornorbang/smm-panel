"use client";
import { useEffect, useMemo, useState } from "react";
import { api, Service } from "@/lib/api";
export default function Page() {
  const [items, setItems] = useState<Service[]>([]);
  const [error, setError] = useState("");
  const[query,setQuery]=useState("");const[category,setCategory]=useState("");const[feature,setFeature]=useState("");
  useEffect(() => {
    api<{ services: Service[] }>("/api/services")
      .then((r) => setItems(r.services))
      .catch((e) => setError(e.message));
  }, []);
  const categories=useMemo(()=>[...new Set(items.map(item=>item.category))],[items]);
  const shown=useMemo(()=>items.filter(item=>(!query||`${item.name} ${item.type}`.toLowerCase().includes(query.toLowerCase()))&&(!category||item.category===category)&&(!feature||(feature==="refill"?item.refill:item.cancel))),[items,query,category,feature]);
  return (
    <>
      <div className="dash-heading">
        <div>
          <span className="dash-kicker">Live provider catalogue</span>
          <h1>Services</h1>
          <p>
            Customer-facing Naira prices, limits, refill, and cancellation
            availability.
          </p>
        </div>
      </div>
      {error && <div className="dash-alert error">{error}</div>}
      <div className="table-toolbar admin-filters"><div className="dash-search">⌕ <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search services..."/></div><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{categories.map(value=><option key={value}>{value}</option>)}</select><select value={feature} onChange={e=>setFeature(e.target.value)}><option value="">All features</option><option value="refill">Refill available</option><option value="cancel">Provider cancellation</option></select><button onClick={()=>{setQuery("");setCategory("");setFeature("")}}>Clear</button></div>
      <div className="service-catalog admin-services">
        {shown.map((s) => (
          <article key={s.service}>
            <div className="catalog-icon">{s.name[0]}</div>
            <div className="catalog-main">
              <small>{s.category}</small>
              <h3>{s.name}</h3>
              <p>{s.type}</p>
              <div>
                <span>{s.min} min</span>
                <span>{s.max} max</span>
                {s.refill && <span>Refill</span>}
                {s.cancel && <span>Cancel</span>}
              </div>
            </div>
            <div className="catalog-rate">
              <strong>
                ₦
                {Number(s.rate).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
              </strong>
              <small>per 1,000</small>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

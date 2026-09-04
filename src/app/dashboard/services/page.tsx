"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api, Service } from "@/lib/api";
const naira = (v: string) =>
  `₦${Number(v).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [favorites,setFavorites]=useState<Set<number>>(new Set());
  const [favoriteBusy,setFavoriteBusy]=useState<number|null>(null);
  useEffect(() => {
    Promise.all([api<{ services: Service[] }>("/api/services"),api<{favorites:number[]}>("/api/service-favorites")])
      .then(([catalog,saved]) => {setServices(catalog.services);setFavorites(new Set(saved.favorites))})
      .catch((e) => setError(e.message));
  }, []);
  const cats = [...new Set(services.map((s) => s.category))];
  const shown = useMemo(
    () =>
      services.filter(
        (s) =>
          (!category || s.category === category) &&
          (!query ||
            `${s.name} ${s.category}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [services, category, query],
  );
  const grouped = useMemo(() => {
    const groups = new Map<string, Service[]>();
    shown.forEach((service) => groups.set(service.category, [...(groups.get(service.category) || []), service]));
    groups.forEach(items=>items.sort((a,b)=>Number(favorites.has(b.service))-Number(favorites.has(a.service))));
    return [...groups.entries()];
  }, [shown,favorites]);
  async function toggleFavorite(serviceId:number){setFavoriteBusy(serviceId);setError("");try{const result=await api<{favorite:boolean}>(`/api/service-favorites/${serviceId}`,{method:"POST"});setFavorites(current=>{const next=new Set(current);if(result.favorite)next.add(serviceId);else next.delete(serviceId);return next})}catch(reason){setError(reason instanceof Error?reason.message:"Unable to update favourite.")}finally{setFavoriteBusy(null)}}
  return (
    <>
      <div className="dash-heading">
        <div>
          <span className="dash-kicker">SMM Panel catalogue</span>
          <h1>Services</h1>
          <p>Browse current prices, limits, and order features.</p>
        </div>
        <Link className="button" href="/dashboard/new-order">
          + New order
        </Link>
      </div>
      <div className="dash-panel">
        <div className="table-toolbar">
          <div className="dash-search">
            ⌕{" "}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {cats.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        {error ? (
          <div className="dash-alert error">{error}</div>
        ) : !services.length ? (
          <div className="table-loading catalog-loading"><span className="inline-spinner" aria-hidden="true"/>Loading catalogue...</div>
        ) : (
          <div className="services-by-category">
            {grouped.map(([categoryName, categoryServices]) => <section className="service-category" key={categoryName}><div className="service-category-heading"><h2>{categoryName}</h2></div><div className="service-catalog">{categoryServices.map((s) => (
              <article key={s.service}>
                <button type="button" className={`service-favorite ${favorites.has(s.service)?"active":""}`} disabled={favoriteBusy===s.service} onClick={()=>void toggleFavorite(s.service)} aria-label={favorites.has(s.service)?`Remove ${s.name} from favourites`:`Add ${s.name} to favourites`} aria-pressed={favorites.has(s.service)}>{favorites.has(s.service)?"♥":"♡"}</button>
                <div className="catalog-main">
                  <h3>{s.name}</h3>
                  <p>{s.type}</p>
                  <div>
                    <span>{Number(s.min).toLocaleString()} min</span>
                    <span>{Number(s.max).toLocaleString()} max</span>
                    {s.refill && <span>Refill</span>}
                    {s.cancel && <span>Cancel</span>}
                  </div>
                </div>
                <div className="catalog-rate">
                  <strong>{naira(s.rate)}</strong>
                  <small>per 1,000</small>
                  <Link href="/dashboard/new-order">Order →</Link>
                </div>
              </article>
            ))}</div></section>)}
            {!grouped.length&&<div className="table-loading">No services match your filters.</div>}
          </div>
        )}
      </div>
    </>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
type Row = Record<string, string | number | null>;
type Column = { key: string; label: string; money?: boolean; status?: boolean };
export function AdminResource({
  title,
  description,
  endpoint,
  keyName,
  columns,
}: {
  title: string;
  description: string;
  endpoint: string;
  keyName: string;
  columns: Column[];
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api<Record<string, Row[]>>(endpoint)
      .then((r) => setRows(r[keyName] || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [endpoint, keyName]);
  const statuses=useMemo(()=>[...new Set(rows.map(r=>String(r.status??r.type??"")).filter(Boolean))],[rows]);
  const shown = useMemo(
    () =>
      rows.filter(
        (r) => {
          const matchesQuery=!query||Object.values(r)
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase());
          const rowStatus=String(r.status??r.type??"");
          const created=String(r.created_at??"").slice(0,10);
          return matchesQuery&&(!status||rowStatus===status)&&(!from||created>=from)&&(!to||created<=to);
        },
      ),
    [rows, query, status, from, to],
  );
  return (
    <>
      <div className="dash-heading">
        <div>
          <span className="dash-kicker">Administration</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      <section className="dash-panel">
        <div className="table-toolbar admin-filters">
          <div className="dash-search">
            ⌕{" "}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
            />
          </div>
          <select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All statuses</option>{statuses.map(value=><option key={value}>{value}</option>)}</select>
          <label>From<input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label>
          <label>To<input type="date" value={to} onChange={e=>setTo(e.target.value)}/></label>
          <button type="button" onClick={()=>{setQuery("");setStatus("");setFrom("");setTo("")}}>Clear</button>
          <span className="admin-count">{shown.length} records</span>
        </div>
        {error ? (
          <div className="dash-alert error">{error}</div>
        ) : loading ? (
          <div className="table-loading">Loading...</div>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table admin-table">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c.key}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((row, index) => (
                  <tr key={String(row.id ?? index)}>
                    {columns.map((c) => {
                      const value = row[c.key] ?? "—";
                      return (
                        <td key={c.key}>
                          {c.status ? (
                            <span
                              className={`wallet-status wallet-status-${String(value).toLowerCase().replaceAll(" ", "-")}`}
                            >
                              {value}
                            </span>
                          ) : c.money ? (
                            `₦${Number(value).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
                          ) : (
                            String(value)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {!shown.length && (
              <div className="table-loading">No records found.</div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

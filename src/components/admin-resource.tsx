"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { AdminRow, adminMoney, adminPage, customerCreditTotal, filterAdminRows, sumAmount } from "@/lib/admin-data";
import { AdminPagination } from "@/components/admin-pagination";

type Column = { key: string; label: string; money?: boolean; status?: boolean };
export function AdminResource({ title, description, endpoint, keyName, columns }: {
  title: string; description: string; endpoint: string; keyName: string; columns: Column[];
}) {
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [filters, setFilters] = useState({ query: "", status: "", type: "", from: "", to: "" });
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(() =>
    api<Record<string, AdminRow[]>>(endpoint, { cache: "no-store" })
      .then(result => { setRows(result[keyName] || []); setError(""); })
      .catch(reason => setError(reason instanceof Error ? reason.message : "Unable to load records."))
      .finally(() => setLoading(false)), [endpoint, keyName]);
  useEffect(() => { void load(); }, [load]);
  const statuses = useMemo(() => [...new Set(rows.map(row => String(row.status ?? "")).filter(Boolean))].sort(), [rows]);
  const shown = useMemo(() => filterAdminRows(rows, filters), [rows, filters]);
  const pagination = adminPage(shown, page);
  function filter(key: keyof typeof filters, value: string) { setFilters(previous => ({ ...previous, [key]: value })); setPage(1); }
  const summaries = keyName === "transactions" ? [
    { label: "Total credits", amount: customerCreditTotal(shown), tone: "credit" },
    { label: "Total debits", amount: sumAmount(shown.filter(row => row.type === "debit"), row => row.amount), tone: "debit" },
  ] : keyName === "payments" ? [
    { label: "Total top-up amount", amount: sumAmount(shown, row => row.amount), tone: "credit" },
  ] : keyName === "orders" ? [
    { label: "Total order amount", amount: sumAmount(shown, row => row.charge), tone: "credit" },
  ] : [];
  return <>
    <div className="dash-heading"><div><span className="dash-kicker">Administration</span><h1>{title}</h1><p>{description}</p></div><button className="button button-secondary" disabled={loading} onClick={() => { setLoading(true); setError(""); void load(); }}>{loading ? "Refreshing…" : "Refresh"}</button></div>
    {summaries.length > 0 && <div className="admin-inline-totals">{summaries.map(summary => <strong key={summary.label} aria-label={summary.label} className={`admin-amount-${summary.tone}`}>{loading ? "Loading…" : error ? "Unavailable" : adminMoney(summary.amount)}</strong>)}</div>}
    <section className="dash-panel">
      <div className="table-toolbar admin-filters">
        <div className="dash-search"><input aria-label={`Search ${title.toLowerCase()}`} value={filters.query} onChange={event => filter("query", event.target.value)} placeholder={`Search ${title.toLowerCase()}...`}/></div>
        <select aria-label="Status" value={filters.status} onChange={event => filter("status", event.target.value)}><option value="">All statuses</option>{statuses.map(value => <option key={value}>{value}</option>)}</select>
        {keyName === "transactions" && <select aria-label="Transaction type" value={filters.type} onChange={event => filter("type", event.target.value)}><option value="">All types</option><option value="credit">Credits</option><option value="debit">Debits</option></select>}
        <label>From<input type="date" value={filters.from} onChange={event => filter("from", event.target.value)}/></label>
        <label>To<input type="date" value={filters.to} onChange={event => filter("to", event.target.value)}/></label>
        <button type="button" onClick={() => { setFilters({ query: "", status: "", type: "", from: "", to: "" }); setPage(1); }}>Clear</button><span className="admin-count">{shown.length} records</span>
      </div>
      {error ? <div className="dash-alert error" role="alert">{error}</div> : loading ? <div className="table-loading">Loading...</div> : <>
        <div className="dash-table-wrap"><table className="dash-table admin-table"><thead><tr>{columns.map(column => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody>
          {pagination.rows.map((row, index) => <tr key={String(row.id ?? index)}>{columns.map(column => {
            const value = row[column.key] ?? "—";
            return <td key={column.key}>{column.status ? <span className={`wallet-status wallet-status-${String(value).toLowerCase().replaceAll(" ", "-")}`}>{value}</span> : column.money ? adminMoney(Number(value)) : String(value)}</td>;
          })}</tr>)}
        </tbody></table>{!shown.length && <div className="table-loading">No records found.</div>}</div>
        <AdminPagination {...pagination} total={shown.length} onChange={setPage}/>
      </>}
    </section>
  </>;
}

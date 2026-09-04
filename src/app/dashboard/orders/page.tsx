"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api, Order } from "@/lib/api";
import { OrderTable } from "@/components/order-table";
export default function Orders() {
  const perPage = 15;
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const load = useCallback(
    () =>
      api<{ orders: Order[] }>("/api/orders")
        .then((r) => setOrders(r.orders))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false)),
    [],
  );
  useEffect(() => {
    void load();
  }, [load]);
  const shown = useMemo(
    () =>
      orders.filter(
        (o) =>
          (!status || o.status.toLowerCase() === status.toLowerCase()) &&
          (!query ||
            `${o.id} ${o.service_name}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [orders, query, status],
  );
  const totalPages = Math.max(1, Math.ceil(shown.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = shown.slice((currentPage - 1) * perPage, currentPage * perPage);
  return (
    <>
      <div className="dash-heading">
        <div>
          <span className="dash-kicker">Your purchases</span>
          <h1>Orders</h1>
          <p>
            Track delivery and request eligible refills.
          </p>
        </div>
        <button className="button button-secondary" onClick={() => void load()}>
          ↻ Refresh
        </button>
      </div>
      <div className="dash-panel">
        <div className="table-toolbar">
          <div className="dash-search">
            ⌕{" "}
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by service or order number"
            />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All statuses</option>
            <option>Pending</option>
            <option>In progress</option>
            <option>Completed</option>
            <option>Partial</option>
            <option>Canceled</option>
          </select>
        </div>
        {error ? (
          <div className="dash-alert error">{error}</div>
        ) : loading ? (
          <div className="table-loading">Loading orders...</div>
        ) : (
          <><OrderTable orders={paginated} onChange={() => void load()} />
          {totalPages > 1 && <nav className="table-pagination" aria-label="Orders pagination"><button disabled={currentPage===1} onClick={()=>setPage(currentPage-1)}>← Previous</button><span>Page {currentPage} of {totalPages}</span><button disabled={currentPage===totalPages} onClick={()=>setPage(currentPage+1)}>Next →</button></nav>}</>
        )}
      </div>
    </>
  );
}

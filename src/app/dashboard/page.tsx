"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { OrderTable } from "@/components/order-table";
import { DashboardBannerCarousel } from "@/components/dashboard-banner-carousel";
import { api, Order, User } from "@/lib/api";
type Overview = {
  user: User;
  balance: { balance: string; currency: string };
  stats: { orders: number; active: number; spent: string };
  recent_orders: Order[];
};
const naira = (v: string) =>
  `₦${Number(v).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
function StatIcon({ type }: { type: "orders" | "active" | "spent" }) {
  const paths = {
    orders: <><path d="M7 3h10v4H7z" /><path d="M5 5H3v16h18V5h-2M8 12h8M8 16h5" /></>,
    active: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    spent: <><path d="M4 18L18 4M10 4h8v8" /><path d="M5 7v13h13" /></>,
  };
  return <span className="stat-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg></span>;
}
export default function OverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const load = useCallback(
    () =>
      api<Overview>("/api/dashboard/overview")
        .then(setData)
        .catch((e) => setError(e.message)),
    [],
  );
  useEffect(() => {
    void load();
    const success = sessionStorage.getItem("wallet-fund-success");
    if (success) {
      sessionStorage.removeItem("wallet-fund-success");
      setToast(success);
      window.setTimeout(() => setToast(""), 4000);
    }
  }, [load]);
  if (error)
    return (
      <div className="dash-empty error-state">
        <span>!</span>
        <h3>We couldn’t load your workspace</h3>
        <p>{error}</p>
        <button
          className="button"
          onClick={() => {
            setError("");
            void load();
          }}
        >
          Try again
        </button>
      </div>
    );
  if (!data)
    return (
      <div className="dash-skeleton">
        <i />
        <i />
        <i />
        <i />
        <b />
      </div>
    );
  return (
    <>{toast && <div className="dashboard-toast">✓ {toast}</div>}<DashboardBannerCarousel />
      <div className="dash-heading">
        <div>
          <h1>👋 Hello, {data.user.name.split(" ")[0]}</h1>
          <p>Here’s what’s happening with your orders today.</p>
        </div>
        <Link className="button" href="/dashboard/new-order">
          + New order
        </Link>
      </div>
      <div className="stat-grid">
        <article>
          <span className="stat-icon coral">₦</span>
          <div>
            <small>Wallet balance</small>
            <strong>{naira(data.balance.balance)}</strong>
            <em>Available to spend</em>
          </div>
        </article>
        <article>
          <StatIcon type="orders" />
          <div>
            <small>Total orders</small>
            <strong>{data.stats.orders}</strong>
            <em>All-time</em>
          </div>
        </article>
        <article>
          <StatIcon type="active" />
          <div>
            <small>Active orders</small>
            <strong>{data.stats.active}</strong>
            <em>Currently delivering</em>
          </div>
        </article>
        <article>
          <StatIcon type="spent" />
          <div>
            <small>Total spent</small>
            <strong>{naira(data.stats.spent)}</strong>
            <em>Tracked orders</em>
          </div>
        </article>
      </div>
      <section className="dash-panel">
        <div className="panel-head">
          <div>
            <h2>Recent orders</h2>
            <p>Your latest activity</p>
          </div>
          <Link href="/dashboard/orders">View all →</Link>
        </div>
        <OrderTable compact orders={data.recent_orders} />
      </section>
    </>
  );
}

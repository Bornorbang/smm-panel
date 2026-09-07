"use client";
import Link from "next/link";
import { useState } from "react";
import { api, Order } from "@/lib/api";
import { StatusPill } from "./status-pill";
const naira = (value: string | number) =>
  `₦${Number(value).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export function OrderTable({
  orders,
  onChange,
  compact = false,
}: {
  orders: Order[];
  onChange?: () => void;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  async function action(order: Order) {
    setBusy(order.id);
    setMessage("");
    try {
      await api(`/api/orders/${order.id}/refill`, { method: "POST" });
      setMessage("Refill requested successfully.");
      onChange?.();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusy(null);
    }
  }
  if (!orders.length)
    return (
      <div className="dash-empty">
        <span>#</span>
        <h3>No orders yet</h3>
        <p>Your first order will appear here after it is placed.</p>
        <Link href="/dashboard/new-order" className="button button-small">
          Create an order
        </Link>
      </div>
    );
  return (
    <>
      {message && <div className="dash-alert">{message}</div>}
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Service</th>
              <th>Quantity</th>
              <th>You paid</th>
              <th>Status</th>
              {!compact && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <strong>#{o.id}</strong>
                  <small>{new Date(o.created_at).toLocaleDateString()}</small>
                </td>
                <td>
                  <strong>{o.service_name}</strong>
                  <a
                    className="order-destination-link"
                    href={o.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={o.link}
                  >
                    {o.link}
                  </a>
                </td>
                <td>
                  {Number(o.quantity).toLocaleString()}
                  <small>{o.remains} remaining</small>
                </td>
                <td>{naira(o.charge)}</td>
                <td>
                  <StatusPill status={o.status} />
                </td>
                {!compact && (
                  <td>
                    <div className="row-actions">
                      <button
                        disabled={busy === o.id || !Number(o.can_refill)}
                        onClick={() => action(o)}
                      >
                        ↻ Refill
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

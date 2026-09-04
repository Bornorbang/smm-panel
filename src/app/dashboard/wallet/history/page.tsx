"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
type Transaction = {
  id: number;
  type: "credit" | "debit";
  amount: string;
  description: string;
  status: string;
  created_at: string;
};
type Wallet = { balance: string; transactions: Transaction[] };
const naira = (value: string) =>
  `₦${Number(value).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export default function WalletHistory() {
  const [data, setData] = useState<Wallet | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api<Wallet>("/api/wallet")
      .then(setData)
      .catch((reason) => setError(reason.message));
  }, []);
  return (
    <div className="wallet-page">
      <div className="wallet-page-link">
        <Link href="/dashboard/wallet">← Add funds</Link>
      </div>
      <section className="dash-panel wallet-history-card">
        <div className="panel-head">
          <div>
            <h1>Wallet activity</h1>
            <p>Deposits, order charges, and refunds</p>
          </div>
        </div>
        {error ? (
          <div className="dash-alert error">{error}</div>
        ) : !data ? (
          <div className="table-loading">Loading history...</div>
        ) : !data.transactions.length ? (
          <div className="dash-empty">
            <span>₦</span>
            <h3>No wallet activity yet</h3>
            <p>Your completed payments and order charges will appear here.</p>
          </div>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td>
                      <strong>{item.description}</strong>
                    </td>
                    <td>{item.type}</td>
                    <td>
                      {item.type === "credit" ? "+" : "-"}
                      {naira(item.amount)}
                    </td>
                        <td><span className={`wallet-status wallet-status-${item.status.toLowerCase().replaceAll(" ", "-")}`}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

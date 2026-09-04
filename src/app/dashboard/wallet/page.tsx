"use client";
import Link from "next/link";
import { KoraCheckout } from "@/components/kora-checkout";
export default function WalletPage() {
  return (
    <div className="wallet-page">
      <div className="wallet-page-link">
        <Link href="/dashboard/wallet/history">→ View History</Link>
      </div>
      <section className="dash-panel wallet-fund-card">
        <div className="wallet-fund-heading">
          <span className="dash-kicker">Wallet</span>
          <h1>Add funds</h1>
          <p>Enter an amount and continue to secure payment.</p>
        </div>
        <KoraCheckout onFunded={() => undefined} />
      </section>
    </div>
  );
}

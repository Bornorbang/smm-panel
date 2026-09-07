"use client";
import Script from "next/script";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
type CheckoutPayment = {
  reference: string;
  amount: number;
  currency: string;
  public_key: string;
  customer: { name: string; email: string };
  notification_url: string;
};
type KoraWindow = Window & {
  Korapay?: { initialize: (options: Record<string, unknown>) => void };
};
const suggestions = [1000, 2500, 5000, 10000, 20000];
export function KoraCheckout({ onFunded }: { onFunded: () => void }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!Number.isFinite(Number(amount)) || Number(amount) < 500)
      return setMessage("The minimum top-up amount is ₦500.");
    if (!ready)
      return setMessage("Payment checkout is still loading. Please try again.");
    setLoading(true);
    try {
      const result = await api<{ payment: CheckoutPayment }>(
        "/api/wallet/initialize",
        { method: "POST", body: JSON.stringify({ amount: Number(amount) }) },
      );
      const payment = result.payment;
      (window as KoraWindow).Korapay?.initialize({
        key: payment.public_key,
        reference: payment.reference,
        amount: payment.amount,
        currency: payment.currency,
        customer: payment.customer,
        notification_url: payment.notification_url,
        onClose: () => setLoading(false),
        onSuccess: async () => {
          try {
            await api("/api/wallet/verify", {
              method: "POST",
              body: JSON.stringify({ reference: payment.reference }),
            });
            sessionStorage.setItem("wallet-fund-success", "Wallet funded successfully.");
            onFunded();
            router.push("/dashboard");
          } catch (reason) {
            setMessage(
              reason instanceof Error
                ? reason.message
                : "Payment verification failed.",
            );
          } finally {
            setLoading(false);
          }
        },
      });
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "Unable to start checkout.",
      );
      setLoading(false);
    }
  }
  return (
    <>
      <Script
        src="https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <form className="wallet-fund-form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="fund-amount">Amount</label>
          <div className="naira-input">
            <span>₦</span>
            <input
              id="fund-amount"
              name="amount"
              type="number"
              min="500"
              step="any"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="5,000"
            />
          </div>
        </div>
        <div className="amount-suggestions">
          {suggestions.map((value) => (
            <button
              type="button"
              className={amount === String(value) ? "active" : ""}
              key={value}
              onClick={() => setAmount(String(value))}
            >
              ₦{value.toLocaleString("en-NG")}
            </button>
          ))}
        </div>
        <button className="button" disabled={loading || !ready} type="submit">
          {loading
            ? "Opening checkout..."
            : ready
              ? "Add funds"
              : "Loading checkout..."}
        </button>
        {message && <div className="dash-alert">{message}</div>}
      </form>
    </>
  );
}

"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, Service } from "@/lib/api";
import { loadServices } from "@/lib/services-cache";
const naira = (v: number) =>
  `₦${v.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export default function NewOrder() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<Service | null>(null);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadServices()
      .then(setServices)
      .catch((e) => setError(e.message));
  }, []);
  const categories = useMemo(
    () => [...new Set(services.map((s) => s.category))],
    [services],
  );
  const filtered = category
    ? services.filter((s) => s.category === category)
    : services;
  const packageType = (selected?.type || "").toLowerCase().includes("package");
  const estimate = selected
    ? packageType
      ? Number(selected.rate)
      : (Number(selected.rate) * Number(quantity || 0)) / 1000
    : 0;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return setError("Choose a service.");
    setLoading(true);
    setError("");
    const values = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          service: selected.service,
          quantity: quantity || "",
        }),
      });
      router.push("/dashboard/orders");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to create order.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className="dash-heading">
        <div>
          <span className="dash-kicker">Place an order</span>
          <h1>New order</h1>
          <p>Choose a service and review the wallet charge.</p>
        </div>
      </div>
      {error && <div className="dash-alert error">{error}</div>}
      <div className="order-builder">
        <form className="dash-panel order-form" onSubmit={submit}>
          <div className="builder-step">
            <span>1</span>
            <div>
              <h2>Choose a service</h2>
              <p>Browse the current SMM Panel catalogue.</p>
            </div>
          </div>
          <div className="field">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSelected(null);
              }}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Service</label>
            <select
              required
              value={selected?.service || ""}
              onChange={(e) => {
                setSelected(
                  services.find((s) => s.service === Number(e.target.value)) ||
                    null,
                );
                setQuantity("");
              }}
            >
              <option value="">Select a service</option>
              {filtered.map((s) => (
                <option key={s.service} value={s.service}>
                  {s.name} — {naira(Number(s.rate))}/1K
                </option>
              ))}
            </select>
          </div>
          <div className="builder-step">
            <span>2</span>
            <div>
              <h2>Order details</h2>
              <p>Enter the information required for this service.</p>
            </div>
          </div>
          <div className="field">
            <label>Public content link</label>
            <input
              name="link"
              type="url"
              placeholder="https://instagram.com/p/..."
            />
          </div>
          {!packageType && (
            <div className="field">
              <label>Quantity</label>
              <input
                name="quantity"
                type="number"
                min={selected?.min || 1}
                max={selected?.max}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={
                  selected
                    ? `${selected.min} – ${selected.max}`
                    : "Select a service"
                }
              />
            </div>
          )}
          <button
            disabled={loading || !selected}
            className="button"
            type="submit"
          >
            {loading ? "Submitting..." : "Place order"}
          </button>
          <div className="order-confirmation-note" role="note">
            <span aria-hidden="true">i</span>
            <p>Please confirm the service, link, and quantity before placing your order. Submitted orders cannot be cancelled.</p>
          </div>
        </form>
        <aside className="dash-panel order-summary">
          <span className="eyebrow">Order total</span>
          {selected ? (
            <>
              <h2>{selected.name}</h2>
              <p>
                {selected.category} · {selected.type}
              </p>
              <dl>
                <div>
                  <dt>Your rate</dt>
                  <dd>{naira(Number(selected.rate))} / 1K</dd>
                </div>
                <div>
                  <dt>Allowed range</dt>
                  <dd>
                    {Number(selected.min).toLocaleString()} –{" "}
                    {Number(selected.max).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt>Refill</dt>
                  <dd>{selected.refill ? "Available" : "Not available"}</dd>
                </div>
                <div className="summary-total">
                  <dt>Wallet charge</dt>
                  <dd>{naira(estimate)}</dd>
                </div>
              </dl>
            </>
          ) : (
            <div className="dash-empty mini">
              <span>₦</span>
              <h3>Select a service</h3>
              <p>Your rate and total will appear here.</p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

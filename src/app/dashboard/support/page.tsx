"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { api, User } from "@/lib/api";

const questions = [
  { id: "payment", title: "I sent money but my wallet has not been credited", answer: null, form: true },
  { id: "withdrawal", title: "Can I withdraw my funds or get a refund to my bank?", answer: <>Wallet deposits are for purchasing services only. We do not offer refunds or withdrawals to bank accounts.</> },
  { id: "order", title: "My order is delayed, incomplete or marked completed incorrectly", answer: <>Check the latest status in <Link href="/dashboard/orders">Orders</Link>. Delivery times are estimates and vary by service. Keep the destination public and avoid changing its link or placing overlapping orders.</> },
  { id: "refill", title: "My followers or engagement dropped. Can I request a refill?", answer: <>Refills apply only to services that include them and are subject to their conditions and provider acceptance. Use the refill action in <Link href="/dashboard/orders">Orders</Link> and track it in <Link href="/dashboard/refills">Refills</Link>.</> },
  { id: "cancel", title: "Can I cancel an order or change the link?", answer: <>Cancellation is only available where supported and is subject to provider acceptance. Orders may start automatically and changes cannot be guaranteed. For a problem with a submitted order, email support@smmpanel.ng with the order ID.</> },
  { id: "number", title: "My temporary number has not arrived or I have not received an SMS", answer: <>If no SMS arrives before your rental expires, your funds are automatically refunded to your wallet. You can then try again with a new number.</> },
];

function SupportForm({ topic, email, reference }: { topic: string; email: string; reference?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("topic", topic);
    const receipt = data.get("receipt");
    setError(""); setSuccess("");
    if (receipt instanceof File && receipt.size > 5 * 1024 * 1024) { setError("Choose a receipt no larger than 5 MB."); return; }
    setBusy(true);
    try {
      const result = await api<{ message: string; reference: string }>("/api/support", { method: "POST", body: data });
      setSuccess(`${result.message} Request reference: ${result.reference}`);
      form.reset();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to send your request. Please try again."); }
    finally { setBusy(false); }
  }
  return <form className="support-form" onSubmit={submit}>
    {topic === "payment" && <div className="field"><label htmlFor={`${topic}-receipt`}>Payment receipt</label><input id={`${topic}-receipt`} name="receipt" type="file" accept="image/jpeg,image/png,application/pdf" required aria-describedby="receipt-help"/><small id="receipt-help">JPG, PNG or PDF, up to 5 MB. Include the amount, date and transaction reference.</small></div>}
    <div className="field"><label htmlFor={`${topic}-email`}>Your account email</label><input id={`${topic}-email`} type="email" value={email} readOnly required/></div>
    {reference && <div className="field"><label htmlFor={`${topic}-reference`}>{reference}</label><input id={`${topic}-reference`} name="reference" required maxLength={150}/></div>}
    {topic !== "payment" && <div className="field"><label htmlFor={`${topic}-message`}>Tell us what happened</label><textarea id={`${topic}-message`} name="message" required minLength={10} maxLength={5000} rows={4} placeholder="Include dates and relevant details. Never include passwords or OTPs."/></div>}
    {error && <p className="support-feedback error" role="alert">{error}</p>}
    {success && <p className="support-feedback success" role="status">{success}</p>}
    <button className="button" disabled={busy || !email} type="submit">{busy ? "Sending request…" : "Send to support"}</button>
  </form>;
}

export default function SupportPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { api<{ user: User }>("/api/auth/me").then(({ user }) => setEmail(user.email)).catch(() => setError("Unable to load your account email. Reload the page or email support directly.")); }, []);
  return <div className="support-page">
    <div className="dash-heading"><div><span className="dash-kicker">Help centre</span><h1>Contact Support</h1><p>Find an answer or send us the details so we can help.</p></div></div>
    {error && <p role="alert" className="support-feedback error">{error}</p>}
    <section className="dash-panel support-questions" aria-label="Support questions">
      {questions.map(question => <details key={question.id} className="support-question" name="support-question"><summary>{question.title}</summary><div className="support-answer">{question.answer && <p>{question.answer}</p>}{question.form && <SupportForm topic={question.id} email={email} />}</div></details>)}
    </section>
    <p className="support-contact">Still need to contact us? Email <a href="mailto:support@smmpanel.ng">support@smmpanel.ng</a></p>
  </div>;
}

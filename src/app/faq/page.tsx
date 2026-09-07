import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about funding, ordering, delivery, refills, pricing, and accounts on SMM Panel Nigeria.",
};

const questions = [
  ["What is SMM Panel Nigeria?", "SMM Panel Nigeria is a reseller platform where you can fund a wallet in Naira and order social media marketing services from one dashboard."],
  ["How do I place an order?", "Create an account, fund your wallet, open New order, choose a category and service, then enter the correct public link and quantity. Review everything carefully before placing the order."],
  ["How quickly will my order start?", "Start and delivery times depend on the selected service and current provider capacity. An order may remain pending while it enters the fulfilment queue."],
  ["Can I cancel an order after placing it?", "Orders are submitted automatically and cannot be cancelled from the panel. Confirm the service, link, and quantity before you place an order."],
  ["What does refill mean?", "A refill may restore eligible drops during the service’s refill period. Only services marked as refillable qualify, and approval remains subject to the fulfilment provider’s checks."],
  ["How do wallet payments work?", "Wallet deposits are made in Naira and credited only after the payment has been verified on the server. Never close the payment window until the transaction finishes."],
  ["Why has my wallet not been credited?", "A payment may still be processing or may not have completed successfully. Check Wallet History first. If a successful payment is missing, contact support with its payment reference."],
  ["What link should I submit?", "Use the exact public profile, post, video, page, or channel link requested by the service. Private, deleted, restricted, or incorrect links may prevent delivery."],
  ["Can I place two orders on the same link?", "Wait for the first order to finish before placing another order for the same service and link. Overlapping orders can produce inaccurate start counts or delivery results."],
  ["How can I contact support?", "Sign in and open Contact Support from the dashboard sidebar. Include your order ID or payment reference and a short description of the issue."],
] as const;

export default function FAQPage() {
  return (
    <PublicShell>
      <section className="section-pad legal-section">
        <div className="shell faq-list">
          <SectionHeading
            eyebrow="FAQ"
            title="Common customer questions"
            description="Everything you need to know before placing a social media service order with SMM Panel Nigeria."
          />
          <div className="faq-accordion">
            {questions.map(([question, answer]) => (
              <details key={question} className="faq-item">
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

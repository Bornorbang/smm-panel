/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCardLink } from "@/components/service-card-link";
import { AuthCta } from "@/components/auth-cta";
const platforms = [
  ["Instagram", "instagram"],
  ["TikTok", "tiktok"],
  ["YouTube", "youtube"],
  ["Facebook", "facebook"],
  ["X", "x"],
  ["Telegram", "telegram"],
  ["LinkedIn", "linkedin"],
  ["Spotify", "spotify"],
];
const features = [
  [
    "01",
    "Browse with confidence",
    "Compare current Naira rates, delivery limits, refill support, and cancellation options.",
  ],
  [
    "02",
    "Place orders quickly",
    "Choose a service, add your public link, and review the details before submitting.",
  ],
  [
    "03",
    "Track every order",
    "See progress, remaining quantity, charges, and status from one straightforward dashboard.",
  ],
];
const services = [
  ["Instagram", "Followers · Likes · Views", "instagram"],
  ["TikTok", "Followers · Views · Shares", "tiktok"],
  ["YouTube", "Subscribers · Views · Watch time", "youtube"],
  ["Facebook", "Followers · Reactions · Views", "facebook"],
  ["X / Twitter", "Followers · Likes · Reposts", "x"],
  ["Telegram", "Members · Views · Reactions", "telegram"],
];
export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SMM Panel Nigeria",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
    description:
      "Affordable social media marketing services with Naira payments and live order tracking.",
    inLanguage: "en-NG",
  };
  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="hero section-pad">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="hero-subtitle">
              <span>Built in Nigeria</span>
              <strong>Social media growth, paid in Naira</strong>
            </div>
            <h1>
              The <span>Cheapest SMM panel in Nigeria</span> for everyday
              growth.
            </h1>
            <p>
              Order Instagram followers, TikTok views, YouTube engagement and
              more from a simple Nigerian SMM panel. Fund in Naira, see your
              price before paying, and follow delivery from your dashboard.
            </p>
            <div className="hero-actions">
              <AuthCta arrow />
              <Link href="/signup" className="button">
                Create your account →
              </Link>
              <Link href="/services" className="button button-secondary">
                Browse services
              </Link>
            </div>
            <div className="micro-proof">
              <span className="avatar-stack">
                <i>J</i>
                <i>M</i>
                <i>A</i>
                <i>+</i>
              </span>
              <span>
                <strong>Built for Nigerian creators and resellers</strong>
                <small>Simple Naira payments and clear order tracking</small>
              </span>
            </div>
          </div>
          <div className="ai-console">
            <img
              src="/hero-social-transparent.png"
              alt="Cheapest SMM panel in Nigeria"
            />
          </div>
        </div>
      </section>
      <section className="trust-strip">
        <div className="shell platform-logos">
          {platforms.map(([name, slug]) => (
            <div title={name} key={name}>
              <img
                src={`https://cdn.simpleicons.org/${slug}`}
                alt={`${name} logo`}
              />
            </div>
          ))}
          {platforms.map(([name, slug]) => (
            <div className="platform-logo-clone" title={name} key={`${name}-clone`} aria-hidden="true">
              <img src={`https://cdn.simpleicons.org/${slug}`} alt="" />
            </div>
          ))}
        </div>
      </section>
      <section className="section-pad benefits-section">
        <div className="shell">
          <SectionHeading
            eyebrow="Why choose SMM Panel"
            title="Affordable services without the clutter"
            description="Everything you need to choose a service, place an order and monitor delivery is kept in one place."
          />
          <div className="feature-grid">
            {features.map(([n, title, body]) => (
              <article className="feature-card" key={title}>
                <span className="feature-icon">{n}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <Link href="/features">See how it works →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad soft-section">
        <div className="shell how-grid">
          <div>
            <span className="eyebrow">How our Nigerian SMM panel works</span>
            <h2>From payment to delivery in three steps.</h2>
            <p className="section-lead">
              Create an account, fund your wallet securely in Naira, and order
              the social media service that fits your campaign.
            </p>
            <div className="steps">
              {[
                [
                  "01",
                  "Choose a service",
                  "Compare rates, minimum quantities and refill options.",
                ],
                [
                  "02",
                  "Enter your link",
                  "Provide the public social media link and quantity.",
                ],
                [
                  "03",
                  "Follow your order",
                  "Track its live status and remaining delivery.",
                ],
              ].map(([n, t, d]) => (
                <div className="step" key={n}>
                  <span>{n}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/signup" className="button">
              Get started →
            </Link>
          </div>
          <div className="signal-card">
            <img
              src="/payment-delivery.jpg"
              alt="Cheapest SMM panel in Nigeria"
            />
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            eyebrow="Available networks"
            title="Social media services in one panel"
            description="Browse services for the major social platforms used by Nigerian creators, businesses, agencies and resellers."
          />
          <div className="services-grid">
            {services.map(([name, meta, slug]) => (
              <ServiceCardLink key={name} name={name} meta={meta} slug={slug} />
            ))}
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="shell cta-card">
          <span className="eyebrow light">Start today</span>
          <h2>Use SMM Panel Nigeria for your next campaign.</h2>
          <p>
            Create an account, fund in Naira and browse thousands of available
            social media services.
          </p>
          <div>
            <Link href="/signup" className="button button-white">
              Create your account →
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

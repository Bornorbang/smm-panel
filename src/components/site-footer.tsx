import Link from "next/link";
import { Logo } from "./logo";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Logo />
          <p className="footer-copy">
            Affordable social media growth services, Naira payments, and
            reliable order tracking.
          </p>
        </div>
        <div>
          <h4>Product</h4>
          <Link href="/features">Features</Link>
          <Link href="/services">Services</Link>
          <Link href="/pricing">Pricing</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <div>
          <h4>Get started</h4>
          <Link href="/signup">Create account</Link>
          <Link href="/login">Log in</Link>
          <a href="mailto:hello@smmpanel.ng">hello@smmpanel.ng</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>
          © 2026 SMM Panel by{" "}
          <a
            href="https://hostingnigeria.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hosting Nigeria
          </a>
          . All rights reserved.
        </span>
      </div>
    </footer>
  );
}

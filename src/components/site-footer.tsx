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
          <Link href="/api-docs">API Documentation</Link>
        </div>
        <div>
          <h4>Support</h4>
          <Link href="/faq">FAQ</Link>
          <a href="https://whatsapp.com/channel/0029Vb7uTgC30LKUfBRj3p2L" target="_blank" rel="noopener noreferrer">Join Channel</a>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
        <div className="footer-other">
          <h4>Other Services</h4>
          <a href="https://portal.hostingnigeria.com/domainchecker.php" target="_blank" rel="noopener noreferrer">Domain Registration</a>
          <a href="https://portal.hostingnigeria.com/index.php?rp=/store/web-hosting" target="_blank" rel="noopener noreferrer">Web Hosting</a>
          <a href="https://portal.hostingnigeria.com/index.php?rp=/store/wordpress-hosting" target="_blank" rel="noopener noreferrer">WordPress Hosting</a>
          <a href="https://hostingnigeria.com/temporary-hosting-plan/" target="_blank" rel="noopener noreferrer">Temporary Hosting</a>
          <a href="https://portal.hostingnigeria.com/index.php?rp=/store/ssl-certificates" target="_blank" rel="noopener noreferrer">SSL Certificate</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>
          © 2026 <Link href="/">SMM Panel</Link>. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

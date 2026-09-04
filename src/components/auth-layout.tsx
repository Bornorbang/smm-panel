import Link from "next/link";
import { Logo } from "./logo";

type AuthLayoutProps = {
  children: React.ReactNode;
  imageUrl: string;
  caption: string;
};

export function AuthLayout({ children, imageUrl, caption }: AuthLayoutProps) {
  return <main className="auth-page">
    <aside className="auth-art" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="auth-image-shade" />
      <Logo />
      <div className="auth-image-caption">
        <p>{caption}</p>
        <span>SMM Panel</span>
      </div>
      <Link className="auth-back-link" href="/">← Back home</Link>
    </aside>
    <section className="auth-main">{children}</section>
  </main>;
}

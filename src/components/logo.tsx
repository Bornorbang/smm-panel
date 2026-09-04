import Link from "next/link";
import Image from "next/image";

export function Logo({ short = false }: { short?: boolean }) {
  return (
    <Link href="/" className="logo">
      <Image
        className="logo-icon"
        src="/smm-panel.png"
        width={32}
        height={32}
        alt="SMM Panel Nigeria"
      />
      <span>{short ? "SMM Panel" : "SMM Panel Nigeria"}</span>
    </Link>
  );
}

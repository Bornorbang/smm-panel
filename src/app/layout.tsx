import type { Metadata } from "next";
import { ThemeScript } from "@/components/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"),
  title: { default: "SMM Panel Nigeria | Affordable Social Media Growth", template: "%s | SMM Panel Nigeria" },
  description: "SMM Panel Nigeria provides affordable Instagram, TikTok, YouTube, Facebook, Telegram and X services with Naira payments and live order tracking.",
  keywords: ["SMM panel Nigeria","cheapest SMM panel in Nigeria","social media marketing panel Nigeria","buy Instagram followers Nigeria","buy TikTok views Nigeria"],
  applicationName: "SMM Panel",
  icons: { icon: [{url:"/smm-panel.png",type:"image/png"}], shortcut:"/smm-panel.png", apple:"/smm-panel.png" },
  authors: [{name:"SMM Panel Nigeria"}],
  creator: "SMM Panel Nigeria",
  publisher: "SMM Panel Nigeria",
  alternates: {canonical:"/"},
  openGraph: {type:"website",locale:"en_NG",siteName:"SMM Panel Nigeria",title:"SMM Panel Nigeria | Affordable Social Media Growth",description:"Fund in Naira, choose a social media service and track every order from one simple Nigerian SMM panel.",url:"/"},
  twitter: {card:"summary_large_image",title:"SMM Panel Nigeria",description:"Affordable social media services with Naira payments and live order tracking."},
  robots: {index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

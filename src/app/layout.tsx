import type { Metadata } from "next";
import { ThemeScript } from "@/components/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"),
  title: { default: "Cheapest SMM panel in Nigeria | SMM Panel Nigeria", template: "%s | SMM Panel Nigeria" },
  description: "Boost Instagram followers and TikTok booster growth with SMM Panel Nigeria, the Cheapest SMM panel in Nigeria & Africa for IG, TikTok, FB, YouTube & more.",
  keywords: ["SMM panel Nigeria","cheapest SMM panel in Nigeria","social media marketing panel Nigeria","buy Instagram followers Nigeria","buy TikTok views Nigeria"],
  applicationName: "SMM Panel",
  icons: { icon: [{url:"/smm-panel.png",type:"image/png"}], shortcut:"/smm-panel.png", apple:"/smm-panel.png" },
  authors: [{name:"SMM Panel Nigeria"}],
  creator: "SMM Panel Nigeria",
  publisher: "SMM Panel Nigeria",
  alternates: {canonical:"/"},
  openGraph: {type:"website",locale:"en_NG",siteName:"SMM Panel Nigeria",title:"Cheapest SMM panel in Nigeria | SMM Panel Nigeria",description:"Boost Instagram followers and TikTok booster growth with SMM Panel Nigeria, the Cheapest SMM panel in Nigeria & Africa for IG, TikTok, FB, YouTube & more.",url:"/"},
  twitter: {card:"summary_large_image",title:"Cheapest SMM panel in Nigeria | SMM Panel Nigeria",description:"Boost Instagram followers and TikTok booster growth with SMM Panel Nigeria, the Cheapest SMM panel in Nigeria & Africa for IG, TikTok, FB, YouTube & more."},
  robots: {index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Google tag is included once here for every page. */}
        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CLFQSHZ3M0" />
        <script
          id="google-tag-config"
          dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CLFQSHZ3M0');
          ` }}
        />
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

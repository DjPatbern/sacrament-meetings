import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const productionHost =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(productionHost),
  title: {
    default: "Sacrament Meetings | Meadowbrook Ward",
    template: "%s | Meadowbrook Ward",
  },
  description: "Sacrament meeting programs for the Meadowbrook Ward.",
  openGraph: {
    type: "website",
    siteName: "Meadowbrook Ward Sacrament Meeting Planner",
    title: "Sacrament Meetings | Meadowbrook Ward",
    description:
      "Prepare, manage, and share Meadowbrook Ward sacrament meeting programs.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Meadowbrook Ward Sacrament Meeting Planner",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Header />
        <div id="main-content" className="site-content">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

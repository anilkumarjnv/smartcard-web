import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Production URL - update this when deploying
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cardfil.com";

export const metadata: Metadata = {
  // Primary Meta Tags
  title: {
    default: "Cardfil – Digital Business Card to Track Views, Leads & Interest",
    template: "%s | Cardfil",
  },
  description: "Create a digital business card that helps you stay remembered. Track profile views, capture leads, and convert connections with Cardfil.",
  keywords: ["digital business card", "smart business card", "digital visiting card", "business card with analytics", "digital card with leads"],
  authors: [{ name: "Cardfil" }],
  creator: "Cardfil",
  publisher: "Cardfil",

  // Canonical URL
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },

  // Open Graph - for WhatsApp, LinkedIn, Facebook
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Cardfil",
    title: "Cardfil – Digital Business Card That Converts",
    description: "Track who views your card, capture leads, and turn visibility into value.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Cardfil - Digital Business Card That Converts",
        type: "image/png",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Cardfil – Digital Business Card That Converts",
    description: "Track who views your card, capture leads, and turn visibility into value.",
    images: [`${SITE_URL}/og-image.png`],
    creator: "@cardfil",
  },

  // Robots - allow indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
  },

  // Verification (add these when you have the codes)
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// JSON-LD Structured Data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Cardfil",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Digital business card that helps users track profile views, capture leads, and convert professional connections.",
  url: SITE_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "100",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-center" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

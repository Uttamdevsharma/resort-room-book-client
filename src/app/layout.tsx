import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CoxBay Resort - Luxury Room Reservations",
    template: "%s | CoxBay Resort",
  },
  description: "Book your perfect getaway at CoxBay Resort. Discover premium accommodations, exceptional service, and unforgettable experiences.",
  keywords: ["resort", "hotel", "booking", "reservation", "luxury", "travel", "vacation"],
  authors: [{ name: "CoxBay Resort" }],
  creator: "CoxBay Resort",
  publisher: "CoxBay Resort",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://coxbayresort.com",
    siteName: "CoxBay Resort",
    title: "CoxBay Resort - Luxury Room Reservations",
    description: "Book your perfect getaway at CoxBay Resort.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CoxBay Resort - Luxury Room Reservations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoxBay Resort - Luxury Room Reservations",
    description: "Book your perfect getaway at CoxBay Resort.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { AuthProvider } from "@/lib/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
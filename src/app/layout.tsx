import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "ResortStay - Luxury Resort Room Reservations",
    template: "%s | ResortStay",
  },
  description: "Book your perfect getaway at our luxury resorts. Discover premium accommodations, exceptional service, and unforgettable experiences.",
  keywords: ["resort", "hotel", "booking", "reservation", "luxury", "travel", "vacation"],
  authors: [{ name: "ResortStay" }],
  creator: "ResortStay",
  publisher: "ResortStay",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resortstay.com",
    siteName: "ResortStay",
    title: "ResortStay - Luxury Resort Room Reservations",
    description: "Book your perfect getaway at our luxury resorts.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ResortStay - Luxury Resort Room Reservations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResortStay - Luxury Resort Room Reservations",
    description: "Book your perfect getaway at our luxury resorts.",
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
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
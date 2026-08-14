import Link from "next/link";
import { MapPin, Phone, Mail, ArrowUpRight, ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/brand/LogoMark";
import { Wordmark } from "@/components/brand/Wordmark";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
  ],
  explore: [
    { label: "Home", href: "/" },
    { label: "Rooms & Suites", href: "/rooms" },
    { label: "Facilities", href: "/facilities" },
    { label: "Book Your Stay", href: "/rooms" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Cancellation Policy", href: "/cancellation-policy" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socials = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    ),
  },
];

const amenities = [
  "Free WiFi",
  "Swimming Pool",
  "Spa & Wellness",
  "Fitness Center",
  "Restaurant",
  "Room Service",
  "Parking",
  "Concierge",
];

const navColumns: { heading: string; links: { label: string; href: string }[]; aria: string }[] = [
  { heading: "Explore", links: footerLinks.explore, aria: "Explore links" },
  { heading: "Support", links: footerLinks.support, aria: "Support links" },
  { heading: "Company", links: footerLinks.company, aria: "Company links" },
  { heading: "Legal", links: footerLinks.legal, aria: "Legal links" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-background text-foreground" role="contentinfo">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_srgb,var(--primary)_8%,transparent),transparent_55%)]" />

      <div className="container relative pt-14 pb-10 sm:pt-16 lg:pt-20 lg:pb-12">
        {/* Top row: logo + tagline on the left, social icons on the top-right */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link
            href="/"
            className="group inline-flex w-fit cursor-pointer items-center gap-3"
            aria-label="CoxBay Resort - Home"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-primary-hover group-hover:shadow-md group-active:scale-95">
              <LogoMark className="h-6 w-6" />
            </div>
            <Wordmark tone="foreground" size="lg" />
          </Link>

          <div className="flex items-center gap-2.5">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${social.label}`}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10 hover:text-primary hover:shadow-md active:scale-90"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* 5-column layout: Brand, Explore, Support, Company, Legal */}
        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:mt-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:gap-x-12 xl:gap-x-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 lg:max-w-xs">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your perfect getaway starts here. Discover luxury accommodations,
              exceptional service, and unforgettable experiences at our premium resorts worldwide.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2" role="list">
              {amenities.map((amenity) => (
                <li key={amenity}>
                  <span className="inline-flex items-center rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary">
                    {amenity}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {navColumns.map((column) => (
            <nav key={column.heading} aria-label={column.aria}>
              <h3 className="mb-5 text-sm font-semibold text-foreground">{column.heading}</h3>
              <ul className="space-y-3" role="list">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex cursor-pointer items-center gap-1 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                    >
                      <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
                        {link.label}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Divider + bottom row: contact info, copyright, Secure & Trusted */}
        <div className="mt-12 border-t border-border pt-8 lg:mt-14 lg:pt-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <ul
              className="flex flex-col gap-2.5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2"
              role="list"
            >
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>123 Palm Beach Road, Coastal Bay</span>
              </li>
              <li>
                <a
                  href="tel:+18001234567"
                  className="inline-flex cursor-pointer items-center gap-2 text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
                  <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                  +1 (800) 123-4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@coxbayresort.com"
                  className="inline-flex cursor-pointer items-center gap-2 text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
                  <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                  hello@coxbayresort.com
                </a>
              </li>
            </ul>

            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} CoxBay Resort. All rights reserved.
            </p>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Secure &amp; Trusted
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

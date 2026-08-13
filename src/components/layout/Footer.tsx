import Link from "next/link";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

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
    { label: "Accessibility", href: "/accessibility" },
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

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-navy-950 text-slate-300" role="contentinfo">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-600 to-indigo-600" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.12),transparent_55%)]" />
      <div className="container relative py-14 lg:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="group mb-4 inline-flex cursor-pointer items-center gap-2 text-xl font-extrabold tracking-tight text-white"
              aria-label="ResortStay - Home"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-blue-950/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-900/60">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span>ResortStay</span>
            </Link>
            <p className="mb-5 max-w-xs text-sm leading-relaxed text-slate-400">
              Your perfect getaway starts here. Discover luxury accommodations,
              exceptional service, and unforgettable experiences at our premium resorts worldwide.
            </p>

            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="h-4 w-4 flex-shrink-0 text-blue-400" />
                <span>123 Palm Beach Road, Coastal Bay</span>
              </li>
              <li>
                <a href="tel:+18001234567" className="inline-flex cursor-pointer items-center gap-2 text-slate-400 transition-colors duration-200 hover:text-white">
                  <Phone className="h-4 w-4 flex-shrink-0 text-blue-400" />
                  +1 (800) 123-4567
                </a>
              </li>
              <li>
                <a href="mailto:hello@resortstay.com" className="inline-flex cursor-pointer items-center gap-2 text-slate-400 transition-colors duration-200 hover:text-white">
                  <Mail className="h-4 w-4 flex-shrink-0 text-blue-400" />
                  hello@resortstay.com
                </a>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-400 transition-colors duration-200 hover:bg-primary/20 hover:text-blue-100"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <nav aria-label="Explore links">
            <h3 className="mb-4 flex items-center gap-1.5 font-semibold text-white">
              Explore
              <ArrowUpRight className="h-3.5 w-3.5 text-blue-400" />
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex cursor-pointer items-center gap-1 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support links">
            <h3 className="mb-4 font-semibold text-white">Support</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex cursor-pointer items-center gap-1 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company links">
            <h3 className="mb-4 font-semibold text-white">Company</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex cursor-pointer items-center gap-1 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal links">
            <h3 className="mb-4 font-semibold text-white">Legal</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex cursor-pointer items-center gap-1 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">
              &copy; {currentYear} ResortStay. All rights reserved.
            </p>

            <div className="flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 text-slate-400 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-transparent hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-blue-950/50 active:scale-90"
                  aria-label={`Follow us on ${social.label}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-5">
              <Link
                href="/privacy"
                className="cursor-pointer text-sm text-slate-400 transition-colors duration-200 hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="cursor-pointer text-sm text-slate-400 transition-colors duration-200 hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="cursor-pointer text-sm text-slate-400 transition-colors duration-200 hover:text-white"
              >
                Cookie Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

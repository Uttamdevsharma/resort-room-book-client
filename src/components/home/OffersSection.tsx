"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgePercent,
  Check,
  Copy,
  Sparkles,
  Tag,
} from "lucide-react";
import { couponsApi, PublicCouponOffer } from "@/lib/api/coupons";
import { Reveal } from "./Reveal";

const MAX_OFFERS = 3;

function formatDiscount(offer: PublicCouponOffer): string {
  return offer.discountType === "PERCENTAGE"
    ? `${offer.discountValue}% OFF`
    : `৳${offer.discountValue.toLocaleString()} OFF`;
}

function offerTitle(offer: PublicCouponOffer): string {
  return offer.discountType === "PERCENTAGE"
    ? `Save ${offer.discountValue}% on your stay`
    : `Save ৳${offer.discountValue.toLocaleString()} on your stay`;
}

function offerDescription(offer: PublicCouponOffer): string {
  return offer.discountType === "PERCENTAGE"
    ? `Take ${offer.discountValue}% off the price of your room and settle into longer, slower stays without the extra cost.`
    : `Get ৳${offer.discountValue.toLocaleString()} off your booking and trade an ordinary getaway for a truly unhurried escape.`;
}

function CouponCodeChip({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — code is still visible in the chip.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy code ${code}`}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-sm font-semibold tracking-wider text-primary transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white"
    >
      <Tag className="h-3.5 w-3.5" aria-hidden="true" />
      {code}
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
      )}
      <span className="sr-only">{copied ? "Copied!" : "Copy coupon code"}</span>
    </button>
  );
}

function OfferSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-navy-900/60 p-8" aria-hidden="true">
      <div className="skeleton-shimmer h-3 w-24 rounded bg-white/10" />
      <div className="skeleton-shimmer mt-6 h-8 w-2/3 rounded bg-white/10" />
      <div className="skeleton-shimmer mt-3 h-3 w-full rounded bg-white/10" />
      <div className="skeleton-shimmer mt-2 h-3 w-3/4 rounded bg-white/10" />
      <div className="skeleton-shimmer mt-8 h-10 w-40 rounded-full bg-white/10" />
    </div>
  );
}

export function OffersSection() {
  const [offers, setOffers] = useState<PublicCouponOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadOffers = async () => {
    setError(false);
    setLoading(true);
    try {
      const res = await couponsApi.listPublicOffers(MAX_OFFERS);
      setOffers(res.data ?? []);
    } catch (err) {
      console.error("Error loading offers", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    couponsApi
      .listPublicOffers(MAX_OFFERS)
      .then((res) => {
        if (!cancelled) setOffers(res.data ?? []);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Error loading offers", err);
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && !error && offers.length === 0) return null;

  const featured = offers[0];
  const rest = offers.slice(1, MAX_OFFERS);

  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-28">
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div className="container relative">
        <Reveal className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary/60" aria-hidden="true" />
              Offers &amp; Packages
            </span>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
              Curated offers for an{" "}
              <span className="italic text-blue-300">even slower</span> stay
            </h2>
            <p className="mt-3 text-blue-100/70">
              Exclusive savings and added comfort — available now for direct
              bookings.
            </p>
          </div>
          <Link href="/rooms" className="shrink-0">
            <button
              type="button"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-2.5 font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-primary/60 hover:bg-white/10"
            >
              View All Rooms
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </Link>
        </Reveal>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2 lg:col-span-1">
              <div className="relative min-h-[460px] overflow-hidden rounded-3xl border border-white/10">
                <OfferSkeleton />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <OfferSkeleton />
              <OfferSkeleton />
            </div>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-white/10 bg-navy-900/60 py-12 text-center">
            <p className="text-blue-100/70">Unable to load offers right now.</p>
            <button
              type="button"
              onClick={loadOffers}
              className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {featured && (
              <Reveal
                className={
                  rest.length > 0
                    ? "h-full md:col-span-2 lg:col-span-1"
                    : "h-full md:col-span-2"
                }
              >
                {/* ---------- Featured Offer ---------- */}
                <article className="group relative flex h-full min-h-[420px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40 lg:min-h-[540px]">
                  <Image
                    src="/offers/featured-offer.jpg"
                    alt="Featured offer — luxury resort stay"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />

                  <div className="relative flex w-full flex-col justify-between p-8 sm:p-10 lg:p-12">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        Featured Offer
                      </span>
                    </div>

                    <div className="max-w-xl">
                      <p className="font-display text-5xl font-medium tracking-tight text-white sm:text-6xl lg:text-7xl">
                        {featured && formatDiscount(featured)}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                        {featured && offerTitle(featured)}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-blue-100/80 sm:text-base">
                        {featured && offerDescription(featured)}
                      </p>

                      <div className="mt-7 flex flex-wrap items-center gap-4">
                        {featured && <CouponCodeChip code={featured.code} />}
                        <Link href="/rooms">
                          <button
                            type="button"
                            className="group/cta inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-primary to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-950/50 transition-all duration-200 hover:from-primary-hover hover:to-blue-700 active:scale-[0.98]"
                          >
                            Book Your Stay
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="flex flex-col gap-6">
                {rest.map((offer, i) => (
                  <Reveal key={offer.id} delay={i * 120} className="flex-1">
                    {/* ---------- Standard Offer ---------- */}
                    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-navy-900/80 p-7 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                      />

                      <div className="relative">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                          <BadgePercent className="h-3.5 w-3.5" aria-hidden="true" />
                          {formatDiscount(offer)}
                        </span>
                        <h3 className="mt-4 text-xl font-semibold text-white transition-colors group-hover:text-blue-200">
                          {offerTitle(offer)}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-blue-100/60 line-clamp-3">
                          {offerDescription(offer)}
                        </p>
                      </div>

                      <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                        <CouponCodeChip code={offer.code} />
                        <Link href="/rooms">
                          <span className="group/cta inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-blue-300">
                            Book Your Stay
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                          </span>
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

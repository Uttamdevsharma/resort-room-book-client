"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  Clock,
  Dumbbell,
  Flower2,
  Palmtree,
  RefreshCw,
  Umbrella,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "./Reveal";
import { Facility } from "@/lib/api/facilities";

/* ---------------------------------------------------------------------------
 * Asset mapping — local facility imagery keyed by facility name/icon.
 * The Facility API returns no media, so we map known facility names to the
 * curated assets in /public/facilities and fall back gracefully.
 * ------------------------------------------------------------------------- */
export const FACILITY_IMAGES: Record<string, string> = {
  pool: "/facilities/pool.avif",
  spa: "/facilities/spa.jpg",
  dining: "/facilities/dining.jpg",
  fitness: "/facilities/fitness.jpg",
  beach: "/facilities/beatch.jfif",
  kids: "/facilities/kidszone.jfif",
};

export const FALLBACK_FACILITY_IMAGE = FACILITY_IMAGES.pool;

export function facilityImage(facility: Facility): string {
  if (facility.imageUrl) return facility.imageUrl;
  const name = facility.name.toLowerCase();
  if (name.includes("pool")) return FACILITY_IMAGES.pool;
  if (name.includes("spa") || name.includes("wellness")) return FACILITY_IMAGES.spa;
  if (name.includes("restaurant") || name.includes("dining") || name.includes("caf")) {
    return FACILITY_IMAGES.dining;
  }
  if (name.includes("fitness") || name.includes("gym")) return FACILITY_IMAGES.fitness;
  if (name.includes("beach")) return FACILITY_IMAGES.beach;
  if (name.includes("kid") || name.includes("play")) return FACILITY_IMAGES.kids;
  return FALLBACK_FACILITY_IMAGE;
}

export function facilityIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("pool")) return Waves;
  if (n.includes("spa") || n.includes("wellness")) return Flower2;
  if (n.includes("restaurant") || n.includes("dining") || n.includes("caf")) {
    return UtensilsCrossed;
  }
  if (n.includes("fitness") || n.includes("gym")) return Dumbbell;
  if (n.includes("beach")) return Umbrella;
  if (n.includes("kid") || n.includes("play")) return Baby;
  return Palmtree;
}

function FacilityCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
      aria-hidden="true"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <div className="skeleton-shimmer absolute inset-0" />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <span className="skeleton-shimmer block h-11 w-11 rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <span className="skeleton-shimmer block h-4 w-2/3 rounded bg-muted" />
            <span className="skeleton-shimmer block h-3 w-24 rounded bg-muted" />
          </div>
        </div>
        <span className="skeleton-shimmer block h-3 w-full rounded bg-muted" />
        <span className="skeleton-shimmer block h-3 w-5/6 rounded bg-muted" />
        <span className="skeleton-shimmer block h-3 w-2/3 rounded bg-muted" />
      </div>
    </div>
  );
}

export interface FacilityDirectoryProps {
  facilities: Facility[];
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
}

export function FacilityDirectory({
  facilities,
  isLoading,
  hasError,
  onRetry,
}: FacilityDirectoryProps) {
  return (
    <section id="facilities-directory" className="scroll-mt-20 py-16 lg:py-24">
      <div className="container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Facility Directory
          </span>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Everything you need is right here
          </h2>
          <p className="mt-3 text-muted-foreground">
            A hand-picked collection of spaces, services, and experiences — all part of your
            stay and ready whenever you are.
          </p>
        </Reveal>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <span className="sr-only" role="status" aria-live="polite">
              Loading resort facilities...
            </span>
            {Array.from({ length: 4 }, (_, i) => (
              <FacilityCardSkeleton key={i} />
            ))}
          </div>
        ) : hasError ? (
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-sm" role="alert">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Couldn&apos;t load facilities</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We couldn&apos;t load the resort facilities right now. Please check your
              connection and try again.
            </p>
            <Button type="button" variant="primary" onClick={onRetry} className="mt-6 gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        ) : facilities.length === 0 ? (
          <div
            className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center shadow-sm"
            role="status"
            aria-live="polite"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Palmtree className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Facilities coming soon</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We&apos;re putting the finishing touches on our resort facilities. In the
              meantime, explore our rooms and suites.
            </p>
            <Link href="/rooms" className="mt-6 inline-block">
              <Button variant="outline" className="gap-2">
                Explore Rooms
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid animate-fade-in grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {facilities.map((facility) => {
              const Icon = facilityIcon(facility.name);
              const image = facilityImage(facility);
              return (
                <div
                  key={facility.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      src={image}
                      alt={facility.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                      unoptimized={!image.startsWith("/")}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 opacity-0 transition-all duration-300 translate-y-3 group-hover:translate-y-0 group-hover:opacity-100">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                          Guest Access
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-white">{facility.name}</p>
                      </div>
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                          {facility.name}
                        </h3>
                        {facility.openingHours && (
                          <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {facility.openingHours}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {facility.description ||
                        "Thoughtfully designed for your comfort and relaxation during your stay."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

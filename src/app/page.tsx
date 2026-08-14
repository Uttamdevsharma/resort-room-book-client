"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AboutSection, FacilityDirectory, GallerySection, OffersSection } from "@/components/home";
import { roomTypesApi, RoomType } from "@/lib/api/roomTypes";
import { facilitiesApi, Facility } from "@/lib/api/facilities";
import { reviewsApi, Review } from "@/lib/api/reviews";
import { Users, Star, ArrowRight, Sparkles, Palmtree, Waves, UtensilsCrossed, Dumbbell, Flower2, Car, Wifi, Quote, BedDouble } from "lucide-react";

const facilityIcons = [Palmtree, Waves, UtensilsCrossed, Dumbbell, Flower2, Car, Wifi, Sparkles];

const fallbackFacilities: Array<{ id?: string; name: string; description: string; openingHours?: string }> = [
  { name: "Infinity Pool", description: "Temperature-controlled oceanfront infinity pool with private cabanas." },
  { name: "Holistic Spa", description: "Full service wellness treatments, massages, and sauna suites." },
  { name: "Gourmet Dining", description: "Michelin-guided restaurants featuring organic local seafood and fine wines." },
  { name: "Fitness Center", description: "24/7 high-end gym equipment with personal trainers on demand." },
];

const skeletonRoomCount = 3;

function RoomCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm" aria-hidden="true">
      <div className="relative h-56 w-full overflow-hidden bg-muted">
        <div className="skeleton-shimmer absolute inset-0 bg-muted" />
        <div className="skeleton-shimmer absolute right-3 top-3 h-7 w-28 rounded-full bg-muted" />
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="skeleton-shimmer block h-3 w-20 rounded bg-muted" />
            <span className="skeleton-shimmer block h-3 w-14 rounded bg-muted" />
          </div>
          <span className="skeleton-shimmer mt-2 block h-5 w-3/4 rounded bg-muted" />
          <span className="skeleton-shimmer mt-2 block h-3 w-full rounded bg-muted" />
          <span className="skeleton-shimmer mt-1.5 block h-3 w-2/3 rounded bg-muted" />
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="skeleton-shimmer block h-3 w-32 rounded bg-muted" />
          <span className="skeleton-shimmer block h-9 w-24 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState(false);
  const [facilitiesLoading, setFacilitiesLoading] = useState(true);
  const [facilitiesError, setFacilitiesError] = useState(false);
  const loadHomeDataRef = useRef<() => Promise<void> | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const loadHomeData = async () => {
      try {
        const [roomsRes, facilitiesRes, reviewsRes] = await Promise.allSettled([
          roomTypesApi.list({ limit: 6, status: "ACTIVE" }),
          facilitiesApi.listPublic(),
          reviewsApi.listPublicReviews({ limit: 4 }),
        ]);

        if (cancelled) return;

        if (roomsRes.status === "fulfilled") {
          setRoomTypes(roomsRes.value.data ?? []);
        } else {
          setRoomsError(true);
        }
        if (facilitiesRes.status === "fulfilled" && facilitiesRes.value.data) {
          setFacilities(facilitiesRes.value.data);
        } else {
          setFacilitiesError(true);
        }
        if (reviewsRes.status === "fulfilled" && reviewsRes.value.data) {
          setReviews(reviewsRes.value.data);
        }
      } catch (err) {
        console.error("Error loading home page data", err);
        if (!cancelled) {
          setRoomsError(true);
          setFacilitiesError(true);
        }
      } finally {
        if (!cancelled) {
          setRoomsLoading(false);
          setFacilitiesLoading(false);
        }
      }
    };

    loadHomeDataRef.current = loadHomeData;
    loadHomeData();

    return () => {
      cancelled = true;
    };
  }, []);

  const retryRooms = () => {
    setRoomsError(false);
    setRoomsLoading(true);
    loadHomeDataRef.current?.();
  };

  const retryFacilities = () => {
    setFacilitiesError(false);
    setFacilitiesLoading(true);
    loadHomeDataRef.current?.();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ============ Hero ============ */}
      <section className="relative flex min-h-svh flex-col overflow-hidden bg-navy-950">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-image.png"
            alt="Tropical resort pool framed by palm trees and ocean at dusk"
            fill
            priority
            sizes="100vw"
            className="object-cover animate-hero-zoom will-change-transform"
          />
        </div>

        {/* Subtle overlays — keep the image bright, shade only where text and nav sit */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/75 via-navy-950/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-navy-950/60" />

        {/* Content */}
        <div className="container relative z-10 flex flex-1 flex-col justify-center pt-28 pb-20">
          <div className="max-w-2xl">
            <h1
              className="animate-fade-up font-display text-4xl font-medium leading-[1.08] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
              style={{ animationDelay: "150ms" }}
            >
              A stay worth{" "}
              <span className="italic text-blue-200">slowing down</span> for.
            </h1>

            <p
              className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-blue-50/90 sm:text-lg"
              style={{ animationDelay: "300ms" }}
            >
              Comfort, quiet mornings, and beautiful surroundings — all in one place.
            </p>

            <div
              className="mt-10 flex animate-fade-up flex-col items-start gap-4 sm:flex-row"
              style={{ animationDelay: "450ms" }}
            >
              <Link href="/rooms">
                <Button
                  size="lg"
                  className="group gap-2 rounded-full bg-gradient-to-r from-primary to-blue-600 px-8 font-semibold shadow-xl shadow-blue-950/50 hover:from-primary-hover hover:to-blue-700"
                >
                  <BedDouble className="h-5 w-5" />
                  Explore Rooms
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/facilities">
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-full border border-white/25 bg-white/5 px-8 font-semibold text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/10"
                >
                  View Facilities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ About ============ */}
      <AboutSection />

      {/* ============ Featured Rooms ============ */}
      <section id="rooms" className="py-20 bg-muted/30 lg:py-28 scroll-mt-16">
        <div className="container">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Accommodations
              </span>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                Suites designed for quiet, unhurried days
              </h2>
              <p className="mt-3 text-muted-foreground">
                Spacious rooms, soft morning light, and uninterrupted views of the sea and gardens.
              </p>
            </div>
            <Link href="/rooms" className="shrink-0">
              <Button variant="outline" className="gap-2 rounded-full px-6">
                <span>View All Rooms</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {roomsLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <span className="sr-only" role="status" aria-live="polite">
                Loading rooms...
              </span>
              {Array.from({ length: skeletonRoomCount }, (_, i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </div>
          ) : roomsError ? (
            <div className="rounded-2xl border border-border bg-card py-12 text-center">
              <p className="text-muted-foreground">Unable to load rooms right now.</p>
              <Button variant="outline" className="mt-4 gap-2 rounded-full px-6" onClick={retryRooms}>
                Try Again
              </Button>
            </div>
          ) : roomTypes.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card py-12 text-center">
              <p className="text-muted-foreground">No rooms available currently.</p>
            </div>
          ) : (
            <div className="grid animate-fade-in grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {roomTypes.slice(0, 6).map((room) => {
                const mediaUrl = room.media?.[0]?.url || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80";
                return (
                  <div
                    key={room.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-muted">
                      <Image
                        src={mediaUrl}
                        alt={room.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute right-3 top-3">
                        <Badge variant="primary" size="lg" className="bg-white/90 text-navy-900 backdrop-blur-md shadow-md border-transparent">
                          ৳{room.basePrice} / night
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-semibold uppercase tracking-wider">{room.bedType} BED</span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" /> Max {room.maxGuests}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                          {room.name}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {room.description || "Designed with timeless elegance and panoramic views for your dream stay."}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-4">
                        <span className="text-xs text-muted-foreground">
                          {room.roomTypeAmenities?.length || 0} amenities included
                        </span>
                        <Link href={`/rooms/${room.id}`}>
                          <Button variant="primary" size="sm" className="gap-1 rounded-full px-4">
                            <span>Book Now</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============ Offers & Packages ============ */}
      <OffersSection />

      {/* ============ Facilities ============ */}
      <section id="facilities" className="py-20 lg:py-28 scroll-mt-16">
        <div className="container">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              World-Class Amenities
            </span>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Everything you need to slow down
            </h2>
            <p className="mt-3 text-muted-foreground">
              Rest, relaxation, and rejuvenation — thoughtfully curated throughout the resort.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(facilities.length > 0 ? facilities : fallbackFacilities).map((fac, i) => {
              const Icon = facilityIcons[i % facilityIcons.length];
              return (
                <div
                  key={fac.id ?? fac.name}
                  className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{fac.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {fac.description || "Enjoy premium hospitality and curated experiences."}
                  </p>
                  {fac.openingHours && (
                    <span className="mt-4 inline-block text-xs font-semibold text-primary">
                      Hours: {fac.openingHours}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ Guest Reviews ============ */}
      {reviews.length > 0 && (
        <section className="py-20 bg-muted/30 lg:py-28">
          <div className="container">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Testimonials
              </span>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                Words from our guests
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {reviews.map((rev) => (
                <div key={rev.id} className="space-y-4 rounded-2xl border border-border bg-card p-7 shadow-sm">
                  <Quote className="h-7 w-7 text-primary/30" />
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <h4 className="text-base font-semibold text-foreground">
                    {rev.title || "Unforgettable Stay"}
                  </h4>
                  <p className="text-sm italic leading-relaxed text-muted-foreground">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                  <div className="flex items-center justify-between border-t border-border pt-4 text-xs font-medium text-muted-foreground">
                    <span>— {rev.user?.name || "Valued Guest"}</span>
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ Facilities Directory ============ */}
      <FacilityDirectory
        facilities={facilities}
        isLoading={facilitiesLoading}
        hasError={facilitiesError}
        onRetry={retryFacilities}
      />

      {/* ============ Gallery ============ */}
      <GallerySection />

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect, Suspense, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { roomTypesApi, RoomType } from "@/lib/api/roomTypes";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowRight,
  Users,
  BedDouble,
  X,
  ChevronDown,
  RotateCcw,
  AlertTriangle,
  SearchX,
  RefreshCw,
} from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80";

const skeletonCount = 3;

function RoomCardSkeleton() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
      aria-hidden="true"
    >
      <div className="relative h-60 w-full overflow-hidden bg-muted">
        <div className="skeleton-shimmer absolute inset-0" />
        <div className="skeleton-shimmer absolute right-3 top-3 h-7 w-24 rounded-full" />
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="skeleton-shimmer block h-3 w-20 rounded-full bg-muted" />
            <span className="skeleton-shimmer block h-3 w-14 rounded-full bg-muted" />
          </div>
          <span className="skeleton-shimmer mt-3 block h-5 w-3/4 rounded-md bg-muted" />
          <span className="skeleton-shimmer mt-2.5 block h-3 w-full rounded-full bg-muted" />
          <span className="skeleton-shimmer mt-1.5 block h-3 w-2/3 rounded-full bg-muted" />
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="skeleton-shimmer block h-3 w-32 rounded-full bg-muted" />
          <span className="skeleton-shimmer block h-9 w-28 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

function SkeletonFilterBar() {
  return (
    <div
      className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3.5">
        <span className="skeleton-shimmer block h-4 w-40 rounded-full bg-muted" />
        <span className="skeleton-shimmer block h-4 w-16 rounded-full bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
        <span className="skeleton-shimmer block h-[46px] rounded-xl bg-muted" />
        <span className="skeleton-shimmer block h-[46px] rounded-xl bg-muted" />
        <span className="skeleton-shimmer block h-[46px] rounded-xl bg-muted" />
        <span className="skeleton-shimmer block h-[46px] rounded-xl bg-muted" />
      </div>
    </div>
  );
}

function RoomsHero({ children }: { children?: ReactNode }) {
  return (
    <section className="bg-muted/20 border-b border-border pt-24 pb-10 sm:pt-28 sm:pb-12">
      <div className="container">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Accommodations
          </span>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            Explore Rooms & Suites
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Find your sanctuary among our collection of hand-crafted rooms and luxury oceanfront
            suites.
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

interface FilterFormProps {
  search: string;
  bedType: string;
  maxGuests: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onBedTypeChange: (value: string) => void;
  onMaxGuestsChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

function FilterForm({
  search,
  bedType,
  maxGuests,
  hasActiveFilters,
  onSearchChange,
  onBedTypeChange,
  onMaxGuestsChange,
  onSubmit,
  onReset,
}: FilterFormProps) {
  const inputClasses =
    "h-[46px] w-full rounded-xl border border-border bg-background text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-border-hover focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/25";

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3.5">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Refine your stay
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
        <div>
          <label
            htmlFor="room-search"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            <Search className="h-3.5 w-3.5 text-primary" />
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="room-search"
              type="text"
              placeholder="Room name or keyword..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`${inputClasses} pr-9 pl-10`}
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="bed-type"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            <BedDouble className="h-3.5 w-3.5 text-primary" />
            Bed Type
          </label>
          <div className="relative">
            <BedDouble className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              id="bed-type"
              value={bedType}
              onChange={(e) => onBedTypeChange(e.target.value)}
              className={`${inputClasses} pr-9 pl-10 cursor-pointer appearance-none`}
            >
              <option value="">All Bed Types</option>
              <option value="KING">King</option>
              <option value="QUEEN">Queen</option>
              <option value="DOUBLE">Double</option>
              <option value="TWIN">Twin</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div>
          <label
            htmlFor="capacity"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            <Users className="h-3.5 w-3.5 text-primary" />
            Capacity
          </label>
          <div className="relative">
            <Users className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              id="capacity"
              value={maxGuests}
              onChange={(e) => onMaxGuestsChange(e.target.value)}
              className={`${inputClasses} pr-9 pl-10 cursor-pointer appearance-none`}
            >
              <option value="">Any Guests</option>
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4+ Guests</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="lg:self-end">
          <label className="sr-only">Apply filters</label>
          <Button type="submit" variant="primary" className="h-[46px] w-full gap-2 font-semibold lg:w-auto lg:px-6">
            <Filter className="h-4 w-4" />
            <span>Apply Filters</span>
          </Button>
        </div>
      </div>
    </form>
  );
}

function RoomsContent() {
  const searchParams = useSearchParams();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [meta, setMeta] = useState({ page: 1, limit: 6, total: 0, totalPage: 1 });

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [bedType, setBedType] = useState(searchParams.get("bedType") || "");
  const [maxGuests, setMaxGuests] = useState(searchParams.get("guests") || "");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState({
    search,
    bedType,
    maxGuests,
  });

  const hasActiveFilters = !!(search || bedType || maxGuests);

  useEffect(() => {
    let cancelled = false;

    async function startFetching() {
      try {
        const res = await roomTypesApi.list({
          page,
          limit: 6,
          search: appliedFilters.search || undefined,
          bedType: appliedFilters.bedType || undefined,
          maxGuests: appliedFilters.maxGuests ? Number(appliedFilters.maxGuests) : undefined,
          status: "ACTIVE",
        });
        if (cancelled) return;

        if (res.data) {
          setRoomTypes(res.data);
        }
        if (res.meta) {
          setMeta(res.meta);
        }
        setHasError(false);
      } catch (error) {
        console.error("Failed to load room types:", error);
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    startFetching();
    return () => {
      cancelled = true;
    };
  }, [page, reloadKey, appliedFilters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPage(1);
    setAppliedFilters({ search, bedType, maxGuests });
    setReloadKey((k) => k + 1);
  };

  const handleReset = () => {
    setSearch("");
    setBedType("");
    setMaxGuests("");
    setIsLoading(true);
    setPage(1);
    setAppliedFilters({ search: "", bedType: "", maxGuests: "" });
    setReloadKey((k) => k + 1);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setReloadKey((k) => k + 1);
  };

  const handlePageChange = (p: number) => {
    setIsLoading(true);
    setPage(p);
  };

  return (
    <>
      <RoomsHero>
        <FilterForm
          search={search}
          bedType={bedType}
          maxGuests={maxGuests}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={setSearch}
          onBedTypeChange={setBedType}
          onMaxGuestsChange={setMaxGuests}
          onSubmit={handleSearchSubmit}
          onReset={handleReset}
        />
      </RoomsHero>

      <main className="flex-1 pt-10 pb-20 sm:pt-12 sm:pb-24">
        <div className="container">
          <div className="min-h-[28rem] sm:min-h-[32rem]">
            {isLoading ? (
              <>
                <span className="sr-only" role="status" aria-live="polite">
                  Loading available rooms...
                </span>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: skeletonCount }, (_, i) => (
                    <RoomCardSkeleton key={i} />
                  ))}
                </div>
              </>
            ) : hasError ? (
              <div className="flex min-h-[28rem] items-center justify-center sm:min-h-[32rem]">
                <div
                  className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-sm sm:py-14"
                  role="alert"
                >
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error">
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    We couldn&apos;t load the available rooms right now. Please check your
                    connection and try again.
                  </p>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleRetry}
                    className="mt-6 gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              </div>
            ) : roomTypes.length === 0 ? (
              <div className="flex min-h-[28rem] items-center justify-center sm:min-h-[32rem]">
                <div
                  className="mx-auto w-full max-w-md rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center shadow-sm sm:py-14"
                  role="status"
                  aria-live="polite"
                >
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <SearchX className="h-8 w-8" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">No Rooms Found</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    We couldn&apos;t find any rooms matching your selected filters. Try broadening
                    your search criteria.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="mt-6 gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Search
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-6 text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">{roomTypes.length}</span> of{" "}
                  <span className="font-semibold text-foreground">{meta.total}</span> available
                  rooms
                </p>

                <div className="grid animate-fade-in grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {roomTypes.map((room) => {
                    const mediaUrl = room.media?.[0]?.url || fallbackImage;
                    return (
                      <div
                        key={room.id}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="relative h-60 w-full overflow-hidden bg-muted">
                          <Image
                            src={mediaUrl}
                            alt={room.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                          <div className="absolute top-3 right-3">
                            <Badge variant="primary" size="lg" className="bg-white/90 text-navy-900 backdrop-blur-md shadow-md border-transparent">
                              ৳{room.basePrice} / night
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                          <div>
                            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                              <span className="font-semibold uppercase">{room.bedType} BED</span>
                              <span>Max {room.maxGuests} Guests</span>
                            </div>
                            <h2 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                              {room.name}
                            </h2>
                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                              {room.description || "Designed with timeless elegance for your comfort."}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-border pt-4">
                            <span className="text-xs font-medium text-muted-foreground">
                              {room.roomSizeSqFt ? `${room.roomSizeSqFt} sq ft` : "Spacious Suite"}
                            </span>
                            <Link href={`/rooms/${room.id}`}>
                              <Button variant="primary" size="sm" className="gap-1 rounded-full px-4">
                                <span>View Details</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPage}
                  onPageChange={handlePageChange}
                  className="mt-12"
                />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function RoomsFallback() {
  return (
    <>
      <RoomsHero>
        <SkeletonFilterBar />
      </RoomsHero>

      <main className="flex-1 pt-10 pb-20 sm:pt-12 sm:pb-24">
        <div className="container">
          <div className="min-h-[28rem] sm:min-h-[32rem]">
            <span className="sr-only" role="status" aria-live="polite">
              Loading available rooms...
            </span>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: skeletonCount }, (_, i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function RoomsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Suspense fallback={<RoomsFallback />}>
        <RoomsContent />
      </Suspense>
      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect, Suspense, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { roomTypesApi, RoomType } from "@/lib/api/roomTypes";
import {
  Search,
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

const skeletonCount = 4;

interface FilterState {
  search: string;
  bedType: string;
  maxGuests: string;
  minPrice: string;
  maxPrice: string;
  viewType: string;
  amenities: string[];
}

const emptyFilters: FilterState = {
  search: "",
  bedType: "",
  maxGuests: "",
  minPrice: "",
  maxPrice: "",
  viewType: "",
  amenities: [],
};

const BED_TYPE_OPTIONS = [
  { value: "", label: "All Bed Types" },
  { value: "KING", label: "King" },
  { value: "QUEEN", label: "Queen" },
  { value: "DOUBLE", label: "Double" },
  { value: "TWIN", label: "Twin" },
  { value: "SINGLE", label: "Single" },
];

const CAPACITY_OPTIONS = [
  { value: "", label: "Any Guests" },
  { value: "1", label: "1 Guest" },
  { value: "2", label: "2 Guests" },
  { value: "3", label: "3 Guests" },
  { value: "4", label: "4+ Guests" },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

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

function SkeletonFilterSidebar() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3.5">
        <span className="skeleton-shimmer block h-4 w-20 rounded-full bg-muted" />
        <span className="skeleton-shimmer block h-3 w-14 rounded-full bg-muted" />
      </div>
      <div className="space-y-5 p-4">
        <span className="skeleton-shimmer block h-11 rounded-xl bg-muted" />
        <div className="grid grid-cols-2 gap-2">
          <span className="skeleton-shimmer block h-11 rounded-xl bg-muted" />
          <span className="skeleton-shimmer block h-11 rounded-xl bg-muted" />
        </div>
        <span className="skeleton-shimmer block h-11 rounded-xl bg-muted" />
        <span className="skeleton-shimmer block h-11 rounded-xl bg-muted" />
        <span className="skeleton-shimmer block h-11 rounded-xl bg-muted" />
        <span className="skeleton-shimmer block h-28 rounded-xl bg-muted" />
      </div>
      <div className="border-t border-border bg-muted/40 p-4">
        <span className="skeleton-shimmer block h-11 rounded-xl bg-muted" />
      </div>
    </div>
  );
}

function RoomsHero() {
  return (
    <section className="bg-muted/20 border-b border-border pt-20 pb-6 sm:pt-24 sm:pb-8">
      <div className="container">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Accommodations
          </span>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground text-balance sm:text-4xl">
            Explore Rooms & Suites
          </h1>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Find your sanctuary among our collection of hand-crafted rooms and luxury oceanfront
            suites.
          </p>
        </div>
      </div>
    </section>
  );
}

interface FilterPanelProps {
  idPrefix?: string;
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  viewTypeOptions: string[];
  amenityOptions: string[];
}

function FilterPanel({
  idPrefix = "",
  filters,
  onChange,
  viewTypeOptions,
  amenityOptions,
}: FilterPanelProps) {
  const fieldClasses =
    "h-11 w-full rounded-xl border border-border bg-background text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-border-hover focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/25";

  const labelClasses =
    "mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="space-y-5 p-4">
      <div>
        <label htmlFor={`${idPrefix}room-search`} className={labelClasses}>
          <Search className="h-3.5 w-3.5 text-primary" />
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id={`${idPrefix}room-search`}
            type="text"
            placeholder="Room name or keyword..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className={`${fieldClasses} pr-9 pl-10`}
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ search: "" })}
              aria-label="Clear search"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div>
        <label className={labelClasses}>
          <span>Price Range</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
              ৳
            </span>
            <input
              id={`${idPrefix}min-price`}
              type="number"
              min={0}
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              className={`${fieldClasses} pl-8`}
            />
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
              ৳
            </span>
            <input
              id={`${idPrefix}max-price`}
              type="number"
              min={0}
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              className={`${fieldClasses} pl-8`}
            />
          </div>
        </div>
      </div>

      {viewTypeOptions.length > 0 && (
        <div>
          <label htmlFor={`${idPrefix}view-type`} className={labelClasses}>
            <span>Room Type</span>
          </label>
          <div className="relative">
            <select
              id={`${idPrefix}view-type`}
              value={filters.viewType}
              onChange={(e) => onChange({ viewType: e.target.value })}
              className={`${fieldClasses} cursor-pointer appearance-none pr-9`}
            >
              <option value="">All Room Types</option>
              {viewTypeOptions.map((view) => (
                <option key={view} value={view}>
                  {view}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      )}

      <div>
        <label htmlFor={`${idPrefix}bed-type`} className={labelClasses}>
          <BedDouble className="h-3.5 w-3.5 text-primary" />
          Bed Type
        </label>
        <div className="relative">
          <BedDouble className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            id={`${idPrefix}bed-type`}
            value={filters.bedType}
            onChange={(e) => onChange({ bedType: e.target.value })}
            className={`${fieldClasses} cursor-pointer appearance-none pl-9 pr-9`}
          >
            {BED_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div>
        <label htmlFor={`${idPrefix}capacity`} className={labelClasses}>
          <Users className="h-3.5 w-3.5 text-primary" />
          Guest Capacity
        </label>
        <div className="relative">
          <Users className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            id={`${idPrefix}capacity`}
            value={filters.maxGuests}
            onChange={(e) => onChange({ maxGuests: e.target.value })}
            className={`${fieldClasses} cursor-pointer appearance-none pl-9 pr-9`}
          >
            {CAPACITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {amenityOptions.length > 0 && (
        <div>
          <span className={labelClasses}>
            <span>Amenities</span>
          </span>
          <div className="max-h-44 space-y-1 overflow-y-auto rounded-xl border border-border bg-background p-2">
            {amenityOptions.map((name) => {
              const checked = filters.amenities.includes(name);
              return (
                <label
                  key={name}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      onChange({
                        amenities: checked
                          ? filters.amenities.filter((n) => n !== name)
                          : [...filters.amenities, name],
                      })
                    }
                    className="h-4 w-4 cursor-pointer accent-primary"
                  />
                  <span className="text-sm text-foreground">{name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface FiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeCount: number;
  children: ReactNode;
  onReset: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

function FiltersDrawer({
  isOpen,
  onClose,
  activeCount,
  children,
  onReset,
  onSubmit,
}: FiltersDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof window === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <form
        onSubmit={onSubmit}
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-card shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3.5">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Filters
            {activeCount > 0 && (
              <Badge variant="primary" size="sm" className="h-5 min-w-5 px-1.5">
                {activeCount}
              </Badge>
            )}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>

        <div className="flex items-center gap-2 border-t border-border bg-muted/40 p-4">
          <Button type="button" variant="outline" onClick={onReset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </Button>
          <Button type="submit" variant="primary" className="flex-1 gap-2 font-semibold">
            <SlidersHorizontal className="h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </form>
    </div>,
    document.body,
  );
}

function RoomsContent() {
  const searchParams = useSearchParams();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [meta, setMeta] = useState({ page: 1, limit: 6, total: 0, totalPage: 1 });

  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get("search") || "",
    bedType: searchParams.get("bedType") || "",
    maxGuests: searchParams.get("guests") || "",
    minPrice: "",
    maxPrice: "",
    viewType: "",
    amenities: [],
  }));
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters);
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [viewTypeOptions, setViewTypeOptions] = useState<string[]>([]);
  const [amenityOptions, setAmenityOptions] = useState<string[]>([]);

  const activeFilterCount =
    (appliedFilters.search ? 1 : 0) +
    (appliedFilters.bedType ? 1 : 0) +
    (appliedFilters.maxGuests ? 1 : 0) +
    (appliedFilters.minPrice ? 1 : 0) +
    (appliedFilters.maxPrice ? 1 : 0) +
    (appliedFilters.viewType ? 1 : 0) +
    (appliedFilters.amenities.length > 0 ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  useEffect(() => {
    let cancelled = false;

    roomTypesApi
      .list({ page: 1, limit: 200, status: "ACTIVE" })
      .then((res) => {
        if (cancelled || !res.data) return;
        const viewTypes = new Set<string>();
        const amenityNames = new Set<string>();
        res.data.forEach((roomType) => {
          if (roomType.viewType) viewTypes.add(roomType.viewType);
          roomType.roomTypeAmenities?.forEach(({ amenity }) =>
            amenityNames.add(amenity.name),
          );
        });
        setViewTypeOptions([...viewTypes].sort((a, b) => a.localeCompare(b)));
        setAmenityOptions(
          [...amenityNames].sort((a, b) => a.localeCompare(b)),
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function startFetching() {
      try {
        const res = await roomTypesApi.list({
          page,
          limit: 6,
          search: appliedFilters.search || undefined,
          bedType: appliedFilters.bedType || undefined,
          maxGuests: appliedFilters.maxGuests
            ? Number(appliedFilters.maxGuests)
            : undefined,
          minPrice: appliedFilters.minPrice
            ? Number(appliedFilters.minPrice)
            : undefined,
          maxPrice: appliedFilters.maxPrice
            ? Number(appliedFilters.maxPrice)
            : undefined,
          viewType: appliedFilters.viewType || undefined,
          amenities:
            appliedFilters.amenities.length > 0
              ? appliedFilters.amenities.join(",")
              : undefined,
          sort: sort !== "recommended" ? sort : undefined,
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
  }, [page, reloadKey, appliedFilters, sort]);

  const updateFilter = (patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPage(1);
    setAppliedFilters(filters);
    setReloadKey((k) => k + 1);
    setIsDrawerOpen(false);
  };

  const handleReset = () => {
    setIsLoading(true);
    setPage(1);
    const cleared = { ...emptyFilters };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setReloadKey((k) => k + 1);
    setIsDrawerOpen(false);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setReloadKey((k) => k + 1);
  };

  const handlePageChange = (p: number) => {
    setIsLoading(true);
    setPage(p);
  };

  const handleSortChange = (value: string) => {
    setIsLoading(true);
    setPage(1);
    setSort(value);
  };

  return (
    <>
      <RoomsHero />

      <main className="flex-1 pt-6 pb-20 sm:pt-8 sm:pb-24">
        <div className="container">
          <div className="flex items-start gap-8">
            <aside className="hidden w-64 shrink-0 lg:block">
              <form
                onSubmit={applyFilters}
                className="sticky top-24 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3.5">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    Filters
                    {hasActiveFilters && (
                      <Badge
                        variant="primary"
                        size="sm"
                        className="h-5 min-w-5 px-1.5"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={!hasActiveFilters}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Clear all
                  </button>
                </div>

                <FilterPanel
                  idPrefix="desktop-"
                  filters={filters}
                  onChange={updateFilter}
                  viewTypeOptions={viewTypeOptions}
                  amenityOptions={amenityOptions}
                />

                <div className="border-t border-border bg-muted/40 p-4">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    className="gap-2 font-semibold"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Apply Filters
                  </Button>
                </div>
              </form>
            </aside>

            <section className="min-w-0 flex-1">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDrawerOpen(true)}
                    className="gap-2 lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <Badge
                        variant="primary"
                        size="sm"
                        className="h-5 min-w-5 px-1.5"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>

                  {isLoading ? (
                    <span
                      className="skeleton-shimmer block h-9 w-52 rounded-full bg-muted"
                      aria-hidden="true"
                    />
                  ) : (
                    !hasError &&
                    roomTypes.length > 0 && (
                      <p className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-xs">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                        Showing{" "}
                        <span className="font-semibold text-foreground">
                          {roomTypes.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-foreground">
                          {meta.total}
                        </span>{" "}
                        available rooms
                      </p>
                    )
                  )}
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <label htmlFor="rooms-sort" className="sr-only">
                    Sort by
                  </label>
                  <div className="relative">
                    <select
                      id="rooms-sort"
                      value={sort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="h-10 cursor-pointer appearance-none rounded-full border border-border bg-card pr-9 pl-4 text-sm font-medium text-foreground transition-all duration-200 hover:border-border-hover focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/25"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="min-h-[28rem] sm:min-h-[32rem]">
                {isLoading ? (
                  <>
                    <span className="sr-only" role="status" aria-live="polite">
                      Loading available rooms...
                    </span>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      <h2 className="text-xl font-bold text-foreground">
                        Something went wrong
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        We couldn&apos;t load the available rooms right now.
                        Please check your connection and try again.
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
                      <h2 className="text-xl font-bold text-foreground">
                        No Rooms Found
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        We couldn&apos;t find any rooms matching your selected
                        filters. Try broadening your search criteria.
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
                    <div className="grid animate-fade-in grid-cols-1 gap-6 md:grid-cols-2">
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
                                <Badge variant="primary" size="lg" className="whitespace-nowrap bg-white/90 text-navy-900 backdrop-blur-md shadow-md border-transparent ring-1 ring-black/10">
                                  ৳{room.basePrice.toLocaleString("en-IN")} / night
                                </Badge>
                              </div>
                            </div>

                            <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                              <div>
                                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="font-semibold uppercase">
                                    {room.bedType} BED
                                  </span>
                                  <span>Max {room.maxGuests} Guests</span>
                                </div>
                                <h2 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                                  {room.name}
                                </h2>
                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                  {room.description ||
                                    "Designed with timeless elegance for your comfort."}
                                </p>
                              </div>

                              <div className="flex items-center justify-between border-t border-border pt-4">
                                <span className="text-xs font-medium text-muted-foreground">
                                  {room.roomSizeSqFt
                                    ? `${room.roomSizeSqFt} sq ft`
                                    : "Spacious Suite"}
                                </span>
                                <Link href={`/rooms/${room.id}`}>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="gap-1 rounded-full px-4"
                                  >
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
            </section>
          </div>
        </div>
      </main>

      <FiltersDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeCount={activeFilterCount}
        onReset={handleReset}
        onSubmit={applyFilters}
      >
        <FilterPanel
          idPrefix="mobile-"
          filters={filters}
          onChange={updateFilter}
          viewTypeOptions={viewTypeOptions}
          amenityOptions={amenityOptions}
        />
      </FiltersDrawer>
    </>
  );
}

function RoomsFallback() {
  return (
    <>
      <RoomsHero />

      <main className="flex-1 pt-6 pb-20 sm:pt-8 sm:pb-24">
        <div className="container">
          <div className="flex items-start gap-8">
            <aside className="hidden w-64 shrink-0 lg:block">
              <SkeletonFilterSidebar />
            </aside>

            <section className="min-w-0 flex-1">
              <div className="mb-6">
                <span
                  className="skeleton-shimmer block h-4 w-44 rounded-full bg-muted"
                  aria-hidden="true"
                />
              </div>

              <div className="min-h-[28rem] sm:min-h-[32rem]">
                <span className="sr-only" role="status" aria-live="polite">
                  Loading available rooms...
                </span>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {Array.from({ length: skeletonCount }, (_, i) => (
                    <RoomCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </section>
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

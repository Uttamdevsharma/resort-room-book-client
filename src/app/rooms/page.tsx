"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { roomTypesApi, RoomType } from "@/lib/api/roomTypes";
import { Search, Filter, ArrowRight, Users, BedDouble, SlidersHorizontal } from "lucide-react";

function RoomsContent() {
  const searchParams = useSearchParams();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 6, total: 0, totalPage: 1 });

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [bedType, setBedType] = useState(searchParams.get("bedType") || "");
  const [maxGuests, setMaxGuests] = useState(searchParams.get("guests") || "");
  const [page, setPage] = useState(1);

  const fetchRooms = async (currentPage = 1) => {
    setIsLoading(true);
    try {
      const res = await roomTypesApi.list({
        page: currentPage,
        limit: 6,
        search: search || undefined,
        bedType: bedType || undefined,
        maxGuests: maxGuests ? Number(maxGuests) : undefined,
        status: "ACTIVE",
      });

      if (res.data) {
        setRoomTypes(res.data);
      }
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (error) {
      console.error("Failed to load room types:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(page);
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRooms(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="pt-24 pb-12 bg-muted/20 border-b border-border">
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Explore Rooms & Suites
            </h1>
            <p className="text-muted-foreground mt-2">
              Find your sanctuary among our collection of hand-crafted rooms and luxury oceanfront suites.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 p-4 bg-card border border-border rounded-2xl shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Room name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Bed Type</label>
              <select
                value={bedType}
                onChange={(e) => setBedType(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              >
                <option value="">All Bed Types</option>
                <option value="KING">King</option>
                <option value="QUEEN">Queen</option>
                <option value="DOUBLE">Double</option>
                <option value="TWIN">Twin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Capacity</label>
              <select
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              >
                <option value="">Any Guests</option>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button type="submit" variant="primary" className="w-full h-[42px] gap-2 font-semibold">
                <Filter className="h-4 w-4" />
                <span>Apply Filters</span>
              </Button>
            </div>
          </form>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="container">
          {isLoading ? (
            <Loading text="Searching available rooms..." />
          ) : roomTypes.length === 0 ? (
            <EmptyState
              title="No Rooms Found"
              description="We couldn't find any rooms matching your selected filters. Try broadening your search criteria."
              action={{
                label: "Reset Search",
                onClick: () => {
                  setSearch("");
                  setBedType("");
                  setMaxGuests("");
                  fetchRooms(1);
                },
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {roomTypes.map((room) => {
                  const mediaUrl = room.media?.[0]?.url || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80";
                  return (
                    <div
                      key={room.id}
                      className="group bg-card rounded-2xl border border-border overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div className="relative h-60 w-full overflow-hidden bg-muted">
                        <Image
                          src={mediaUrl}
                          alt={room.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant="primary" size="lg" className="backdrop-blur-md shadow-md">
                            ৳{room.basePrice} / night
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span className="font-semibold uppercase">{room.bedType} BED</span>
                            <span>Max {room.maxGuests} Guests</span>
                          </div>
                          <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {room.name}
                          </h2>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {room.description || "Designed with timeless elegance for your comfort."}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-border flex items-center justify-between">
                          <span className="text-xs text-muted-foreground font-medium">
                            {room.roomSizeSqFt ? `${room.roomSizeSqFt} sq ft` : "Spacious Suite"}
                          </span>
                          <Link href={`/rooms/${room.id}`}>
                            <Button variant="primary" size="sm" className="gap-1">
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
                onPageChange={(p) => setPage(p)}
                className="mt-12"
              />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<Loading text="Loading..." />}>
      <RoomsContent />
    </Suspense>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { roomTypesApi, RoomType } from "@/lib/api/roomTypes";
import { useAuth } from "@/lib/context/AuthContext";
import { Calendar, Users, BedDouble, CheckCircle2, ShieldCheck, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer bg-muted ${className}`} aria-hidden="true" />;
}

function RoomDetailSkeleton() {
  return (
    <>
      <div className="pt-24 pb-6 bg-muted/20 border-b border-border">
        <div className="container">
          <SkeletonBlock className="mb-4 h-3.5 w-40 rounded-full" />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <SkeletonBlock className="h-6 w-24 rounded-full" />
              <SkeletonBlock className="h-9 sm:h-10 w-64 sm:w-96 max-w-full rounded-lg" />
            </div>
            <div className="space-y-2 md:text-right">
              <SkeletonBlock className="h-8 w-28 rounded-lg md:ml-auto" />
              <SkeletonBlock className="h-3 w-16 rounded-full md:ml-auto" />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 pt-12 pb-24 min-h-[38rem] sm:min-h-[42rem]">
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <SkeletonBlock className="h-80 sm:h-96 w-full rounded-2xl" />
              <div className="flex items-center gap-3 overflow-hidden">
                {[0, 1, 2, 3].map((i) => (
                  <SkeletonBlock key={i} className="h-20 w-28 flex-shrink-0 rounded-xl" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-card border border-border shadow-xs">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <SkeletonBlock className="h-3 w-20 rounded-full" />
                  <SkeletonBlock className="h-6 w-24 rounded-md" />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <SkeletonBlock className="h-7 w-48 rounded-lg" />
              <div className="space-y-2.5">
                <SkeletonBlock className="h-4 w-full rounded-full" />
                <SkeletonBlock className="h-4 w-11/12 rounded-full" />
                <SkeletonBlock className="h-4 w-5/6 rounded-full" />
                <SkeletonBlock className="h-4 w-2/3 rounded-full" />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <SkeletonBlock className="h-7 w-52 rounded-lg" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                  >
                    <SkeletonBlock className="h-8 w-8 rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <SkeletonBlock className="h-4 w-32 rounded-full" />
                      <SkeletonBlock className="h-3 w-40 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-card border border-border shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="space-y-1.5">
                  <SkeletonBlock className="h-8 w-24 rounded-lg" />
                  <SkeletonBlock className="h-3 w-16 rounded-full" />
                </div>
                <SkeletonBlock className="h-7 w-32 rounded-full" />
              </div>

              <div className="space-y-4">
                {[0, 1].map((i) => (
                  <div key={i} className="space-y-1.5">
                    <SkeletonBlock className="h-3 w-24 rounded-full" />
                    <SkeletonBlock className="h-10 w-full rounded-lg" />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1].map((i) => (
                    <div key={i} className="space-y-1.5">
                      <SkeletonBlock className="h-3 w-16 rounded-full" />
                      <SkeletonBlock className="h-10 w-full rounded-lg" />
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-muted/40 space-y-3">
                  <SkeletonBlock className="h-4 w-full rounded-full" />
                  <SkeletonBlock className="h-4 w-full rounded-full" />
                  <SkeletonBlock className="h-5 w-2/3 rounded-full" />
                </div>
                <SkeletonBlock className="h-12 w-full rounded-xl" />
                <SkeletonBlock className="mx-auto h-4 w-56 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking Form State
  const [checkIn, setCheckIn] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [checkOut, setCheckOut] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]
  );
  const [numAdults, setNumAdults] = useState("2");
  const [numChildren, setNumChildren] = useState("0");

  useEffect(() => {
    async function loadRoomDetail() {
      try {
        const res = await roomTypesApi.getById(resolvedParams.id);
        if (res.data) {
          setRoom(res.data);
        }
      } catch (err) {
        console.error("Error loading room detail:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRoomDetail();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <RoomDetailSkeleton />
        <Footer />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 container py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">Room Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested room type could not be located.</p>
          <Link href="/rooms" className="mt-6 inline-block">
            <Button variant="outline">← Back to Rooms</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = room.media?.map((m) => m.url) || [
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  ];

  const calculateNights = () => {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const diff = Math.max(1, Math.round((end - start) / (1000 * 3600 * 24)));
    return isNaN(diff) ? 1 : diff;
  };

  const nights = calculateNights();
  const estimatedTotal = nights * room.basePrice;

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/login?redirect=/rooms/${room.id}`);
      return;
    }
    router.push(
      `/checkout/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&numAdults=${numAdults}&numChildren=${numChildren}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="pt-24 pb-6 bg-muted/20 border-b border-border">
        <div className="container">
          <Link href="/rooms" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all rooms
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="primary" className="mb-2">
                {room.bedType} BED
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {room.name}
              </h1>
            </div>
            <div className="text-left md:text-right">
              <span className="text-3xl font-extrabold text-primary">৳{room.basePrice}</span>
              <span className="text-sm text-muted-foreground"> / night</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 pt-12 pb-24">
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Media Gallery & Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-border bg-muted shadow-sm">
                <Image
                  src={images[activeImageIndex] || images[0]}
                  alt={room.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-20 w-28 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeImageIndex === idx ? "border-primary ring-2 ring-primary/30" : "border-border opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-card border border-border shadow-xs">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold block">Max Guests</span>
                <span className="text-lg font-bold text-foreground mt-0.5 block">{room.maxGuests} Guests</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold block">Bed Type</span>
                <span className="text-lg font-bold text-foreground mt-0.5 block">{room.bedType}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold block">Room Size</span>
                <span className="text-lg font-bold text-foreground mt-0.5 block">
                  {room.roomSizeSqFt ? `${room.roomSizeSqFt} sq ft` : "Spacious"}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold block">Max Adults</span>
                <span className="text-lg font-bold text-foreground mt-0.5 block">{room.maxAdults} Adults</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">About This Room</h2>
              <p className="text-muted-foreground leading-relaxed">
                {room.description ||
                  "Immerse yourself in supreme tranquility. Designed with modern minimalist decor, plush bedding, and high-speed Wi-Fi, this room is crafted to offer an unforgettable vacation experience."}
              </p>
            </div>

            {/* Amenities List */}
            {room.roomTypeAmenities && room.roomTypeAmenities.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-border">
                <h2 className="text-2xl font-bold text-foreground">Room Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {room.roomTypeAmenities.map(({ amenity }) => (
                    <div key={amenity.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground text-sm block">{amenity.name}</span>
                        {amenity.description && (
                          <span className="text-xs text-muted-foreground">{amenity.description}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-card border border-border shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <span className="text-2xl font-extrabold text-foreground">৳{room.basePrice}</span>
                  <span className="text-xs text-muted-foreground"> / night</span>
                </div>
                <Badge variant="success">Best Rate Guaranteed</Badge>
              </div>

              <form onSubmit={handleBookNow} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                      Adults
                    </label>
                    <select
                      value={numAdults}
                      onChange={(e) => setNumAdults(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
                    >
                      <option value="1">1 Adult</option>
                      <option value="2">2 Adults</option>
                      <option value="3">3 Adults</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                      Children
                    </label>
                    <select
                      value={numChildren}
                      onChange={(e) => setNumChildren(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
                    >
                      <option value="0">0 Children</option>
                      <option value="1">1 Child</option>
                      <option value="2">2 Children</option>
                    </select>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-xl bg-muted/40 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>৳{room.basePrice} x {nights} nights</span>
                    <span>৳{estimatedTotal}</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground text-base pt-2 border-t border-border">
                    <span>Estimated Total</span>
                    <span className="text-primary">৳{estimatedTotal}</span>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full font-bold gap-2">
                  <span>Reserve Room Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="text-xs text-muted-foreground text-center space-y-1 pt-2">
                <p className="flex items-center justify-center gap-1 text-emerald-600 font-medium">
                  <ShieldCheck className="h-4 w-4" /> Free cancellation up to 48h before check-in
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

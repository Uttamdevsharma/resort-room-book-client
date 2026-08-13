"use client";

import { useState, useEffect, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { roomTypesApi, RoomType } from "@/lib/api/roomTypes";
import { couponsApi, CouponValidationResult } from "@/lib/api/coupons";
import { bookingsApi } from "@/lib/api/bookings";
import { paymentsApi } from "@/lib/api/payments";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckoutSkeleton } from "@/components/checkout/CheckoutSkeleton";
import { AlertCircle, CheckCircle2, Ticket, CreditCard, ShieldCheck, ArrowLeft } from "lucide-react";

function BookingCreationContent({ roomTypeId }: { roomTypeId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [room, setRoom] = useState<RoomType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Booking Form State
  const [checkIn, setCheckIn] = useState(
    searchParams.get("checkIn") || new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get("checkOut") || new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]
  );
  const [numAdults, setNumAdults] = useState(searchParams.get("numAdults") || "2");
  const [numChildren, setNumChildren] = useState(searchParams.get("numChildren") || "0");
  const [specialRequests, setSpecialRequests] = useState("");

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRoom() {
      try {
        const res = await roomTypesApi.getById(roomTypeId);
        if (res.data) setRoom(res.data);
      } catch (err) {
        console.error("Error loading room:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRoom();
  }, [roomTypeId]);

  const calculateNights = () => {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const diff = Math.max(1, Math.round((end - start) / (1000 * 3600 * 24)));
    return isNaN(diff) ? 1 : diff;
  };

  const nights = calculateNights();
  const subtotal = room ? nights * room.basePrice : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const availableRoom = room?.rooms?.find((r) => r.status === "AVAILABLE");

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await couponsApi.validateCoupon(couponCode.trim(), subtotal, roomTypeId);
      if (res.data) {
        setAppliedCoupon(res.data);
      }
    } catch (err: any) {
      setCouponError(err.message || "Invalid coupon code.");
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleConfirmAndPay = async () => {
    setError(null);

    if (!availableRoom) {
      setError("No available room for this room type. Please choose another room.");
      return;
    }

    if (!user?.name) {
      setError("Please log in to complete your reservation.");
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Create Booking
      const bookingRes = await bookingsApi.create({
        roomId: availableRoom.id,
        checkIn,
        checkOut,
        adults: Number(numAdults),
        children: Number(numChildren),
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        specialRequest: specialRequests.trim() || undefined,
        guests: [
          {
            fullName: user.name,
            email: user.email,
            phone: user.phone ?? null,
            isPrimary: true,
          },
        ],
      });

      if (!bookingRes.data?.id) {
        throw new Error("Booking creation failed.");
      }

      const bookingId = bookingRes.data.id;

      // Step 2: Create Stripe Checkout Session & Redirect
      const paymentRes = await paymentsApi.createCheckoutSession(
        bookingId,
        `${window.location.origin}/checkout/result/${bookingId}?status=success`,
        `${window.location.origin}/checkout/result/${bookingId}?status=cancelled`
      );

      if (paymentRes.data?.url) {
        window.location.href = paymentRes.data.url;
      } else {
        router.push(`/checkout/result/${bookingId}?status=success`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create booking. Please try again.");
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <CheckoutSkeleton />;
  }

  if (!room) {
    return (
      <div className="p-8 text-center bg-card rounded-2xl border border-border">
        <h2 className="text-xl font-bold text-foreground">Room Not Found</h2>
        <p className="text-muted-foreground mt-2">The selected room type is unavailable.</p>
        <Link href="/rooms" className="mt-4 inline-block">
          <Button variant="outline">← Back to Rooms</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Complete Your Reservation</h1>
          <p className="text-sm text-muted-foreground mt-1">Review stay details and proceed to Stripe Checkout</p>
        </div>
        <Link
          href={`/rooms/${room.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary flex-shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Room
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reservation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Room Info */}
          <div className="p-6 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl flex-shrink-0">
              🏨
            </div>
            <div className="flex-1">
              <Badge variant="primary" className="mb-1">{room.bedType} BED</Badge>
              <h2 className="text-xl font-bold text-foreground">{room.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Max {room.maxGuests} Guests • ৳{room.basePrice} / night</p>
              <p className="text-xs mt-1">
                {availableRoom ? (
                  <span className="font-semibold text-emerald-600">Room {availableRoom.roomNumber} available • Floor {availableRoom.floor ?? "-"}</span>
                ) : (
                  <span className="font-semibold text-rose-600">No rooms available for the selected dates</span>
                )}
              </p>
            </div>
          </div>

          {/* Dates & Guest Selection */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="text-lg font-bold text-foreground">1. Stay Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Check-In Date
                </label>
                <input
                  type="date"
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
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

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

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                Special Requests (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="High floor, late check-in, dietary preferences..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              <span>2. Promo Coupon</span>
            </h3>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code (e.g. WELCOME10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden uppercase"
              />
              <Button type="submit" variant="outline" disabled={validatingCoupon || !couponCode}>
                {validatingCoupon ? "Checking..." : "Apply"}
              </Button>
            </form>

            {appliedCoupon && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Coupon '{appliedCoupon.code}' Applied!
                </span>
                <span>-৳{appliedCoupon.discountAmount} Off</span>
              </div>
            )}

            {couponError && (
              <p className="text-xs text-rose-500 font-semibold">{couponError}</p>
            )}
          </div>
        </div>

        {/* Price Breakdown & Stripe Trigger */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-6 lg:sticky lg:top-24">
            <h3 className="text-lg font-bold text-foreground border-b border-border pb-3">Price Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>৳{room.basePrice} x {nights} nights</span>
                <span>৳{subtotal}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-৳{discountAmount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-border flex justify-between font-extrabold text-foreground text-lg">
                <span>Total Due</span>
                <span className="text-primary">৳{finalTotal}</span>
              </div>
            </div>

            <Button
              onClick={handleConfirmAndPay}
              disabled={submitting || !availableRoom}
              variant="primary"
              size="lg"
              className="w-full font-bold gap-2 shadow-lg"
            >
              <CreditCard className="h-5 w-5" />
              <span>{submitting ? "Processing..." : !availableRoom ? "No Rooms Available" : "Proceed to Stripe Checkout"}</span>
            </Button>

            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Secure 256-bit encrypted checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingCreationPage({ params }: { params: Promise<{ roomTypeId: string }> }) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <BookingCreationContent roomTypeId={resolvedParams.roomTypeId} />
    </Suspense>
  );
}

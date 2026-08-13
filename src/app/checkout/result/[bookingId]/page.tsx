"use client";

import { useState, useEffect, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { bookingsApi, Booking } from "@/lib/api/bookings";
import { paymentsApi } from "@/lib/api/payments";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { CheckCircle2, XCircle, CalendarCheck, ArrowRight, RotateCcw, Home } from "lucide-react";

function PaymentResultContent({ bookingId }: { bookingId: string }) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const isSuccess = status === "success";

  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (isSuccess) {
        try {
          await paymentsApi.confirmPayment(bookingId);
        } catch {}
      }
      try {
        const res = await bookingsApi.getMyBookingById(bookingId);
        if (active && res.data) setBooking(res.data);
      } catch {}
    };
    load();
    return () => {
      active = false;
    };
  }, [bookingId, isSuccess]);

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-card border border-border shadow-xl text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mt-6">Payment Successful!</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Thank you for your payment. Your booking
          {booking ? <span className="font-bold text-foreground"> #{booking.bookingNumber}</span> : null} has been
          confirmed.
        </p>

        <div className="mt-8 space-y-3">
          <Link href={`/customer/bookings/${bookingId}`} className="block">
            <Button variant="primary" size="lg" className="w-full font-bold gap-2">
              <CalendarCheck className="h-5 w-5" />
              <span>View Booking Details</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/customer/bookings" className="block">
            <Button variant="outline" size="lg" className="w-full font-semibold">
              Go to My Bookings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 rounded-3xl bg-card border border-border shadow-xl text-center">
      <div className="mx-auto h-20 w-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
        <XCircle className="h-10 w-10 text-amber-500" />
      </div>
      <h1 className="text-2xl font-extrabold text-foreground mt-6">Payment Cancelled</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Your payment session was cancelled. No charges were made. You can retry or review your reservation anytime.
      </p>

      <div className="mt-8 space-y-3">
        <Link href={`/customer/bookings/${bookingId}`} className="block">
          <Button variant="primary" size="lg" className="w-full font-bold gap-2">
            <RotateCcw className="h-5 w-5" />
            <span>Retry Payment</span>
          </Button>
        </Link>
        <Link href="/rooms" className="block">
          <Button variant="outline" size="lg" className="w-full font-semibold gap-2">
            <Home className="h-4 w-4" />
            Continue Browsing Rooms
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentResultPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<Loading text="Loading payment result..." />}>
      <PaymentResultContent bookingId={resolvedParams.bookingId} />
    </Suspense>
  );
}

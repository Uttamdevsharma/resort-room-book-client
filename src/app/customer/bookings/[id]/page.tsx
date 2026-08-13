"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { bookingsApi, Booking } from "@/lib/api/bookings";
import { paymentsApi } from "@/lib/api/payments";
import { Badge, getStatusBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";
import { Calendar, CreditCard, XCircle, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Ticket } from "lucide-react";

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const paymentStatusBanner = searchParams.get("payment");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cancellation Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Pay Now State
  const [paying, setPaying] = useState(false);

  const fetchBooking = async () => {
    setIsLoading(true);
    try {
      const res = await bookingsApi.getMyBookingById(resolvedParams.id);
      if (res.data) setBooking(res.data);
    } catch (err) {
      console.error("Error loading booking details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAfterPayment = async () => {
    setIsLoading(true);
    try {
      await paymentsApi.confirmPayment(resolvedParams.id);
    } catch (err) {
      console.error("Error confirming payment:", err);
    }
    try {
      const res = await bookingsApi.getMyBookingById(resolvedParams.id);
      if (res.data) setBooking(res.data);
    } catch (err) {
      console.error("Error loading booking details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (paymentStatusBanner === "success") {
      loadAfterPayment();
    } else {
      fetchBooking();
    }
  }, [resolvedParams.id, paymentStatusBanner]);

  const handlePayNow = async () => {
    if (!booking) return;
    setPaying(true);
    try {
      const res = await paymentsApi.createCheckoutSession(
        booking.id,
        `${window.location.origin}/customer/bookings/${booking.id}?payment=success`,
        `${window.location.origin}/customer/bookings/${booking.id}?payment=cancelled`
      );
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      alert(err.message || "Failed to initiate payment.");
    } finally {
      setPaying(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!booking) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await bookingsApi.cancelMyBooking(booking.id, cancelReason);
      setCancelModalOpen(false);
      fetchBooking();
    } catch (err: any) {
      setCancelError(err.message || "Failed to cancel booking.");
    } finally {
      setCancelling(false);
    }
  };

  if (isLoading) {
    return <Loading text="Loading booking record..." />;
  }

  if (!booking) {
    return (
      <div className="p-8 text-center bg-card rounded-2xl border border-border">
        <h2 className="text-xl font-bold text-foreground">Booking Not Found</h2>
        <Link href="/customer/bookings" className="mt-4 inline-block">
          <Button variant="outline">← Back to My Bookings</Button>
        </Link>
      </div>
    );
  }

  const isCancellable = ["PENDING_PAYMENT", "CONFIRMED"].includes(booking.bookingStatus);
  const needsPayment = Number(booking.dueAmount) > 0 && booking.bookingStatus !== "CANCELLED";

  return (
    <div className="space-y-6">
      <Link href="/customer/bookings" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to My Bookings
      </Link>

      {/* Payment Success Banner */}
      {paymentStatusBanner === "success" && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <div>
            <span className="font-bold block">Payment Received Successfully!</span>
            <span>Your booking has been updated and confirmed.</span>
          </div>
        </div>
      )}

      {paymentStatusBanner === "cancelled" && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <span className="font-bold block">Payment Session Cancelled</span>
            <span>You can complete payment anytime before your check-in date.</span>
          </div>
        </div>
      )}

      {/* Booking Header */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">#{booking.bookingNumber}</h1>
            <Badge variant={getStatusBadgeVariant(booking.bookingStatus)}>{booking.bookingStatus}</Badge>
            <Badge variant={getStatusBadgeVariant(booking.paymentStatus)} size="sm">{booking.paymentStatus}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {needsPayment && (
            <Button onClick={handlePayNow} disabled={paying} variant="primary" className="gap-2 font-bold shadow-md flex-1 md:flex-none">
              <CreditCard className="h-4 w-4" />
              <span>{paying ? "Redirecting..." : `Pay Due (৳${booking.dueAmount})`}</span>
            </Button>
          )}

          {isCancellable && (
            <Button onClick={() => setCancelModalOpen(true)} variant="outline" className="text-rose-500 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30">
              <XCircle className="h-4 w-4 mr-1" /> Cancel Booking
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stay & Room Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-foreground">Stay Schedule</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/30">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold block">Check-In</span>
                <span className="text-base font-bold text-foreground mt-0.5 block">{new Date(booking.checkIn).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold block">Check-Out</span>
                <span className="text-base font-bold text-foreground mt-0.5 block">{new Date(booking.checkOut).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold block">Duration</span>
                <span className="text-base font-bold text-foreground mt-0.5 block">{booking.nights} Nights ({booking.adults + booking.children} Guests)</span>
              </div>
            </div>
          </div>

          {/* Reserved Rooms List */}
          {booking.roomType && (
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-foreground">Reserved Accommodations</h2>
              <div className="space-y-3">
                <div key={booking.roomType.id} className="p-4 rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground text-base block">{booking.roomType.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {booking.room ? `Room #${booking.room.roomNumber}` : "Physical room will be assigned at check-in"}
                    </span>
                  </div>
                  <span className="font-extrabold text-primary">৳{booking.pricePerNight} / night</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Financial Summary */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">Financial Statement</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>৳{booking.subtotal}</span>
              </div>
              {Number(booking.discountAmount) > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({booking.couponCode || "Promo"})</span>
                  <span>-৳{booking.discountAmount}</span>
                </div>
              )}
              {Number(booking.taxAmount) > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes & Fees</span>
                  <span>৳{booking.taxAmount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-border flex justify-between font-extrabold text-foreground text-base">
                <span>Total Charge</span>
                <span>৳{booking.totalAmount}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Amount Paid</span>
                <span>৳{booking.paidAmount}</span>
              </div>
              {Number(booking.dueAmount) > 0 ? (
                <div className="flex justify-between text-rose-500 font-extrabold text-base pt-2 border-t border-border">
                  <span>Balance Due</span>
                  <span>৳{booking.dueAmount}</span>
                </div>
              ) : (
                <div className="flex justify-between text-emerald-600 font-extrabold text-base pt-2 border-t border-border">
                  <span>Balance Due</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Fully Paid
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Reservation"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to cancel booking <strong className="text-foreground">#{booking.bookingNumber}</strong>?
          </p>

          {cancelError && (
            <p className="text-xs text-rose-500 font-semibold">{cancelError}</p>
          )}

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
              Cancellation Reason (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Change of plans, emergency..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setCancelModalOpen(false)}>
              Keep Booking
            </Button>
            <Button
              onClick={handleConfirmCancel}
              disabled={cancelling}
              variant="primary"
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {cancelling ? "Cancelling..." : "Confirm Cancel"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

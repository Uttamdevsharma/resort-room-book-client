"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded-md ${className}`} aria-hidden="true" />
  );
}

function PageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </div>
  );
}

export function MyBookingsSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading your bookings">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-6 bg-card border border-border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="space-y-2 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pt-4 sm:pt-0 border-t sm:border-0 border-border">
            <div className="space-y-1.5 text-right">
              <Skeleton className="h-3 w-24 ml-auto" />
              <Skeleton className="h-6 w-16 ml-auto" />
            </div>
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between gap-4 py-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function PaymentsSkeleton() {
  return (
    <div
      className="bg-card border border-border rounded-2xl overflow-hidden"
      role="status"
      aria-label="Loading payment records"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
            <tr>
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="p-4">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, row) => (
              <tr key={row}>
                {Array.from({ length: 6 }).map((_, col) => (
                  <td key={col} className="p-4">
                    <Skeleton className={`h-4 ${col === 0 ? "w-24" : col === 3 ? "w-16" : "w-20 max-w-full"}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RefundsSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading refund records">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-6 bg-card border border-border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="space-y-2 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-56 max-w-full" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="space-y-1.5 text-right">
            <Skeleton className="h-3 w-24 ml-auto" />
            <Skeleton className="h-7 w-28 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="status" aria-label="Loading your reviews">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 bg-card border border-border rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-44 max-w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="pt-2 border-t border-border flex justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationsSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Checking notifications">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 rounded-2xl border border-border bg-card space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-48 max-w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-3 w-16 flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-8 max-w-2xl" role="status" aria-label="Loading profile">
      <PageHeaderSkeleton />
      {Array.from({ length: 2 }).map((_, card) => (
        <div key={card} className="p-6 bg-card border border-border rounded-2xl space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-44" />
          </div>
          {Array.from({ length: 3 }).map((_, field) => (
            <div key={field} className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function BookingDetailsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading booking details">
      <Skeleton className="h-4 w-40" />
      <div className="p-6 bg-card border border-border rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-44" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/30">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-28 max-w-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
            <Skeleton className="h-6 w-56" />
            <div className="p-4 rounded-xl border border-border flex items-center justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-56 max-w-full" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
            <Skeleton className="h-6 w-44 border-b border-border pb-3" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

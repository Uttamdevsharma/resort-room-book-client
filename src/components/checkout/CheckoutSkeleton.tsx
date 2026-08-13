"use client";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer bg-muted ${className}`} aria-hidden="true" />;
}

export function CheckoutSkeleton() {
  return (
    <div className="space-y-8 min-h-[42rem] lg:min-h-[46rem]" role="status" aria-label="Loading reservation">
      {/* Header / back button area */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-3">
          <SkeletonBlock className="h-8 w-64 max-w-full rounded-lg" />
          <SkeletonBlock className="h-4 w-48 rounded-full" />
        </div>
        <SkeletonBlock className="h-4 w-24 rounded-full flex-shrink-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reservation Form Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Summary Card */}
          <div className="p-6 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <SkeletonBlock className="h-16 w-16 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <SkeletonBlock className="h-5 w-20 rounded-full" />
              <SkeletonBlock className="h-6 w-56 max-w-full rounded-md" />
              <SkeletonBlock className="h-4 w-64 max-w-full rounded-full" />
              <SkeletonBlock className="h-4 w-44 rounded-full" />
            </div>
          </div>

          {/* Stay Details / Form Fields */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
            <SkeletonBlock className="h-6 w-36 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <SkeletonBlock className="h-3 w-24 rounded-full" />
                  <SkeletonBlock className="h-10 w-full rounded-lg" />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <SkeletonBlock className="h-3 w-40 rounded-full" />
              <SkeletonBlock className="h-14 w-full rounded-lg" />
            </div>
          </div>

          {/* Coupon Section */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
            <SkeletonBlock className="h-6 w-40 rounded-md" />
            <div className="flex gap-2">
              <SkeletonBlock className="h-10 flex-1 rounded-lg" />
              <SkeletonBlock className="h-10 w-20 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Price Summary Column */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-6 lg:sticky lg:top-24">
            <SkeletonBlock className="h-6 w-40 rounded-md border-b border-border pb-3" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <SkeletonBlock className="h-4 w-32 rounded-full" />
                <SkeletonBlock className="h-4 w-12 rounded-full" />
              </div>
              <div className="flex justify-between">
                <SkeletonBlock className="h-4 w-24 rounded-full" />
                <SkeletonBlock className="h-4 w-12 rounded-full" />
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <SkeletonBlock className="h-5 w-24 rounded-full" />
                  <SkeletonBlock className="h-6 w-16 rounded-md" />
                </div>
              </div>
            </div>

            {/* Stripe Checkout Button */}
            <SkeletonBlock className="h-12 w-full rounded-xl" />
            <SkeletonBlock className="mx-auto h-4 w-56 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { SkeletonBlock, TableSkeleton } from "./SkeletonBase";

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="status" aria-label="Loading overview stats">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="flex justify-between items-start">
              <SkeletonBlock className="h-3 w-24 rounded-full" />
              <SkeletonBlock className="h-9 w-9 rounded-xl" />
            </div>
            <SkeletonBlock className="h-8 w-16 rounded-md" />
            <SkeletonBlock className="h-3 w-32 rounded-full" />
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-5 w-36 rounded-md" />
          <SkeletonBlock className="h-4 w-16 rounded-full" />
        </div>
        <TableSkeleton
          bare
          label="Loading recent bookings"
          rows={5}
          columns={[
            { className: "h-4 w-20" },
            { className: "h-4 w-32" },
            { className: "h-4 w-36" },
            { className: "h-4 w-16" },
            { cell: "badge" },
          ]}
        />
      </div>
    </div>
  );
}

"use client";

import { PageHeaderSkeleton, TableSkeleton } from "./SkeletonBase";

export function StaffManagementSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton action />

      <div
        className="p-4 bg-card border border-border rounded-2xl"
        role="status"
        aria-label="Loading staff search"
      >
        <div className="h-10 w-full rounded-lg skeleton-shimmer bg-muted" />
      </div>

      <TableSkeleton
        label="Loading staff members"
        columns={[
          { className: "h-4 w-36" },
          { className: "h-4 w-48" },
          { cell: "badge", className: "h-5 w-24 rounded-full" },
          { cell: "button", className: "h-8 w-16 rounded-lg", align: "right" },
        ]}
      />
    </div>
  );
}

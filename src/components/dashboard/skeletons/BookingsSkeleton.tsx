"use client";

import { TableSkeleton } from "./SkeletonBase";

export function BookingsSkeleton() {
  return (
    <TableSkeleton
      rows={8}
      pagination
      label="Loading bookings"
      columns={[
        { className: "h-4 w-20" },
        { className: "h-4 w-36" },
        { className: "h-4 w-36" },
        { className: "h-4 w-16" },
        { cell: "badge" },
        { cell: "badge" },
        { cell: "button", className: "h-8 w-28 rounded-lg", align: "right" },
      ]}
    />
  );
}

"use client";

import { TableSkeleton } from "./SkeletonBase";

export function AmenitiesSkeleton() {
  return (
    <TableSkeleton
      label="Loading amenities"
      columns={[
        { className: "h-4 w-36" },
        { className: "h-4 w-24" },
        { className: "h-4 w-52" },
        { cell: "button", className: "h-8 w-20 rounded-lg", align: "right" },
      ]}
    />
  );
}

"use client";

import { TableSkeleton } from "./SkeletonBase";

export function FacilitiesSkeleton() {
  return (
    <TableSkeleton
      label="Loading facilities"
      columns={[
        { className: "h-4 w-32" },
        { className: "h-4 w-28" },
        { className: "h-4 w-56" },
        { cell: "badge" },
        { cell: "button", className: "h-8 w-20 rounded-lg", align: "right" },
      ]}
    />
  );
}

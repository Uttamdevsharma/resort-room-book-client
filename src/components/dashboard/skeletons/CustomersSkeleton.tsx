"use client";

import { TableSkeleton } from "./SkeletonBase";

export function CustomersSkeleton() {
  return (
    <TableSkeleton
      label="Loading customers"
      columns={[
        { className: "h-4 w-36" },
        { className: "h-4 w-48" },
        { className: "h-4 w-28" },
        { cell: "badge" },
        { cell: "button", className: "h-8 w-32 rounded-lg", align: "right" },
      ]}
    />
  );
}

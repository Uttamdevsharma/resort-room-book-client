"use client";

import { TableSkeleton } from "./SkeletonBase";

export function ReviewsSkeleton() {
  return (
    <TableSkeleton
      rows={8}
      pagination
      label="Loading reviews"
      columns={[
        { className: "h-4 w-28" },
        { className: "h-4 w-28" },
        { className: "h-4 w-20" },
        { className: "h-4 w-32" },
        { className: "h-4 w-44" },
        { cell: "badge" },
        { className: "h-4 w-24" },
        { cell: "button", className: "h-8 w-32 rounded-lg", align: "right" },
      ]}
    />
  );
}

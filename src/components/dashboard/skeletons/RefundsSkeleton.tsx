"use client";

import { TableSkeleton } from "./SkeletonBase";

export function RefundsSkeleton() {
  return (
    <TableSkeleton
      rows={8}
      pagination
      label="Loading refunds"
      columns={[
        { className: "h-4 w-16" },
        { className: "h-4 w-28" },
        { className: "h-4 w-24" },
        { className: "h-4 w-16" },
        { cell: "badge" },
        { className: "h-4 w-40" },
        { className: "h-4 w-24" },
      ]}
    />
  );
}

"use client";

import { TableSkeleton } from "./SkeletonBase";

export function PaymentsSkeleton() {
  return (
    <TableSkeleton
      rows={8}
      pagination
      label="Loading payments"
      columns={[
        { className: "h-4 w-32" },
        { className: "h-4 w-20" },
        { className: "h-4 w-24" },
        { className: "h-4 w-16" },
        { cell: "badge" },
        { className: "h-4 w-24" },
      ]}
    />
  );
}

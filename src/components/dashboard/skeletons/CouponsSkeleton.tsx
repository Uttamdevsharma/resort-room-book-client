"use client";

import { TableSkeleton } from "./SkeletonBase";

export function CouponsSkeleton() {
  return (
    <TableSkeleton
      label="Loading coupons"
      columns={[
        { className: "h-4 w-24" },
        { className: "h-4 w-20" },
        { className: "h-4 w-16" },
        { className: "h-4 w-16" },
        { className: "h-4 w-32" },
        { className: "h-4 w-16" },
        { cell: "badge" },
        { cell: "button", className: "h-8 w-20 rounded-lg", align: "right" },
      ]}
    />
  );
}

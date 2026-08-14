"use client";

import { TableSkeleton } from "./SkeletonBase";

export function PricingRulesSkeleton() {
  return (
    <TableSkeleton
      label="Loading pricing rules"
      columns={[
        { className: "h-4 w-32" },
        { className: "h-4 w-32" },
        { className: "h-4 w-12" },
        { className: "h-4 w-44" },
        { cell: "badge" },
        { cell: "button", className: "h-8 w-20 rounded-lg", align: "right" },
      ]}
    />
  );
}

"use client";

import { TableSkeleton } from "./SkeletonBase";

export function RoomsSkeleton() {
  return (
    <TableSkeleton
      label="Loading physical rooms"
      columns={[
        { className: "h-4 w-16" },
        { className: "h-4 w-32" },
        { className: "h-4 w-12" },
        { cell: "badge" },
        { cell: "button", className: "h-8 w-28 rounded-lg", align: "right" },
        { cell: "button", className: "h-8 w-9 rounded-lg", align: "right" },
      ]}
    />
  );
}

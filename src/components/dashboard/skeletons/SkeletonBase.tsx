"use client";

export interface TableColumnSkeleton {
  className?: string;
  align?: "left" | "right";
  cell?: "text" | "badge" | "image" | "button";
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer bg-muted ${className}`} aria-hidden="true" />;
}

export function PageHeaderSkeleton({ action = true }: { action?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" role="status" aria-label="Loading page">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-56 max-w-full rounded-md" />
        <SkeletonBlock className="h-4 w-80 max-w-full rounded-full" />
      </div>
      {action && <SkeletonBlock className="h-10 w-36 rounded-lg" />}
    </div>
  );
}

export function FilterBarSkeleton({ select = true }: { select?: boolean }) {
  return (
    <div className="p-4 bg-card border border-border rounded-2xl flex flex-col sm:flex-row gap-4" role="status" aria-label="Loading filters">
      <SkeletonBlock className="h-10 flex-1 rounded-lg" />
      {select && <SkeletonBlock className="h-10 w-36 rounded-lg" />}
      <SkeletonBlock className="h-10 w-24 rounded-lg" />
    </div>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="p-4 flex items-center justify-between gap-4 border-t border-border" role="status" aria-label="Loading pagination">
      <SkeletonBlock className="h-4 w-36 rounded-full" />
      <div className="flex items-center gap-2">
        <SkeletonBlock className="h-8 w-8 rounded-md" />
        <SkeletonBlock className="h-8 w-8 rounded-md" />
        <SkeletonBlock className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}

export function TableSkeleton({
  columns,
  rows = 6,
  bare = false,
  pagination = false,
  className = "",
  label = "Loading data",
}: {
  columns: TableColumnSkeleton[];
  rows?: number;
  bare?: boolean;
  pagination?: boolean;
  className?: string;
  label?: string;
}) {
  const table = (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm" aria-hidden="true">
        <thead className="bg-muted/40 border-b border-border">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={`p-4 ${col.align === "right" ? "text-right" : ""}`}>
                <SkeletonBlock className="h-3 w-16 rounded-full" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row}>
              {columns.map((col, i) => (
                <td key={i} className={`p-4 ${col.align === "right" ? "text-right" : ""}`}>
                  {col.cell === "image" ? (
                    <SkeletonBlock className={col.className || "h-12 w-16 rounded-lg"} />
                  ) : col.cell === "badge" ? (
                    <SkeletonBlock className={col.className || "h-5 w-16 rounded-full"} />
                  ) : col.cell === "button" ? (
                    <SkeletonBlock className={col.className || "h-8 w-24 rounded-lg"} />
                  ) : (
                    <SkeletonBlock className={col.className || "h-4 w-24 rounded-md"} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (bare) {
    return <div role="status" aria-label={label}>{table}</div>;
  }

  return (
    <div className={`bg-card border border-border rounded-2xl overflow-hidden shadow-xs ${className}`} role="status" aria-label={label}>
      {table}
      {pagination && <PaginationSkeleton />}
    </div>
  );
}

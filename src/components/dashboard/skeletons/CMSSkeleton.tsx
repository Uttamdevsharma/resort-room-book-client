"use client";

import { SkeletonBlock } from "./SkeletonBase";

export function CMSSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs" role="status" aria-label="Loading homepage sections">
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-5 w-5 rounded-md" />
              <SkeletonBlock className="h-5 w-24 rounded-full" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <SkeletonBlock className="h-4 w-40 rounded-md" />
              <SkeletonBlock className="h-3 w-56 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-5 w-16 rounded-full" />
              <SkeletonBlock className="h-3 w-14 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-8 w-8 rounded-md" />
              <SkeletonBlock className="h-8 w-8 rounded-md" />
              <SkeletonBlock className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

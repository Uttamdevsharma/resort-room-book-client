"use client";

import { SkeletonBlock } from "./SkeletonBase";

export function ResortSettingsSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl" role="status" aria-label="Loading resort settings">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-48 rounded-md" />
        <SkeletonBlock className="h-4 w-96 max-w-full rounded-full" />
      </div>
      <div className="p-6 bg-card border border-border rounded-2xl shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <SkeletonBlock className="h-3 w-28 rounded-full" />
              <SkeletonBlock className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <SkeletonBlock className="h-3 w-40 rounded-full" />
          <SkeletonBlock className="h-16 w-full rounded-lg" />
        </div>
        <SkeletonBlock className="h-11 w-48 rounded-lg" />
      </div>
    </div>
  );
}

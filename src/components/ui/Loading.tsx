"use client";

export interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

export function Loading({
  size = "md",
  className = "",
  text,
  fullScreen = false,
  overlay = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center"
    : overlay
    ? "absolute inset-0 flex items-center justify-center"
    : "flex items-center justify-center";

  const bgClass = fullScreen || overlay ? "bg-background/80 backdrop-blur-sm" : "";

  return (
    <div className={`${containerClasses} ${bgClass} ${className}`} role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <svg
          className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        </svg>
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    </div>
  );
}

export function LoadingDots({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const dotSizes = {
    sm: "h-1.5 w-1.5",
    md: "h-2.5 w-2.5",
    lg: "h-3.5 w-3.5",
  };

  return (
    <div className={`flex items-center gap-1 ${className}`} role="status" aria-live="polite" aria-label="Loading">
      <span className={`${dotSizes[size]} bg-primary rounded-full animate-bounce [animation-delay:0ms]`} />
      <span className={`${dotSizes[size]} bg-primary rounded-full animate-bounce [animation-delay:150ms]`} />
      <span className={`${dotSizes[size]} bg-primary rounded-full animate-bounce [animation-delay:300ms]`} />
    </div>
  );
}

export function LoadingBar({ className = "", height = 2 }: { className?: string; height?: number }) {
  return (
    <div className={`w-full h-${height} bg-muted rounded-full overflow-hidden ${className}`} role="progressbar" aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full bg-primary animate-pulse" style={{ width: "100%" }} />
    </div>
  );
}

export function LoadingSkeleton({ className = "", variant = "text", width, height, count = 1 }: {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  count?: number;
}) {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`
        animate-pulse bg-muted rounded
        ${variant === "circular" ? "rounded-full" : variant === "rectangular" ? "rounded-lg" : "rounded"}
        ${className}
      `}
      style={{ width, height }}
      aria-hidden="true"
    />
  ));

  return <div className="space-y-2">{skeletons}</div>;
}
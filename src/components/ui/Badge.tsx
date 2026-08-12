import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "outline";
  size?: "sm" | "md" | "lg";
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: BadgeProps) {
  const baseStyle =
    "inline-flex items-center justify-center font-semibold rounded-full tracking-wide transition-colors";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const variantStyles = {
    default: "bg-muted text-muted-foreground border border-border",
    primary: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary/10 text-secondary border border-secondary/20",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    outline: "bg-transparent border border-border text-foreground",
  };

  return (
    <span
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function getStatusBadgeVariant(status?: string): "success" | "warning" | "danger" | "primary" | "secondary" | "default" {
  if (!status) return "default";
  const s = status.toUpperCase();
  if (["CONFIRMED", "PAID", "APPROVED", "AVAILABLE", "ACTIVE", "SUCCEEDED", "CHECKED_IN"].includes(s)) {
    return "success";
  }
  if (["PENDING", "PENDING_PAYMENT", "PARTIALLY_PAID", "PROCESSING"].includes(s)) {
    return "warning";
  }
  if (["CANCELLED", "FAILED", "REJECTED", "SUSPENDED", "INACTIVE", "MAINTENANCE", "NO_SHOW"].includes(s)) {
    return "danger";
  }
  if (["OCCUPIED", "CHECKED_OUT", "REFUNDED"].includes(s)) {
    return "primary";
  }
  return "default";
}

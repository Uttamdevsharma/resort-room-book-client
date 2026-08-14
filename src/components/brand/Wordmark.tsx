interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  tone?: "gradient" | "light" | "foreground";
  secondary?: string;
  className?: string;
}

const sizeClasses = {
  sm: { name: "text-base", sub: "text-[9px]" },
  md: { name: "text-lg sm:text-xl", sub: "text-[8px] sm:text-[9px]" },
  lg: { name: "text-xl sm:text-2xl", sub: "text-[9px] sm:text-[10px]" },
} as const;

/**
 * Brand wordmark: "CoxBay" in the display serif with a small
 * letterspaced "RESORT" sub-line (or a custom secondary label).
 */
export function Wordmark({
  size = "md",
  tone = "gradient",
  secondary = "RESORT",
  className,
}: WordmarkProps) {
  const nameClasses =
    tone === "light"
      ? "text-white"
      : tone === "foreground"
        ? "text-foreground group-hover:text-primary"
        : "bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent";

  const subClasses =
    tone === "light"
      ? "text-white/70"
      : tone === "foreground"
        ? "text-muted-foreground"
        : "text-primary/60";

  return (
    <span className={className}>
      <span
        className={`block font-display font-semibold leading-none tracking-tight transition-colors duration-200 ${sizeClasses[size].name} ${nameClasses}`}
      >
        CoxBay
      </span>
      <span
        className={`mt-0.5 block font-bold uppercase leading-none tracking-[0.32em] transition-colors duration-200 ${sizeClasses[size].sub} ${subClasses}`}
      >
        {secondary}
      </span>
    </span>
  );
}

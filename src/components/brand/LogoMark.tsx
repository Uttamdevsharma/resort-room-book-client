interface LogoMarkProps {
  className?: string;
}

/**
 * Custom brand mark: a geometric "C" (cove) with two calm wave lines
 * flowing through its opening. Renders in `currentColor` so it adapts
 * to both light and dark themes.
 */
export function LogoMark({ className = "h-5 w-5" }: LogoMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M37.02 13.07A17 17 0 1 0 37.02 34.93"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M13.5 20.2C18 17.4 30 17.4 34.5 20.2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M13.5 27.8C18 25 30 25 34.5 27.8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

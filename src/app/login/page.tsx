"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/context/AuthContext";
import { getDefaultDashboardPath } from "@/lib/auth/roles";
import { Lock, Mail, AlertCircle, ArrowRight, CheckCircle } from "lucide-react";
import { BACKEND_ORIGIN } from "@/lib/api/client";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const validateInputs = () => {
    const errors: Record<string, string> = {};
    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email format";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";
    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateInputs()) return;
    setSubmitting(true);

    try {
      const result = await login({ email, password });
      if (!result.success) {
        setError(result.error || "Invalid credentials. Please try again.");
        return;
      }
      router.push(redirect || getDefaultDashboardPath(result.roles || []));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (inputErrors[field]) {
      setInputErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-svh flex flex-col bg-background">
      <Navbar />

      <main className="relative flex-1 flex items-center justify-center px-4 pt-24 pb-16 sm:pt-28 md:pt-32 md:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_42%,color-mix(in_srgb,var(--primary)_8%,transparent),transparent_70%)]"
        />

        <div className="relative w-full max-w-md">
          <div
            className="relative w-full overflow-hidden bg-card border border-border/60 rounded-2xl p-7 sm:p-10 shadow-xl shadow-primary/[0.08] ring-1 ring-black/[0.02] transition-all duration-700 ease-out
              animate-fade-up
              data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0
              opacity-0 translate-y-6"
            data-visible={isVisible}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
            />

            <div className="text-center mb-8">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto font-bold text-2xl ring-1 ring-primary/15 transition-transform duration-300 hover:scale-105">
                <Lock className="h-8 w-8" strokeWidth={2} />
              </div>
              <h1 className="mt-5 text-3xl font-extrabold text-foreground tracking-tight font-display">Welcome Back</h1>
              <p className="mt-2 text-base text-muted-foreground font-medium">Sign in to access your account</p>
            </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-start gap-3 animate-fade-up" style={{ animationDelay: "100ms" }}>
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
              <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => validateInputs()}
                  className={`w-full pl-12 pr-4 py-3.5 text-base bg-background border rounded-xl transition-all duration-200
                    placeholder:text-muted-foreground/60
                    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
                    ${inputErrors.email ? "border-error focus:ring-error" : "border-border hover:border-border-hover focus:border-primary"}
                  `}
                  aria-invalid={inputErrors.email ? "true" : "false"}
                  aria-describedby={inputErrors.email ? "email-error" : undefined}
                />
                {inputErrors.email && (
                  <p id="email-error" className="mt-2 text-sm text-error flex items-center gap-1.5" role="alert">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {inputErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" aria-hidden="true" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  onBlur={() => validateInputs()}
                  minLength={6}
                  className={`w-full pl-12 pr-4 py-3.5 text-base bg-background border rounded-xl transition-all duration-200
                    placeholder:text-muted-foreground/60
                    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
                    ${inputErrors.password ? "border-error focus:ring-error" : "border-border hover:border-border-hover focus:border-primary"}
                  `}
                  aria-invalid={inputErrors.password ? "true" : "false"}
                  aria-describedby={inputErrors.password ? "password-error" : undefined}
                />
                {inputErrors.password && (
                  <p id="password-error" className="mt-2 text-sm text-error flex items-center gap-1.5" role="alert">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {inputErrors.password}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              loading={submitting}
              className="w-full font-bold gap-2 mt-2 animate-fade-up"
              style={{ animationDelay: "250ms" }}
            >
              <span>{submitting ? "Signing in..." : "Sign In"}</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </form>

          <div className="mt-6 animate-fade-up" style={{ animationDelay: "280ms" }}>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-card text-xs text-muted-foreground uppercase tracking-wider">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                // eslint-disable-next-line @next/next/no-location-assign-relative-destination
                window.location.assign(`${BACKEND_ORIGIN}/auth/google`);
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium bg-background border border-border rounded-xl hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M22.56 11.68c0-.92-.08-1.8-.24-2.65-.17.03-2.42.03-2.42.03-.14.58-.43 1.11-.85 1.55-.42.44-.94.78-1.53 1.02-.6.24-1.24.36-1.9.36-.66 0-1.3-.12-1.9-.36-.59-.24-1.11-.58-1.53-1.02-.42-.44-.71-.97-.85-1.55 0 0-2.25 0-2.42-.03-.17.85-.25 1.73-.25 2.65 0 1.71.34 3.35 1 4.84.66 1.49 1.57 2.85 2.72 4.09.8.86 1.75 1.62 2.83 2.26.86.5 1.78.88 2.77 1.09.99.21 2 .31 3 .31.94 0 1.86-.09 2.77-.31.99-.21 1.91-.59 2.77-1.09.97-.54 1.88-1.15 2.83-2.26C21.46 16.47 22.56 13.75 22.56 11.68Z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.25c2.12 0 4.05.79 5.52 2.14.02.01.04.01.06.03-.22 1.08-.87 2.08-1.85 2.82-.03.02-.06.03-.09.05-.3-.3-.65-.56-1.04-.79-.39-.23-.8-.42-1.25-.54.02.01.04.01.06.03.02-.02.04-.02.06-.04-.03-.02-.05-.04-.08-.06-3.6-3.6-3.6-3.6-4.8-4.27-.62-.31-.97-.91-1.08-1.58v-.06c.08-.57.53-1.15 1.08-1.39.74-.38 1.58-.61 2.44-.61Z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground pt-7 border-t border-border animate-fade-up" style={{ animationDelay: "300ms" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-primary hover:text-primary-hover transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left transition-transform duration-200">
              Create Account
            </Link>
          </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center" />}>
      <LoginContent />
    </Suspense>
  );
}

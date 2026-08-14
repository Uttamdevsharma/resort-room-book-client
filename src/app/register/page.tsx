"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/context/AuthContext";
import { getDefaultDashboardPath } from "@/lib/auth/roles";
import { User, Mail, Lock, AlertCircle, ArrowRight, CheckCircle, Shield } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong">("weak");

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 2) return "weak";
    if (score <= 4) return "medium";
    return "strong";
  };

  const validateInputs = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Full name is required";
    else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";
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
      const result = await register({ name: name.trim(), email, password });
      if (!result.success) {
        setError(result.error || "Registration failed. Please try again.");
        return;
      }
      router.push(getDefaultDashboardPath(result.roles || []));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "password") {
      setPassword(value);
      setPasswordStrength(calculatePasswordStrength(value));
    }
    if (inputErrors[field]) {
      setInputErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const strengthConfig = {
    weak: { label: "Weak", color: "text-rose-500", bg: "bg-rose-500", width: "33%" },
    medium: { label: "Medium", color: "text-amber-500", bg: "bg-amber-500", width: "66%" },
    strong: { label: "Strong", color: "text-emerald-500", bg: "bg-emerald-500", width: "100%" },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div
          className="w-full max-w-md bg-card border border-border/50 rounded-2xl p-8 md:p-10 shadow-2xl backdrop-blur-sm transition-all duration-700 ease-out
            animate-fade-up
            data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0
            opacity-0 translate-y-6"
          data-visible={isVisible}
        >
          <div className="text-center space-y-1.5 mb-2">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto font-bold text-2xl transition-transform duration-300 hover:scale-105">
              <Shield className="h-7 w-7" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight font-display">Create Account</h1>
            <p className="text-base text-muted-foreground font-medium">Join ResortStay for exclusive benefits</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-start gap-3 animate-fade-up" style={{ animationDelay: "100ms" }}>
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
              <label htmlFor="name" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" aria-hidden="true" />
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onBlur={() => validateInputs()}
                  className={`w-full pl-12 pr-4 py-3.5 text-base bg-background border rounded-xl transition-all duration-200
                    placeholder:text-muted-foreground/60
                    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
                    ${inputErrors.name ? "border-error focus:ring-error" : "border-border hover:border-border-hover focus:border-primary"}
                  `}
                  aria-invalid={inputErrors.name ? "true" : "false"}
                  aria-describedby={inputErrors.name ? "name-error" : undefined}
                />
                {inputErrors.name && (
                  <p id="name-error" className="mt-2 text-sm text-error flex items-center gap-1.5" role="alert">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {inputErrors.name}
                  </p>
                )}
              </div>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
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
                  placeholder="john@example.com"
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

            <div className="animate-fade-up" style={{ animationDelay: "250ms" }}>
              <label htmlFor="password" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" aria-hidden="true" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
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
                  aria-describedby={inputErrors.password ? "password-error" : "password-hint"}
                />
                {inputErrors.password && (
                  <p id="password-error" className="mt-2 text-sm text-error flex items-center gap-1.5" role="alert">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {inputErrors.password}
                  </p>
                )}
                {!inputErrors.password && password && (
                  <div id="password-hint" className="mt-3" role="status" aria-live="polite">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Password strength</span>
                      <span className={`text-xs font-semibold ${strengthConfig[passwordStrength].color}`}>
                        {strengthConfig[passwordStrength].label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strengthConfig[passwordStrength].bg} rounded-full transition-all duration-300 ease-out`}
                        style={{ width: strengthConfig[passwordStrength].width }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              loading={submitting}
              className="w-full font-bold gap-2 mt-4 animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <span>{submitting ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground pt-6 border-t border-border animate-fade-up" style={{ animationDelay: "350ms" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:text-primary-hover transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left transition-transform duration-200">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

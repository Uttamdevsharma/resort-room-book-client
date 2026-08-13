"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sun, Moon, Bell, User, LogOut, LayoutDashboard, CreditCard, ChevronDown, CalendarCheck, Receipt, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/context/AuthContext";
import { notificationsApi } from "@/lib/api/notifications";

export function Navbar() {
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkMode = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      notificationsApi.getUnreadCount()
        .then((res) => {
          if (res.data?.unreadCount !== undefined) {
            setUnreadCount(res.data.unreadCount);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, pathname]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newIsDark);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const accountMenuItems = [
    { label: "My Bookings", href: "/customer/bookings", icon: CalendarCheck },
    { label: "Payments", href: "/customer/payments", icon: CreditCard },
    { label: "Refunds", href: "/customer/refunds", icon: Receipt },
    { label: "Reviews", href: "/customer/reviews", icon: Star },
    { label: "Notifications", href: "/customer/notifications", icon: Bell },
    { label: "Profile Settings", href: "/customer/profile", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header
        className={`
          fixed top-0 left-0 right-0 z-40
          bg-background/95 backdrop-blur-md border-b border-border
          transition-all duration-300
          ${isScrolled ? "shadow-md py-1" : "py-2"}
        `}
        role="banner"
      >
        <nav className="container flex h-14 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-foreground hover:opacity-80 transition-opacity"
            aria-label="ResortStay - Home"
          >
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              ResortStay
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:gap-1">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive("/") && pathname === "/"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Home
            </Link>
            <Link
              href="/rooms"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive("/rooms")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Rooms & Suites
            </Link>
            <Link
              href="/facilities"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive("/facilities")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Facilities
            </Link>

            {isAuthenticated && !isStaff && (
              <>
                <Link
                  href="/customer/bookings"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/customer/bookings")
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  My Bookings
                </Link>
              </>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-full w-9 h-9 p-0"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {!isStaff && (
                  <Link href="/customer/notifications">
                    <Button variant="ghost" size="sm" className="relative rounded-full w-9 h-9 p-0">
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
                      )}
                    </Button>
                  </Link>
                )}

                {isStaff ? (
                  <Link href="/dashboard">
                    <Button variant="primary" size="sm" className="gap-1.5 shadow-sm">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen((open) => !open)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-transparent px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
                      aria-haspopup="menu"
                      aria-expanded={isProfileMenuOpen}
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="hidden sm:inline max-w-[120px] truncate">{user?.name}</span>
                      <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isProfileMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)} />
                        <div
                          className="absolute right-0 mt-2 w-60 z-20 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
                          role="menu"
                        >
                          <div className="px-4 py-3 border-b border-border">
                            <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                          </div>
                          <div className="py-1.5">
                            {accountMenuItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setIsProfileMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                  role="menuitem"
                                >
                                  <Icon className="h-4 w-4" />
                                  <span>{item.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-full w-9 h-9 p-0">
                  <LogOut className="h-4 w-4 text-muted-foreground hover:text-rose-500" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-muted"
            >
              Home
            </Link>
            <Link
              href="/rooms"
              className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-muted"
            >
              Rooms & Suites
            </Link>
            <Link
              href="/facilities"
              className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-muted"
            >
              Facilities
            </Link>

            {isAuthenticated && (
              <>
                <hr className="my-2 border-border" />
                {isStaff ? (
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-lg text-base font-semibold text-primary hover:bg-muted"
                  >
                    Staff Dashboard
                  </Link>
                ) : (
                  <div className="space-y-2">
                    {accountMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-muted"
                        >
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}
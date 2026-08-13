"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Reveal, useInView } from "@/components/home/Reveal";
import { FACILITY_IMAGES, facilityImage } from "@/components/home/FacilityDirectory";
import { facilitiesApi, Facility } from "@/lib/api/facilities";
import {
  ArrowRight,
  BedDouble,
  Check,
  ChefHat,
  ConciergeBell,
  Sparkles,
  Umbrella,
  Wifi,
  ZoomIn,
} from "lucide-react";

/* ---------------------------------------------------------------------------
 * Static content
 * ------------------------------------------------------------------------- */
const highlights = [
  {
    icon: ConciergeBell,
    title: "24/7 Concierge",
    text: "Round-the-clock staff ready to arrange everything from airport pickups to private dinners.",
  },
  {
    icon: Wifi,
    title: "Complimentary Wi-Fi",
    text: "Fast, reliable connections in every room and across all public spaces.",
  },
  {
    icon: Umbrella,
    title: "Private Beach Access",
    text: "A quiet stretch of golden sand reserved exclusively for ResortStay guests.",
  },
  {
    icon: ChefHat,
    title: "Farm-to-table Dining",
    text: "Menus built around organic, locally sourced ingredients and seasonal flavours.",
  },
];

interface Spotlight {
  key: string;
  name: string;
  image: string;
  kicker: string;
  description: string;
  points: string[];
  ctaLabel: string;
}

const featuredSpotlights: Spotlight[] = [
  {
    key: "Infinity Pool",
    name: "Infinity Pool",
    image: FACILITY_IMAGES.pool,
    kicker: "Water & Views",
    description:
      "Our oceanfront infinity pool dissolves into the horizon — temperature-controlled swims, private cabanas, and sunsets that linger long after check-out.",
    points: [
      "Temperature-controlled 25-metre infinity edge",
      "Private cabanas with dedicated butler service",
      "Heated poolside soaking tubs",
    ],
    ctaLabel: "Swim With Us",
  },
  {
    key: "Wellness Spa",
    name: "Wellness Spa",
    image: FACILITY_IMAGES.spa,
    kicker: "Rest & Renewal",
    description:
      "Step into a world of slow rituals — signature organic treatments, steam and sauna suites, and therapists who turn tension into a distant memory.",
    points: [
      "Signature organic treatments and massages",
      "Steam, sauna and cold-plunge recovery suites",
      "Certified therapists and couples packages",
    ],
    ctaLabel: "Recharge With Us",
  },
];

const galleryItems = [
  {
    src: FACILITY_IMAGES.pool,
    title: "Infinity Pool",
    subtitle: "Oceanfront swims at golden hour",
    span: "md:col-span-8",
    ratio: "aspect-[16/9]",
  },
  {
    src: FACILITY_IMAGES.spa,
    title: "Wellness Spa",
    subtitle: "Slow rituals and organic treatments",
    span: "md:col-span-4",
    ratio: "aspect-[4/3]",
  },
  {
    src: FACILITY_IMAGES.dining,
    title: "Gourmet Dining",
    subtitle: "Farm-to-table local flavours",
    span: "md:col-span-4",
    ratio: "aspect-[4/3]",
  },
  {
    src: FACILITY_IMAGES.fitness,
    title: "Fitness Center",
    subtitle: "State-of-the-art equipment, 24/7",
    span: "md:col-span-4",
    ratio: "aspect-[4/3]",
  },
  {
    src: FACILITY_IMAGES.kids,
    title: "Kids' Zone",
    subtitle: "Supervised play for little guests",
    span: "md:col-span-4",
    ratio: "aspect-[4/3]",
  },
  {
    src: FACILITY_IMAGES.beach,
    title: "Private Beach",
    subtitle: "Your own stretch of golden sand",
    span: "md:col-span-12",
    ratio: "aspect-[16/7]",
  },
];

/* ---------------------------------------------------------------------------
 * Sections
 * ------------------------------------------------------------------------- */
function FacilitiesHero() {
  return (
    <section className="relative flex min-h-[72svh] items-center overflow-hidden bg-navy-950">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={FACILITY_IMAGES.pool}
          alt="ResortStay infinity pool framed by palms at dusk"
          fill
          priority
          sizes="100vw"
          className="animate-hero-zoom object-cover will-change-transform"
        />
      </div>

      {/* Overlays — shade only where text and nav sit */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-navy-950/55" />

      {/* Content */}
      <div className="container relative z-10 flex flex-1 flex-col justify-center pt-32 pb-16 sm:pt-36">
        <div className="max-w-2xl">
          <p className="animate-fade-up inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-blue-200">
            <span className="h-px w-8 bg-blue-200/60" aria-hidden="true" />
            Resort Facilities
          </p>

          <h1
            className="animate-fade-up mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "150ms" }}
          >
            Everything you need,{" "}
            <span className="italic text-blue-200">moments from your door</span>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-blue-50/90 sm:text-lg"
            style={{ animationDelay: "300ms" }}
          >
            From an oceanfront infinity pool to restorative spa rituals, every facility at
            ResortStay is designed around calm, comfort, and slow, unhurried days.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-col items-start gap-4 sm:flex-row"
            style={{ animationDelay: "450ms" }}
          >
            <Link href="/rooms">
              <Button
                size="lg"
                className="group gap-2 rounded-full bg-gradient-to-r from-primary to-blue-600 px-8 font-semibold shadow-xl shadow-blue-950/50 hover:from-primary-hover hover:to-blue-700"
              >
                <BedDouble className="h-5 w-5" />
                Explore Rooms
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/#facilities-directory">
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full border border-white/25 bg-white/5 px-8 font-semibold text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/10"
              >
                <Sparkles className="h-4 w-4" />
                Browse Facilities
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickHighlights() {
  return (
    <section className="bg-muted/30 py-14 lg:py-16">
      <div className="container">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight, i) => {
            const Icon = highlight.icon;
            return (
              <Reveal key={highlight.title} delay={i * 100} className="h-full">
                <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{highlight.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {highlight.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FacilitySpotlight({
  spotlight,
  found,
  reversed,
}: {
  spotlight: Spotlight;
  found?: Facility;
  reversed: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const name = found?.name ?? spotlight.name;
  const description = found?.description ?? spotlight.description;
  const image = found ? facilityImage(found) : spotlight.image;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Image */}
      <div ref={ref} className={`relative w-full ${reversed ? "lg:order-2" : ""}`}>
        <div
          aria-hidden="true"
          className="absolute -right-4 -top-4 hidden h-full w-full rounded-3xl border-2 border-primary/20 sm:block md:-right-6 md:-top-6"
        />
        <div
          className={`relative overflow-hidden rounded-3xl shadow-2xl shadow-navy-950/10 transition-[clip-path,opacity] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            inView ? "opacity-100 [clip-path:inset(0_0_0%_0)]" : "opacity-0 [clip-path:inset(0_0_100%_0)]"
          }`}
        >
          <Image
            src={image}
            alt={name}
            width={800}
            height={560}
            className={`h-auto w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              inView ? "scale-100" : "scale-110"
            }`}
            unoptimized={!image.startsWith("/")}
          />
        </div>
      </div>

      {/* Content */}
      <div className={`mt-4 lg:mt-0 ${reversed ? "lg:order-1" : ""}`}>
        <Reveal>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-8 bg-primary/60" aria-hidden="true" />
            {spotlight.kicker}
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h3 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
            {name}
          </h3>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        </Reveal>

        <ul className="mt-6 space-y-3">
          {spotlight.points.map((point, i) => (
            <Reveal key={point} delay={300 + i * 100} as="li">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{point}</span>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={600}>
          <div className="mt-8">
            <Link href="/rooms">
              <Button
                size="lg"
                className="group gap-2 rounded-full bg-gradient-to-r from-primary to-blue-600 px-7 font-semibold shadow-lg shadow-blue-950/20 hover:from-primary-hover hover:to-blue-700"
              >
                {spotlight.ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function FeaturedSection({ facilities }: { facilities: Facility[] }) {
  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center lg:mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Featured Facilities
          </span>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Spaces worth slowing down in
          </h2>
          <p className="mt-3 text-muted-foreground">
            Two resort icons our guests return to again and again.
          </p>
        </Reveal>

        <div className="space-y-20 lg:space-y-28">
          {featuredSpotlights.map((spotlight, i) => {
            const found = facilities.find(
              (f) => f.name.trim().toLowerCase() === spotlight.key.toLowerCase()
            );
            return (
              <FacilitySpotlight
                key={spotlight.key}
                spotlight={spotlight}
                found={found}
                reversed={i % 2 === 1}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExperienceGallery() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Experience Gallery
          </span>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            A taste of resort life
          </h2>
          <p className="mt-3 text-muted-foreground">
            Wander through the spaces and rituals that make a ResortStay holiday feel
            effortlessly unhurried.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-12 md:gap-6">
          {galleryItems.map((item, index) => (
            <Reveal
              key={item.src}
              as="div"
              delay={index * 80}
              className={`w-full ${item.span}`}
            >
              <div className="group block w-full cursor-default overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
                <div className={`relative w-full overflow-hidden bg-muted ${item.ratio}`}>
                  <Image
                    src={item.src}
                    alt={item.subtitle}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                    unoptimized
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 opacity-0 transition-all duration-300 translate-y-3 group-hover:translate-y-0 group-hover:opacity-100">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-white">{item.title}</p>
                    </div>
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      <ZoomIn className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */
export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    let cancelled = false;

    facilitiesApi
      .listPublic()
      .then((res) => {
        if (!cancelled) setFacilities(res.data ?? []);
      })
      .catch((err) => {
        console.error("Failed to load facilities:", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <FacilitiesHero />
        <QuickHighlights />
        <FeaturedSection facilities={facilities} />
        <ExperienceGallery />
      </main>

      <Footer />
    </div>
  );
}

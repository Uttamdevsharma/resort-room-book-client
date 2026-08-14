"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Waves, Leaf, HeartHandshake, Star } from "lucide-react";
import { Reveal, useInView } from "./Reveal";

const features = [
  {
    icon: Waves,
    title: "Beachfront serenity",
    text: "Wake to the rhythm of the waves, just a few soft steps from your door.",
  },
  {
    icon: Leaf,
    title: "Mindful by design",
    text: "Locally sourced materials, organic cuisine, and architecture that breathes with the breeze.",
  },
  {
    icon: HeartHandshake,
    title: "Quiet, timeless service",
    text: "A devoted team that anticipates every unhurried need without ever hovering.",
  },
];

export function AboutSection() {
  const { ref: imageRef, inView: imageInView } = useInView<HTMLDivElement>();

  return (
    <section id="about" className="scroll-mt-16 py-20 lg:py-28">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ---------- Image ---------- */}
          <div ref={imageRef} className="relative mx-auto mb-10 w-full max-w-xl lg:mb-0 lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -right-4 -top-4 hidden h-full w-full rounded-3xl border-2 border-primary/20 sm:block md:-right-6 md:-top-6"
            />
            <div
              className={`relative overflow-hidden rounded-3xl shadow-2xl shadow-navy-950/10 transition-[clip-path,opacity] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                imageInView
                  ? "opacity-100 [clip-path:inset(0_0_0%_0)]"
                  : "opacity-0 [clip-path:inset(0_0_100%_0)]"
              }`}
            >
              <Image
                src="/about/images.jpg"
                alt="Sunlit private terrace overlooking the resort grounds and lagoon"
                width={547}
                height={365}
                className={`h-auto w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  imageInView ? "scale-100" : "scale-110"
                }`}
                unoptimized
              />
            </div>

            <div
              className={`absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-xl shadow-navy-950/10 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:left-6 md:-left-8 ${
                imageInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: "350ms" }}
            >
              <div className="flex items-center gap-0.5 text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">4.9 / 5.0</p>
                <p className="text-xs text-muted-foreground">Rated by 2,400+ guests</p>
              </div>
            </div>
          </div>

          {/* ---------- Content ---------- */}
          <div className="mt-6 lg:mt-0">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                <span className="h-px w-8 bg-primary/60" aria-hidden="true" />
                About Our Resort
              </span>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                A sanctuary where the sea{" "}
                <span className="italic text-primary">sets the pace</span>
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Tucked between swaying palms and the endless blue, CoxBay Resort is a
                boutique coastal haven built for slow mornings and unhurried evenings.
                Think soft linen, warm wood, and salt on the air — quiet luxury living
                in every small detail.
              </p>
            </Reveal>

            <ul className="mt-8 space-y-5">
              {features.map((feature, i) => (
                <Reveal key={feature.title} delay={250 + i * 120} as="li">
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {feature.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={650}>
              <div className="mt-10">
                <Link href="/facilities">
                  <button
                    type="button"
                    className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
                  >
                    Explore Facilities
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

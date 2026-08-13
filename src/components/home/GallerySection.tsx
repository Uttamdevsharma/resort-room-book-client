"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Reveal } from "./Reveal";

interface GalleryImage {
  src: string;
  title: string;
  alt: string;
  ratioClass: string;
  spanClass: string;
  width: number;
  height: number;
}

const galleryImages: GalleryImage[] = [
  {
    src: "/gallery/gal1.jfif",
    title: "Lagoon View",
    alt: "The resort lagoon glowing in golden hour",
    ratioClass: "aspect-[3/2]",
    spanClass: "md:col-span-7",
    width: 500,
    height: 333,
  },
  {
    src: "/gallery/gal2.jfif",
    title: "Poolside Detail",
    alt: "A quiet corner beside the infinity pool",
    ratioClass: "aspect-square",
    spanClass: "md:col-span-5",
    width: 192,
    height: 192,
  },
  {
    src: "/gallery/gal3.jfif",
    title: "Garden Suite",
    alt: "Soft morning light falling through a garden suite",
    ratioClass: "aspect-[4/3]",
    spanClass: "md:col-span-4",
    width: 516,
    height: 387,
  },
  {
    src: "/gallery/gal4.jfif",
    title: "Oceanfront Horizon",
    alt: "The open horizon stretching from the oceanfront deck",
    ratioClass: "aspect-[16/9]",
    spanClass: "md:col-span-8",
    width: 263,
    height: 148,
  },
  {
    src: "/gallery/gal5.jfif",
    title: "Sundown Terrace",
    alt: "Sundown settling gently over the terrace",
    ratioClass: "aspect-[3/2]",
    spanClass: "md:col-span-5",
    width: 678,
    height: 452,
  },
  {
    src: "/gallery/gal6.jfif",
    title: "Palm Court",
    alt: "The shaded palm court bathed in midday light",
    ratioClass: "aspect-[7/5]",
    spanClass: "md:col-span-7",
    width: 529,
    height: 378,
  },
];

export function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(false);

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(null);

  const step = (dir: 1 | -1) => {
    setActiveIndex((current) =>
      current === null ? current : (current + dir + galleryImages.length) % galleryImages.length
    );
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || typeof window === "undefined") return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const onMove = (e: MouseEvent) => {
      const rect = gallery.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (inside) {
        cursorRef.current?.style.setProperty(
          "transform",
          `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
        );
        setCursorVisible(true);
      } else {
        setCursorVisible(false);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const activeImage = activeIndex === null ? null : galleryImages[activeIndex];

  return (
    <section id="gallery" className="scroll-mt-16 py-20 lg:py-28">
      <div className="container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            The Gallery
          </span>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            A glimpse of what awaits
          </h2>
          <p className="mt-3 text-muted-foreground">
            From sun-drenched pools to candlelit evenings — wander through the spaces
            where our guests slow down.
          </p>
        </Reveal>

        <div
          ref={galleryRef}
          className="grid grid-cols-1 items-start gap-5 md:grid-cols-12 md:gap-6"
        >
          {galleryImages.map((image, index) => (
            <Reveal
              key={image.src}
              as="div"
              delay={index * 90}
              className={`w-full ${image.spanClass}`}
            >
              <button
                type="button"
                onClick={() => openLightbox(index)}
                aria-label={`Open ${image.title} in lightbox`}
                className="group block w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                <div
                  className={`relative w-full overflow-hidden bg-muted ${image.ratioClass}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                    unoptimized
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-white">
                        {image.title}
                      </p>
                    </div>
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      <ZoomIn className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Custom hover cursor (desktop only) */}
        <div
          ref={cursorRef}
          aria-hidden="true"
          className={`pointer-events-none fixed left-0 top-0 z-40 hidden transition-opacity duration-300 md:flex ${
            cursorVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white shadow-2xl shadow-navy-950/30 backdrop-blur-md">
            <ZoomIn className="h-5 w-5" />
          </span>
        </div>

        {/* Lightbox */}
        {activeIndex !== null &&
          activeImage &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className="lightbox-fade fixed inset-0 z-[60] flex flex-col bg-navy-950/95 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-label={`${activeImage.title} — image ${activeIndex + 1} of ${galleryImages.length}`}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(galleryImages.length).padStart(2, "0")}
                </p>
                <button
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Close gallery"
                  className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Stage */}
              <div className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-16">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                <div key={activeImage.src} className="lightbox-in flex max-h-full flex-col items-center">
                  <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    width={activeImage.width}
                    height={activeImage.height}
                    sizes="90vw"
                    className="h-auto max-h-[70vh] w-auto max-w-[92vw] rounded-xl object-contain shadow-2xl shadow-navy-950/50"
                    unoptimized
                  />
                  <div className="mt-6 text-center">
                    <h3 className="font-display text-xl text-white sm:text-2xl">
                      {activeImage.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/60">{activeImage.alt}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>,
            document.body
          )}
      </div>
    </section>
  );
}

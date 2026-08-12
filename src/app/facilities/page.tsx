"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loading } from "@/components/ui/Loading";
import { facilitiesApi, Facility } from "@/lib/api/facilities";
import { Palmtree, Clock, Sparkles } from "lucide-react";

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFacilities() {
      try {
        const res = await facilitiesApi.list();
        if (res.data) setFacilities(res.data);
      } catch (err) {
        console.error("Error loading facilities:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFacilities();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="pt-24 pb-12 bg-muted/20 border-b border-border">
        <div className="container max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Luxury Experience
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Resort Facilities & Services
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            From infinity pools overlooking the horizon to award-winning spas, explore everything our resort has to offer.
          </p>
        </div>
      </div>

      <main className="flex-1 py-16">
        <div className="container">
          {isLoading ? (
            <Loading text="Loading resort facilities..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilities.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-card rounded-2xl border border-border p-6 shadow-xs hover:shadow-lg transition-all space-y-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
                    🌴
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{fac.name}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {fac.description || "Designed for your ultimate relaxation and comfort during your retreat."}
                  </p>

                  {fac.openingHours && (
                    <div className="pt-3 border-t border-border flex items-center gap-2 text-xs font-semibold text-primary">
                      <Clock className="h-4 w-4" />
                      <span>{fac.openingHours}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

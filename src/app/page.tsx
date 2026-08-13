"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Loading } from "@/components/ui/Loading";
import { roomTypesApi, RoomType } from "@/lib/api/roomTypes";
import { facilitiesApi, Facility } from "@/lib/api/facilities";
import { reviewsApi, Review } from "@/lib/api/reviews";
import { cmsApi, HomepageSection } from "@/lib/api/cms";
import { Search, Calendar, Users, Star, ArrowRight, ShieldCheck, Sparkles, MapPin, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [guests, setGuests] = useState("2");
  const [bedType, setBedType] = useState("");

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [roomsRes, facilitiesRes, reviewsRes] = await Promise.allSettled([
          roomTypesApi.list({ limit: 6, status: "ACTIVE" }),
          facilitiesApi.list(),
          reviewsApi.listPublicReviews({ limit: 4 }),
        ]);

        if (roomsRes.status === "fulfilled" && roomsRes.value.data) {
          setRoomTypes(roomsRes.value.data);
        }
        if (facilitiesRes.status === "fulfilled" && facilitiesRes.value.data) {
          setFacilities(facilitiesRes.value.data);
        }
        if (reviewsRes.status === "fulfilled" && reviewsRes.value.data) {
          setReviews(reviewsRes.value.data);
        }
      } catch (err) {
        console.error("Error loading home page data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-900/10 via-background to-background">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Luxury Seaside & Mountain Retreat</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Experience Extraordinary{" "}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Resort Living
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Immerse yourself in world-class comfort, private suites, and unforgettable dining. Book directly with guaranteed best rates.
            </p>

            {/* Quick Search Card */}
            <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-card border border-border shadow-xl backdrop-blur-lg">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = `/rooms?search=${encodeURIComponent(searchQuery)}&guests=${guests}&bedType=${bedType}`;
                }}
                className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-left"
              >
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Search Room
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Suite, Villa, King..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4+ Guests</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Bed Type
                  </label>
                  <select
                    value={bedType}
                    onChange={(e) => setBedType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
                  >
                    <option value="">All Bed Types</option>
                    <option value="KING">King Bed</option>
                    <option value="QUEEN">Queen Bed</option>
                    <option value="DOUBLE">Double Bed</option>
                    <option value="TWIN">Twin Bed</option>
                  </select>
                </div>

                <div className="sm:col-span-3 lg:col-span-1 flex items-end">
                  <Button type="submit" variant="primary" className="w-full h-[42px] gap-2 font-semibold">
                    <Search className="h-4 w-4" />
                    <span>Find Rooms</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Room Types */}
      <section className="py-16 bg-muted/20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Accommodations
              </span>
              <h2 className="text-3xl font-extrabold text-foreground mt-1">
                Featured Suites & Rooms
              </h2>
            </div>
            <Link href="/rooms">
              <Button variant="outline" className="gap-2">
                <span>View All Rooms</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <Loading text="Loading luxury rooms..." />
          ) : roomTypes.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-border">
              <p className="text-muted-foreground">No rooms available currently.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {roomTypes.slice(0, 6).map((room) => {
                const mediaUrl = room.media?.[0]?.url || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80";
                return (
                  <div
                    key={room.id}
                    className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-muted">
                      <Image
                        src={mediaUrl}
                        alt={room.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="primary" size="lg" className="backdrop-blur-md shadow-md">
                          ৳{room.basePrice} / night
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span className="font-semibold uppercase">{room.bedType} BED</span>
                          <span>Max {room.maxGuests} Guests</span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {room.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {room.description || "Designed with timeless elegance and panoramic views for your dream stay."}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {room.roomTypeAmenities?.length || 0} Amenities included
                        </span>
                        <Link href={`/rooms/${room.id}`}>
                          <Button variant="primary" size="sm" className="gap-1">
                            <span>Book Now</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Facilities Showcase */}
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              World Class Amenities
            </span>
            <h2 className="text-3xl font-extrabold text-foreground mt-1">
              Resort Facilities & Services
            </h2>
            <p className="text-muted-foreground mt-2">
              Everything you need for rest, relaxation, and rejuvenation during your stay.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.length > 0 ? (
              facilities.map((fac) => (
                <div key={fac.id} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors shadow-xs">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">
                    ✨
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{fac.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {fac.description || "Enjoy premium hospitality and curated experiences."}
                  </p>
                  {fac.openingHours && (
                    <span className="inline-block mt-3 text-xs font-semibold text-primary">
                      Hours: {fac.openingHours}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">🏊‍♂️</div>
                  <h3 className="text-lg font-bold text-foreground">Infinity Pool</h3>
                  <p className="text-sm text-muted-foreground mt-2">Temperature-controlled oceanfront infinity pool with private cabanas.</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">💆‍♀️</div>
                  <h3 className="text-lg font-bold text-foreground">Holistic Spa</h3>
                  <p className="text-sm text-muted-foreground mt-2">Full service wellness treatments, massages, and sauna suites.</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">🍽️</div>
                  <h3 className="text-lg font-bold text-foreground">Gourmet Dining</h3>
                  <p className="text-sm text-muted-foreground mt-2">Michelin-guided restaurants featuring organic local seafood and fine wines.</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4">🏋️‍♂️</div>
                  <h3 className="text-lg font-bold text-foreground">Fitness Center</h3>
                  <p className="text-sm text-muted-foreground mt-2">24/7 high-end gym equipment with personal trainers on demand.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Guest Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Testimonials</span>
              <h2 className="text-3xl font-extrabold text-foreground mt-1">Guest Experiences</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <h4 className="font-bold text-foreground text-base">{rev.title || "Unforgettable Stay"}</h4>
                  <p className="text-sm text-muted-foreground italic">"{rev.comment}"</p>
                  <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span>— {rev.user?.name || "Valued Guest"}</span>
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center max-w-3xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready for Your Next Unforgettable Vacation?</h2>
          <p className="text-primary-light text-lg">Book directly with us today and enjoy exclusive member discounts, zero booking fees, and free cancellation.</p>
          <div className="pt-4 flex justify-center gap-4">
            <Link href="/rooms">
              <Button size="lg" className="bg-white text-primary hover:bg-zinc-100 font-bold px-8 shadow-lg">
                Explore Rooms & Book Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

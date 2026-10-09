import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import { ShieldCheck, Sparkles, PackageCheck, Truck } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <section className="bg-parchment border-b border-wood/10 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-turmeric/20 text-wood text-xs font-semibold tracking-wider uppercase">
            New Delhi • Ghar Jaisa Swaad
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold text-wood tracking-tight leading-tight">
            Bring Home the Taste of Tradition.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-wood/80 leading-relaxed">
            Welcome to <strong>Homelike Spice Co.</strong> We bring thoughtfully sourced, freshly packed Indian kitchen essentials straight from New Delhi to your home—crafted for everyday meals that taste just like home.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-forest text-white font-semibold rounded-full hover:bg-forest/90 transition"
            >
              Shop Now
            </Link>
            <Link
              href="/story"
              className="px-8 py-3.5 bg-white text-wood border border-wood/20 font-semibold rounded-full hover:bg-cream transition"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-wood">Our Essential Spices</h2>
          <p className="text-wood/70 mt-2">
            Convenient 50 g packs sealed for freshness and everyday cooking.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* WHY SHOP WITH US */}
      <section className="bg-parchment py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-wood text-center mb-12">
            Why Shop With Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-cream p-6 rounded-2xl border border-wood/10">
              <Sparkles className="w-8 h-8 text-turmeric mb-3" />
              <h3 className="font-bold text-wood mb-2">No Artificial Colours</h3>
              <p className="text-sm text-wood/75">
                Pure ground spices without synthetic dyes or unnecessary fillers.
              </p>
            </div>
            <div className="bg-cream p-6 rounded-2xl border border-wood/10">
              <PackageCheck className="w-8 h-8 text-forest mb-3" />
              <h3 className="font-bold text-wood mb-2">Fresh 50 g Packs</h3>
              <p className="text-sm text-wood/75">
                Sized thoughtfully so your spice box always has fresh, aromatic masalas.
              </p>
            </div>
            <div className="bg-cream p-6 rounded-2xl border border-wood/10">
              <ShieldCheck className="w-8 h-8 text-chilli mb-3" />
              <h3 className="font-bold text-wood mb-2">Honest & Transparent</h3>
              <p className="text-sm text-wood/75">
                Clear pricing, straightforward ingredients, and genuine care in every pack.
              </p>
            </div>
            <div className="bg-cream p-6 rounded-2xl border border-wood/10">
              <Truck className="w-8 h-8 text-wood mb-3" />
              <h3 className="font-bold text-wood mb-2">Reliable Dispatch</h3>
              <p className="text-sm text-wood/75">
                Prepared within an estimated 24–48 hours and delivered across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-wood mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6">
            <span className="w-10 h-10 rounded-full bg-turmeric text-white font-bold inline-flex items-center justify-center mb-4">1</span>
            <h3 className="font-bold text-wood mb-2">Choose Your Spices</h3>
            <p className="text-sm text-wood/75">Pick from our essential 50 g Haldi, Dhania, and Lal Mirch packs.</p>
          </div>
          <div className="p-6">
            <span className="w-10 h-10 rounded-full bg-forest text-white font-bold inline-flex items-center justify-center mb-4">2</span>
            <h3 className="font-bold text-wood mb-2">Careful Preparation</h3>
            <p className="text-sm text-wood/75">We pack and prepare your order in New Delhi within an estimated 24–48 hours.</p>
          </div>
          <div className="p-6">
            <span className="w-10 h-10 rounded-full bg-chilli text-white font-bold inline-flex items-center justify-center mb-4">3</span>
            <h3 className="font-bold text-wood mb-2">Doorstep Delivery</h3>
            <p className="text-sm text-wood/75">Delivered to your kitchen in an estimated 3–5 business days after dispatch.</p>
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-wood text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-wood/10">
            <h4 className="font-bold text-wood">What pack sizes are currently available?</h4>
            <p className="text-sm text-wood/80 mt-1">All our initial spices (Haldi, Dhania, and Lal Mirch) are available in fresh 50 g packs to preserve aroma and prevent clumping.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-wood/10">
            <h4 className="font-bold text-wood">How long will my order take to arrive?</h4>
            <p className="text-sm text-wood/80 mt-1">Order preparation takes an estimated 24–48 hours. Once dispatched, delivery typically takes 3–5 business days depending on your PIN code. Please note these are estimates.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-wood/10">
            <h4 className="font-bold text-wood">How should I store the spices?</h4>
            <p className="text-sm text-wood/80 mt-1">Store in a cool, dry place away from direct sunlight in an airtight container, and always use a dry spoon.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
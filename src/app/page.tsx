import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  // Mock data for the homepage featured section
  const featuredProducts = [
  {
    slug: "lal-mirch",
    name: "Lal Mirch Powder",
    description: "Stemless Red Chilli • Stone-ground",
    price: 75,
    pack_size: "50g",
    image_url: "/images/mirch.jpg" // Changed to local path
  },
  {
    slug: "haldi",
    name: "Lakadong Haldi",
    description: "High Curcumin • Sun-Dried Turmeric",
    price: 65,
    pack_size: "50g",
    image_url: "/images/haldi.jpg" // Changed to local path
  },
  {
    slug: "dhaniya",
    name: "Dhania Powder",
    description: "Slow-Roasted • Coarse Ground Coriander",
    price: 55,
    pack_size: "50g",
    image_url: "/images/dhaniya.jpg" // Changed to local path
  }
];

  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[85vh] flex items-center justify-center bg-[#221C16]">
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[#FDFBF7]/80 uppercase tracking-[0.3em] text-sm font-semibold mb-4 block">
            Rooted in New Delhi
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-[#FDFBF7] mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Unadulterated Flavours.<br />Ghar Jaisa Swaad.
          </h1>
          <p className="text-lg md:text-xl text-[#FDFBF7]/90 mb-10 max-w-2xl mx-auto font-light">
            Small-batch, sun-dried Indian spices crafted without artificial colours or fillers. Taste the authentic warmth of home.
          </p>
          <Link href="/shop" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-[#221C16] bg-[#FDFBF7] rounded-full transition-transform hover:scale-105">
            Shop The Essential Trio
          </Link>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION BANNER */}
      <section className="bg-white border-b border-[#221C16]/10 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="text-[#1E3F20] font-bold text-lg mb-2 uppercase tracking-widest">100% Pure</h4>
            <p className="text-[#221C16]/70 text-sm">Zero artificial colours, preservatives, or cheap fillers.</p>
          </div>
          <div className="md:border-x border-[#221C16]/10">
            <h4 className="text-[#1E3F20] font-bold text-lg mb-2 uppercase tracking-widest">Small Batch</h4>
            <p className="text-[#221C16]/70 text-sm">Stone-ground in limited runs to lock in essential oils.</p>
          </div>
          <div>
            <h4 className="text-[#1E3F20] font-bold text-lg mb-2 uppercase tracking-widest">Ghar Jaisa</h4>
            <p className="text-[#221C16]/70 text-sm">Authentic heritage recipes sourced straight from Indian farms.</p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (THE TRIO) */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#221C16] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Essential Trio
          </h2>
          <p className="text-[#221C16]/70 max-w-2xl mx-auto">
            The foundation of every Indian kitchen. Beautifully packed, freshly ground, and delivered straight to your door in our custom Homelike Box.
          </p>
        </div>
        
        {/* Reusing the ProductCard component we just built */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* 4. BRAND STORY SECTION */}
      <section className="bg-[#221C16] text-[#FDFBF7] py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="h-96 bg-[#FDFBF7]/10 rounded-2xl overflow-hidden relative flex items-center justify-center">
            {/* Replace this div with an actual image of you or your spices later */}
            <span className="text-[#FDFBF7]/50 font-light italic">Image: Spices on a rustic table</span>
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Born from a simple realization in New Delhi.
            </h2>
            <p className="text-[#FDFBF7]/80 mb-6 font-light leading-relaxed">
              We were tired of opening supermarket spice packets only to find dull colors and sawdust-like textures. True Indian spices are volatile, aromatic, and rich in natural oils. 
            </p>
            <p className="text-[#FDFBF7]/80 mb-8 font-light leading-relaxed">
              Homelike Spice Co. was created to bring back the purity of hand-pounded, sun-dried spices. No massive factories, no long warehouse shelf-lives. Just pure flavour.
            </p>
            <Link href="/story" className="border-b border-[#FDFBF7] pb-1 uppercase tracking-widest text-sm hover:text-[#1E3F20] hover:border-[#1E3F20] transition-colors">
              Read Our Story
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
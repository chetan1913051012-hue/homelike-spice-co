import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[10s] hover:scale-110"
        style={{ backgroundImage: "url('/images/spices-bg.jpg')" }} // Add a high-res photo of spices here
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-wood/80 via-wood/60 to-wood/90" />

      {/* Floating Foreground Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <span className="animate-fade-in-up opacity-0 text-parchment/80 uppercase tracking-[0.3em] text-sm font-semibold mb-4 block delay-100">
          Rooted in New Delhi
        </span>
        
        <h1 className="animate-fade-in-up opacity-0 text-5xl md:text-7xl font-bold text-parchment mb-6 leading-tight delay-200 text-glow" style={{ fontFamily: "'Playfair Display', serif" }}>
          Unadulterated Flavours.<br />Ghar Jaisa Swaad.
        </h1>
        
        <p className="animate-fade-in-up opacity-0 text-lg md:text-xl text-parchment/90 mb-10 max-w-2xl mx-auto font-light delay-300">
          Small-batch, sun-dried Indian spices crafted without artificial colours or fillers. Taste the authentic warmth of home.
        </p>

        {/* Premium Animated Button */}
        <div className="animate-fade-in-up opacity-0 delay-500">
          <Link href="/shop" 
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-wood bg-parchment rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(253,251,247,0.3)]">
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-forest rounded-full group-hover:w-64 group-hover:h-56"></span>
            <span className="relative group-hover:text-parchment transition-colors duration-300">Shop The Essential Trio</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[85vh] flex items-center justify-center bg-[#221C16]">
      {/* 
        If you get a nice landscape photo of spices later, you can add it back here:
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/images/real-spice-photo.jpg')" }} /> 
      */}

      {/* Foreground Content (Removed opacity-0 and animations so it works instantly) */}
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
  );
}
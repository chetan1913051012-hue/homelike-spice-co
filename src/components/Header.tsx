"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { items } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-wood/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        {/* Exact Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-full overflow-hidden border-2 border-wood/10 shadow-sm bg-white">
            <Image
              src="/logo.png"
              alt="Homelike Spice Co. Official Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <span className="block text-xl font-bold text-wood tracking-tight">
              Homelike Spice Co.
            </span>
            <span className="block text-xs text-forest italic font-medium">
              Ghar jaisa swaad
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-wood">
          <Link href="/" className="hover:text-forest transition">Home</Link>
          <Link href="/shop" className="hover:text-forest transition">Shop</Link>
          <Link href="/story" className="hover:text-forest transition">Our Story</Link>
          <Link href="/contact" className="hover:text-forest transition">Contact</Link>
        </nav>

        {/* Account & Cart */}
        <div className="flex items-center gap-5">
          <Link
            href="/account"
            className="p-2 text-wood hover:text-forest transition flex items-center gap-1.5 text-sm font-medium"
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">My Account</span>
          </Link>

          <Link
            href="/cart"
            className="relative p-2.5 bg-forest text-white rounded-full hover:bg-forest/90 transition flex items-center gap-2 px-4"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm font-semibold">{totalItems}</span>
          </Link>

          <button
            className="md:hidden p-2 text-wood"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-b border-wood/10 px-6 py-4 space-y-3 text-wood font-medium">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2">Home</Link>
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block py-2">Shop</Link>
          <Link href="/story" onClick={() => setMobileMenuOpen(false)} className="block py-2">Our Story</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2">Contact</Link>
          <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="block py-2">My Account</Link>
        </div>
      )}
    </header>
  );
}